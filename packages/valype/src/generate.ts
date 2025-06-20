import {
  parseAsync,
  type Directive,
  type Statement,
  type TSInterfaceDeclaration,
} from 'oxc-parser'
import {
  extractSpan,
  ValypeReferenceError,
  ValypeSyntaxError,
  ValypeUnimplementedError,
} from './error'
import { mapTSInterfaceDeclaration } from './map/map'
import {
  createGenerateContext,
  createTranslationContext,
  type InterfaceInfo,
} from './context'

export interface Export {
  /** interface name */
  interface: string
  /** schema name */
  schema: string
}

/** extract TSInterfaceDeclaration from Statement */
function extractTSInterfaceDeclaration(
  node: Directive | Statement,
): (TSInterfaceDeclaration & Pick<InterfaceInfo, 'exported'>) | void {
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

export interface GenerateResult {
  code: string
  /** **[internal]** You should not use this. If you need it indeed, please issue it. */
  exports: Export[]
}

/**
 * convert TypeScript interface definitions to Zod schema
 * @param code content of typeScript file
 * @returns generated Zod schema code as a string
 */
export async function generate(
  code: string,
): Promise<
  | GenerateResult
  | ValypeUnimplementedError
  | ValypeReferenceError
  | ValypeSyntaxError
> {
  const ast = await parseAsync('temp.ts', code)

  const ctx = createGenerateContext(code)

  // collect all interface declarations
  for (const stmt of ast.program.body) {
    const node = extractTSInterfaceDeclaration(stmt)
    if (!node) continue

    const name = node.id.name

    if (ctx.intf.has(name))
      return new ValypeUnimplementedError(
        'interface merging',
        extractSpan(node),
      )

    const intfInfo = {
      name,
      node,
      exported: node.exported,
    }
    ctx.intf.set(name, intfInfo)
    if (node.exported) ctx.pending.push(intfInfo)
  }

  // There is no exported interface and no need to proceed
  if (ctx.pending.length === 0)
    return { code: '', exports: [] } satisfies GenerateResult

  const result: GenerateResult = {
    code: `// generated by valype\nimport { z } from 'zod/v4'\n\n`,
    exports: [],
  }

  // Start processing from exported interfaces
  let intfInfo = ctx.pending.shift() as InterfaceInfo // handled length === 0 above, so it must exist
  let body = ''
  let pending = ''
  do {
    if (ctx.processed.has(intfInfo.name)) continue
    const context = createTranslationContext()

    let intfDecl = mapTSInterfaceDeclaration(intfInfo.node, context)
    if (intfDecl instanceof Error) return intfDecl
    ctx.processed.add(intfInfo.name)

    intfDecl = `const ${intfInfo.name}Schema = ${intfDecl}\n\n`
    if (intfInfo.exported) {
      intfDecl = `export ` + intfDecl
      result.exports.push({
        interface: intfInfo.name,
        schema: `${intfInfo.name}Schema`,
      })
      body += pending
      pending = ''
    }

    pending = intfDecl + pending

    const span = extractSpan(intfInfo.node)
    for (const ref of context.dependencies) {
      if (ctx.processed.has(ref)) continue
      const intfInfo = ctx.intf.get(ref)
      if (!intfInfo) return new ValypeReferenceError(ref, span)
      if (intfInfo.exported) continue
      ctx.pending.unshift(intfInfo)
    }
  } while ((intfInfo = ctx.pending.shift()!)) // enter loop only intfInfo exists

  result.code += body + pending

  return result
}
