import { z } from 'zod/v4'
import {
  createSourceFile,
  forEachChild,
  isExportAssignment,
  isExportDeclaration,
  isExportSpecifier,
  isInterfaceDeclaration,
  isNamedExports,
  isPropertySignature,
  ScriptTarget,
} from 'typescript'
import { parseAsync } from 'oxc-parser'

/**
 * 将 TypeScript 接口定义转换为 Zod schema
 * @param tsContent TypeScript 文件内容
 * @returns 生成的 Zod schema 代码
 */
export async function generate(tsContent: string): Promise<string> {
  // const sourceFile = createSourceFile('temp.ts', tsContent, ScriptTarget.Latest, true)
  const ast = await parseAsync('temp.ts', tsContent)

  const interfaces: InterfaceInfo[] = []

  // iterate all top-level statements in the AST
  for (const stmt of ast.program.body) {
    // only handle export interface declaration statements
    if (
      stmt.type === 'ExportNamedDeclaration' &&
      stmt.declaration?.type === 'TSInterfaceDeclaration'
    ) {
      const name = stmt.declaration.id.name
      const properties: PropertyInfo[] = []

      for (const property of stmt.declaration.body.body) {
        if (property.type === 'TSPropertySignature') {
          const name = tsContent.slice(property.key.start, property.key.end)
          const type = property.typeAnnotation
            ? tsContent.slice(
                property.typeAnnotation.typeAnnotation.start,
                property.typeAnnotation.typeAnnotation.end,
              )
            : 'any'

          const isOptional = property.optional

          properties.push({
            name,
            type,
            isOptional,
          })
        }
      }

      interfaces.push({
        name,
        properties,
      })
    }
  }

  // // 遍历 AST 提取接口信息
  // forEachChild(sourceFile, (node) => {
  //   if (isInterfaceDeclaration(node)) {
  //     const interfaceName = node.name.text
  //     const properties: PropertyInfo[] = []

  //     node.members.forEach((member) => {
  //       if (isPropertySignature(member)) {
  //         const propertyName = member.name.getText(sourceFile)
  //         const typeText = member.type?.getText(sourceFile) || 'any'
  //         const isOptional = !!member.questionToken

  //         properties.push({
  //           name: propertyName,
  //           type: typeText,
  //           isOptional,
  //         })
  //       }
  //     })

  //     interfaces.push({
  //       name: interfaceName,
  //       properties,
  //     })
  //   }
  // })

  // 生成 Zod schema 代码
  let zodCode = `import { z } from "zod/v4";\n\n`

  interfaces.forEach((intf) => {
    zodCode += `export const ${intf.name}Schema = z.object({\n`

    intf.properties.forEach((prop) => {
      const zodType = mapTypeToZod(prop.type)
      const zodField = prop.isOptional ? `${zodType}.optional()` : zodType
      zodCode += `  ${prop.name}: ${zodField},\n`
    })

    zodCode += `});\n\n`
  })

  return zodCode
}

interface InterfaceInfo {
  name: string
  properties: PropertyInfo[]
}

interface PropertyInfo {
  name: string
  type: string
  isOptional: boolean
}

/**
 * 将TypeScript类型映射到Zod schema
 */
function mapTypeToZod(type: string): string {
  const typeLower = type.toLowerCase()

  // 基本类型
  if (typeLower === 'string') return 'z.string()'
  if (typeLower === 'number') return 'z.number()'
  if (typeLower === 'boolean') return 'z.boolean()'
  if (typeLower === 'date') return 'z.date()'

  // 数组
  if (type.endsWith('[]')) {
    const elementType = type.slice(0, -2)
    return `z.array(${mapTypeToZod(elementType)})`
  }

  // 联合类型
  if (type.includes('|')) {
    const types = type.split('|').map((t) => t.trim())
    return `z.union([${types.map((t) => mapTypeToZod(t)).join(', ')}])`
  }

  // 字面量类型
  if (type.match(/^".*"$/) || type.match(/^'.*'$/)) {
    return `z.literal(${type})`
  }

  // 默认当作对象或自定义类型处理
  return `${type}Schema`
}
