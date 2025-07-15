import type { TSInterfaceDeclaration, TSTypeAliasDeclaration } from 'oxc-parser'
import type { Dependency } from './dependency'

export type TSDeclaration = TSInterfaceDeclaration | TSTypeAliasDeclaration
export interface DeclarationInfo {
  name: string
  node: TSDeclaration
  exported: boolean
}

export interface GenerateContext {
  code: string
  decl: Map<string, DeclarationInfo>
  exportedDecl: Dependency[]
}

export function createGenerateContext(
  code: GenerateContext['code'],
): GenerateContext {
  return {
    code,
    decl: new Map(),
    exportedDecl: [],
  }
}

export interface TranslationContext {
  dependencies: Dependency[]
}

/** create TranslationContext from GenerateContext */
export function createTranslationContext(): TranslationContext {
  return {
    dependencies: [],
  }
}
