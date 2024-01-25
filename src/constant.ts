import { GenerateValidatorOptions } from './type'

/**
 * generateValidator 默认配置
 */
export const defaultGenerateValidatorOptions: Required<GenerateValidatorOptions> = {
  cwd: process.cwd(),
  include: ['**/*.validator.{ts,cts,mts}'],
  exclude: [],
  ignoreGitignore: true,
}
