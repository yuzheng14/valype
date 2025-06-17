import {
  parseAsync,
  type Directive,
  type Statement,
  type TSInterfaceDeclaration,
} from 'oxc-parser'
import { ValypeReferenceError, ValypeUnimplementedError } from './error'

export interface Export {
  /** interface name */
  interface: string
  /** schema name */
  schema: string
}

interface BaseInterfaceInfo {
  name: string
  exported: boolean
}

interface UnhandledInterfaceInfo extends BaseInterfaceInfo {
  node: TSInterfaceDeclaration
}

interface AnalyzedInterfaceInfo extends BaseInterfaceInfo {
  properties: PropertyInfo[]
  extends: string[]
}

interface PropertyInfo {
  name: string
  type: string | PropertyInfo[]
  isOptional: boolean
}

/** extract TSInterfaceDeclaration from Statement */
function extractTSInterfaceDeclaration(
  node: Directive | Statement,
): (TSInterfaceDeclaration & Pick<UnhandledInterfaceInfo, 'exported'>) | void {
  if (
    node.type === 'ExportNamedDeclaration' &&
    node.declaration?.type === 'TSInterfaceDeclaration'
  )
    // for `export interface Name ...`
    return {
      ...node.declaration,
      exported: true,
    }
  else if (node.type === 'TSInterfaceDeclaration')
    // for `interface Name ...`
    return { ...node, exported: false }
  else return
}

function analyzeInterface(
  intf: UnhandledInterfaceInfo,
  code: string,
): AnalyzedInterfaceInfo {
  const result: AnalyzedInterfaceInfo = {
    name: intf.name,
    properties: [],
    extends: [],
    exported: intf.exported,
  }

  // collect extends clauses
  if (intf.node.extends.length) {
    for (const ext of intf.node.extends) {
      if (ext.expression.type === 'Identifier') {
        result.extends.push(ext.expression.name)
      }
    }
  }

  // iterate all properties in the interface body
  for (const property of intf.node.body.body) {
    if (property.type === 'TSPropertySignature') {
      const name = code.slice(property.key.start, property.key.end)
      const typeAnnotation = property.typeAnnotation?.typeAnnotation
      let type: string | PropertyInfo[] = 'any'

      if (typeAnnotation) {
        if (typeAnnotation.type === 'TSTypeLiteral') {
          // Handle nested type literal
          type = typeAnnotation.members.map((member) => {
            if (member.type === 'TSPropertySignature') {
              const nestedName = code.slice(member.key.start, member.key.end)
              const nestedType = member.typeAnnotation
                ? code.slice(
                    member.typeAnnotation.typeAnnotation.start,
                    member.typeAnnotation.typeAnnotation.end,
                  )
                : 'any'
              return {
                name: nestedName,
                type: nestedType,
                isOptional: member.optional,
              }
            }
            return {
              name: '',
              type: 'any',
              isOptional: false,
            }
          })
        } else {
          // Handle normal type
          type = code.slice(typeAnnotation.start, typeAnnotation.end)
        }
      }

      const isOptional = property.optional
      result.properties.push({
        name,
        type,
        isOptional,
      })
    }
  }

  return result
}

/**
 * map TypeScript type to Zod schema type
 */
function mapTypeToZod(type: string | PropertyInfo[]): string {
  if (Array.isArray(type)) {
    // Handle nested type
    const properties = type
      .map((prop) => {
        const zodType = mapTypeToZod(prop.type)
        const zodField = prop.isOptional ? `${zodType}.optional()` : zodType
        return `  ${prop.name}: ${zodField}`
      })
      .join(',\n')
    return `z.object({\n${properties}\n})`
  }

  const typeLower = type.toLowerCase()

  // primitive
  if (typeLower === 'string') return 'z.string()'
  if (typeLower === 'number') return 'z.number()'
  if (typeLower === 'boolean') return 'z.boolean()'
  if (typeLower === 'date') return 'z.date()'

  // array
  if (type.endsWith('[]')) {
    const elementType = type.slice(0, -2)
    return `z.array(${mapTypeToZod(elementType)})`
  }

  // union
  if (type.includes('|')) {
    const types = type.split('|').map((t) => t.trim())
    return `z.union([${types.map((t) => mapTypeToZod(t)).join(', ')}])`
  }

  // literal
  if (type.match(/^".*"$/) || type.match(/^'.*'$/)) {
    return `z.literal(${type})`
  }

  // default to Zod object schema
  return `${type}Schema`
}

