// indicated a unused param `node` to ensure type-safety
/* eslint-disable @typescript-eslint/no-unused-vars */
import type {
  TSBooleanKeyword,
  TSNumberKeyword,
  TSStringKeyword,
  TSSymbolKeyword,
  TSNullKeyword,
  TSBigIntKeyword,
  TSUndefinedKeyword,
  TSUnknownKeyword,
  TSAnyKeyword,
  TSVoidKeyword,
  TSNeverKeyword,
} from 'oxc-parser'

export function mapTSKeyword(
  node:
    | TSBooleanKeyword
    | TSNumberKeyword
    | TSStringKeyword
    | TSSymbolKeyword
    | TSNullKeyword
    | TSBigIntKeyword
    | TSUndefinedKeyword
    | TSUnknownKeyword
    | TSAnyKeyword
    | TSVoidKeyword
    | TSNeverKeyword,
) {
  switch (node.type) {
    case 'TSBooleanKeyword':
      return mapTSBooleanKeyword(node)
    case 'TSNumberKeyword':
      return mapTSNumberKeyword(node)
    case 'TSStringKeyword':
      return mapTSStringKeyword(node)
    case 'TSSymbolKeyword':
      return mapTSSymbolKeyword(node)
    case 'TSNullKeyword':
      return mapTSNullKeyword(node)
    case 'TSBigIntKeyword':
      return mapTSBigIntKeyword(node)
    case 'TSUndefinedKeyword':
      return mapTSUndefinedKeyword(node)
    case 'TSUnknownKeyword':
      return mapTSUnknownKeyword(node)
    case 'TSAnyKeyword':
      return mapTSAnyKeyword(node)
    case 'TSVoidKeyword':
      return mapTSVoidKeyword(node)
    case 'TSNeverKeyword':
      return mapTSNeverKeyword(node)
  }
}

export function mapTSStringKeyword(node: TSStringKeyword) {
  return 'z.string()'
}

export function mapTSNumberKeyword(node: TSNumberKeyword) {
  return 'z.number()'
}

export function mapTSBooleanKeyword(node: TSBooleanKeyword) {
  return 'z.boolean()'
}

export function mapTSBigIntKeyword(node: TSBigIntKeyword) {
  return 'z.bigint()'
}

export function mapTSSymbolKeyword(node: TSSymbolKeyword) {
  return 'z.symbol()'
}

export function mapTSNullKeyword(node: TSNullKeyword) {
  return 'z.null()'
}

export function mapTSUndefinedKeyword(node: TSUndefinedKeyword) {
  return 'z.undefined()'
}

export function mapTSUnknownKeyword(node: TSUnknownKeyword) {
  return 'z.unknown()'
}

export function mapTSVoidKeyword(node: TSVoidKeyword) {
  return 'z.void()'
}

export function mapTSNeverKeyword(node: TSNeverKeyword) {
  return 'z.never()'
}

export function mapTSAnyKeyword(node: TSAnyKeyword) {
  return 'z.any()'
}
