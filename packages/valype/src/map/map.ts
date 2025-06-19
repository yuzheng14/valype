import type {
  IdentifierName,
  IdentifierReference,
  PropertyKey,
  StringLiteral,
  TSArrayType,
  TSInterfaceBody,
  TSInterfaceDeclaration,
  TSInterfaceHeritage,
  TSLiteral,
  TSLiteralType,
  TSPropertySignature,
  TSSignature,
  TSType,
  TSTypeLiteral,
  TSTypeName,
  TSTypeReference,
  TSUnionType,
} from 'oxc-parser'
import { ValypeSyntaxError, ValypeUnimplementedError } from '../error'
import { mapTSKeyword } from './keyword'
import type { TranslationContext } from '../context'

export function mapTSInterfaceHeritage(
  node: TSInterfaceHeritage,
  context: TranslationContext,
) {
  const { expression } = node
  if (expression.type !== 'Identifier')
    return new ValypeSyntaxError(
      expression.type,
      'Identifier' satisfies IdentifierReference['type'],
    )
  const { name } = expression
  context.dependencies.push(name)
  return `${name}Schema.shape`
}

function mapPropertyKey(node: PropertyKey) {
  switch (node.type) {
    case 'Identifier':
      return node.name

    case 'Literal':
      return node.raw ?? new ValypeSyntaxError('null', 'defined literal')

    default:
      return new ValypeSyntaxError(node.type, [
        'Identifier' satisfies IdentifierName['type'],
        'Literal' satisfies StringLiteral['type'],
      ])
  }
}

function mapTSArrayType(node: TSArrayType, context: TranslationContext) {
  const result = mapTSType(node.elementType, context)
  if (result instanceof Error) return result
  return `z.array(${result})`
}

function mapTSUnionType(node: TSUnionType, context: TranslationContext) {
  const types: string[] = []

  if (node.types.length === 1) return mapTSType(node.types[0], context)

  const nullKeywordIdx = node.types.findIndex((t) => t.type === 'TSNullKeyword')
  if (nullKeywordIdx !== -1) {
    const nullableType = mapTSType(
      {
        ...node,
        types: node.types.toSpliced(nullKeywordIdx, 1),
      },
      context,
    )
    if (nullableType instanceof Error) return nullableType
    return `z.nullable(${nullableType})`
  }

  for (const type of node.types) {
    const result = mapTSType(type, context)
    if (result instanceof Error) return result
    types.push(result)
  }

  return `z.union([${types.join(', ')}])`
}

function mapTSLiteral(node: TSLiteral) {
  switch (node.type) {
    case 'Literal':
      return `z.literal(${node.raw})`

    default:
      return new ValypeUnimplementedError(node.type)
  }
}

function mapTSLiteralType(node: TSLiteralType) {
  return mapTSLiteral(node.literal)
}

function mapTSTypeLiteral(node: TSTypeLiteral, context: TranslationContext) {
  const members: string[] = []
  for (const signature of node.members) {
    const result = mapTSSignature(signature, context)
    if (result instanceof Error) return result
    members.push(result)
  }
  return `z.object({\n${members.map((m) => `  ${m},\n`).join('')}})`
}

function mapTSTypeName(node: TSTypeName, context: TranslationContext) {
  switch (node.type) {
    case 'Identifier':
      context.dependencies.push(node.name)
      return `${node.name}Schema`

    default:
      return new ValypeUnimplementedError(node.type)
  }
}

function mapTSTypeReference(
  node: TSTypeReference,
  context: TranslationContext,
) {
  // TODO implement generics
  if (node.typeArguments) return new ValypeUnimplementedError('generics')

  return mapTSTypeName(node.typeName, context)
}

function mapTSType(
  node: TSType,
  context: TranslationContext,
): string | ValypeUnimplementedError | ValypeSyntaxError {
  switch (node.type) {
    case 'TSStringKeyword':
    case 'TSNumberKeyword':
    case 'TSBooleanKeyword':
    case 'TSBigIntKeyword':
    case 'TSUnknownKeyword':
    case 'TSUndefinedKeyword':
    case 'TSNullKeyword':
    case 'TSSymbolKeyword':
    case 'TSAnyKeyword':
    case 'TSVoidKeyword':
    case 'TSNeverKeyword':
      return mapTSKeyword(node)
    case 'TSArrayType':
      return mapTSArrayType(node, context)
    case 'TSUnionType':
      return mapTSUnionType(node, context)
    case 'TSLiteralType':
      return mapTSLiteralType(node)
    case 'TSTypeLiteral':
      return mapTSTypeLiteral(node, context)
    case 'TSTypeReference':
      return mapTSTypeReference(node, context)

    default:
      return new ValypeUnimplementedError(node.type)
  }
}

function mapTSTypeAnnotation(
  node: TSPropertySignature['typeAnnotation'],
  context: TranslationContext,
) {
  if (!node) return 'z.any()'
  else return mapTSType(node.typeAnnotation, context)
}

function mapTSPropertySignature(
  node: TSPropertySignature,
  context: TranslationContext,
) {
  const key = mapPropertyKey(node.key)
  if (key instanceof Error) return key
  const signature = mapTSTypeAnnotation(node.typeAnnotation, context)
  if (signature instanceof Error) return signature
  return `${key}: ${signature}${node.optional ? '.optional()' : ''}`
}

export function mapTSSignature(node: TSSignature, context: TranslationContext) {
  switch (node.type) {
    case 'TSPropertySignature':
      return mapTSPropertySignature(node, context)

    default:
      return new ValypeUnimplementedError(node.type)
  }
}

export function mapTSInterfaceBody(
  node: TSInterfaceBody,
  context: TranslationContext,
) {
  const generated: string[] = []

  for (const signature of node.body) {
    const result = mapTSSignature(signature, context)
    if (result instanceof Error) return result
    generated.push(result)
  }

  return generated
}

export function mapTSInterfaceDeclaration(
  node: TSInterfaceDeclaration,
  context: TranslationContext,
) {
  const header = `z.object({`

  // handle interface extension
  const extension: string[] = []
  for (const ext of node.extends) {
    const result = mapTSInterfaceHeritage(ext, context)
    if (result instanceof Error) return result
    extension.push(result)
  }

  const signatures = mapTSInterfaceBody(node.body, context)
  if (signatures instanceof Error) return signatures

  return `${header}\n${extension.map((e) => `  ...${e},\n`).join('')}${signatures.map((s) => `  ${s},\n`).join('')}})`
}
