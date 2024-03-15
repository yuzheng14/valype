import { defaultGenerateValidatorOptions } from './constant'
import { GenerateValidatorOptions } from './type'
import fg from 'fast-glob'

/**
 * 获取选项
 * @param key 选项的键
 * @param options 选项
 * @returns
 */
export function getOption<K extends keyof GenerateValidatorOptions>(
  key: K,
  options: GenerateValidatorOptions,
): NonNullable<GenerateValidatorOptions[K]> {
  return options[key] || defaultGenerateValidatorOptions[key]
}

/**
 * 匹配需要生成 validator 的文件
 * @param cwd 工作区
 * @param include 包含的目录
 * @param exclude 排除的目录
 * @returns
 */
export async function getValidatorFilePath(cwd: string, include: string[], exclude: string[]) {
  return await fg(include, {
    cwd,
    ignore: exclude,
  })
}