export interface GenerateResult {
  code: string
  /** **[internal]** You should not use this. If you need it indeed, please issue it. */
  exports: Export[]
}

function generateCodeFromIntf(
  intf: UnhandledInterfaceInfo,
  code: string,
  map: Map<string, UnhandledInterfaceInfo>,
  processed: string[],
): ValypeReferenceError | string {
  const analyzed = analyzeInterface(intf, code)
  const referInProp = <string[]>[]
  // header
  let generated = `${analyzed.exported ? 'export ' : ''}const ${analyzed.name}Schema = z.object({\n`

  // generate extends. `interface ... extends ...`
  analyzed.extends.forEach((e) => (generated += `  ...${e}Schema.shape,\n`))

  // iterate self hosted properties
  for (const prop of analyzed.properties) {
    const zodType = mapTypeToZod(prop.type)
    if (typeof prop.type === 'string' && zodType.endsWith('Schema')) {
      referInProp.push(prop.type)
    }
    const zodField = prop.isOptional ? `${zodType}.optional()` : zodType
    generated += `  ${prop.name}: ${zodField},\n`
  }

  generated += `})\n\n`

  // mark this as processed
  processed.push(analyzed.name)

  // process referred but not processed types
  const unhandledReferences = [
    ...new Set([...referInProp, ...analyzed.extends]),
  ].filter((r) => r !== analyzed.name && !processed.includes(r))
  for (const ref of unhandledReferences) {
    const intf = map.get(ref)
    if (!intf)
      return new ValypeReferenceError(`could not find interface ${ref}`)
    // add it to processed to avoid of being processed in recursion
    processed.push(ref)
    const refSchema = generateCodeFromIntf(intf, code, map, processed)
    if (refSchema instanceof ValypeReferenceError) return refSchema
    generated = refSchema + generated
  }

  return generated
}

/**
 * convert TypeScript interface definitions to Zod schema
 * @param code content of typeScript file
 * @returns generated Zod schema code as a string
 */
export async function generate(
  code: string,
): Promise<GenerateResult | ValypeUnimplementedError | ValypeReferenceError> {
  const ast = await parseAsync('temp.ts', code)

  // collect all interface declarations
  const allInterfaces = new Map<string, UnhandledInterfaceInfo>()
  const exportedInterfaces = <UnhandledInterfaceInfo[]>[]
  for (const stmt of ast.program.body) {
    const node = extractTSInterfaceDeclaration(stmt)

    if (!node) continue

    const name = node.id.name

    if (allInterfaces.has(name))
      return new ValypeUnimplementedError('interface merging')

    const intfInfo = {
      name,
      node,
      exported: node.exported,
    }
    allInterfaces.set(name, intfInfo)
    if (node.exported) exportedInterfaces.push(intfInfo)
  }

  // There is no exported interface and no need to proceed
  if (exportedInterfaces.length === 0)
    return { code: '', exports: [] } satisfies GenerateResult

  const processedInterfaces = <string[]>[]
  const result: GenerateResult = {
    code: `// generated by valype\nimport { z } from 'zod/v4'\n\n`,
    exports: [],
  }

  // Start processing from exported interfaces
  for (const intf of exportedInterfaces) {
    const generated = generateCodeFromIntf(
      intf,
      code,
      allInterfaces,
      processedInterfaces,
    )
    if (generated instanceof ValypeReferenceError) return generated
    result.code += generated
    result.exports.push({ interface: intf.name, schema: `${intf.name}Schema` })
  }

  return result
}
