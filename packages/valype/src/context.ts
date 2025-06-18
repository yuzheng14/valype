import type { TSInterfaceDeclaration } from 'oxc-parser'

export interface InterfaceInfo {
  name: string
  node: TSInterfaceDeclaration
  exported: boolean
}

export interface GenerateContext {
  code: string
  intf: Map<string, InterfaceInfo>
  /** interfaces to be process */
  pending: InterfaceInfo[]
  processed: Set<string>
}

export function createGenerateContext(
  code: GenerateContext['code'],
): GenerateContext {
  return {
    code,
    intf: new Map(),
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
