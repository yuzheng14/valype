import { describe, expect, it } from 'vitest'
import { getOption, getValidatorFilePath } from '../src/util'
import { defaultGenerateValidatorOptions } from '../src/constant'
import { GenerateValidatorOptions } from '../src/type'
import { getFakeProgramPath } from './util'

describe('util 模块测试', () => {
  describe('getOption 函数测试', () => {
    it('获取传入定义选项', () => {
      expect(
        getOption('cwd', {
          cwd: './test/fake-program',
        }),
      ).toEqual('./test/fake-program')
    })

    it('获取传入选项中的 undefined', () => {
      expect(
        getOption('cwd', { include: ['...'] }) as NonNullable<GenerateValidatorOptions['cwd']>,
      ).toEqual(defaultGenerateValidatorOptions.cwd)
    })

    it('获取默认选项', () => {
      expect(getOption('cwd', {})).toEqual(defaultGenerateValidatorOptions.cwd)
    })
  })

  describe('getValidatorFile 函数测试', () => {
    it('匹配 fake-program 中的 validator 文件', async () => {
      expect(
        await getValidatorFilePath(
          getFakeProgramPath('get-validator-file'),
          defaultGenerateValidatorOptions.include,
          defaultGenerateValidatorOptions.exclude,
        ),
      ).toEqual(['type.validator.ts', 'test-run/types.validator.ts'])
    })
  })
})
