import type { TSInterfaceDeclaration, TSTypeAliasDeclaration } from 'oxc-parser'

export type TSDeclaration = TSInterfaceDeclaration | TSTypeAliasDeclaration
export interface DeclarationInfo {
  name: string
  node: TSDeclaration
  exported: boolean
}

export interface GenerateContext {
  code: string
  decl: Map<string, DeclarationInfo>
  /** interfaces to be process */
  pending: DeclarationInfo[]
  processed: Set<string>
}

export function createGenerateContext(
  code: GenerateContext['code'],
): GenerateContext {
  return {
    code,
    decl: new Map(),
    pending: [],
    processed: new Set(),
  }
}

export interface TranslationContext {
  dependencies: string[]
}

/** create TranslationContext from GenerateContext */
export function createTranslationContext(): TranslationContext {
  return {
    dependencies: [],
  }
}
