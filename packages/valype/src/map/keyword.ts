// indicated a unused param `node` to ensure type-safety
/* eslint-disable @typescript-eslint/no-unused-vars */
import type {
  TSBooleanKeyword,
  TSNumberKeyword,
  TSStringKeyword,
} from 'oxc-parser'

export function mapTSStringKeyword(node: TSStringKeyword) {
  return 'z.string()'
}

export function mapTSNumberKeyword(node: TSNumberKeyword) {
  return 'z.number()'
}

export function mapTSBooleanKeyword(node: TSBooleanKeyword) {
  return 'z.boolean()'
}
