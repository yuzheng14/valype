import { defaultGenerateValidatorOptions } from './constant'
import { GenerateValidatorOptions } from './type'
import { parse } from '@typescript-eslint/parser'
import fg from 'fast-glob'
import { getOption } from './util'

export async function generateValidator(options: GenerateValidatorOptions) {
  const cwd = getOption('cwd', options)
  const include = getOption('include', options)
  const exclude = getOption('exclude', options)
}
