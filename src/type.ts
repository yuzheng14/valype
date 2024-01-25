/* v8 ignore next 22 下面的是 typescript 类型定义，不需要进行测试 */
/**
 * 生成校验器选项
 */
export interface GenerateValidatorOptions {
  /**
   * 默认为当前路径，如需更改工作路径，则需要指定
   */
  cwd?: string
  /**
   * 包含的目录，支持 glob，默认为 cwd 目录下所有的 *.validator.ts文件，使用 fast-glob 进行匹配
   */
  include?: string[]
  /**
   * 排除的目录，支持 glob，使用 fast-glob 进行匹配
   */
  exclude?: string[]
  /**
   * 是否忽略掉 .gitignore 文件中的规则
   * @default true
   */
  ignoreGitignore?: boolean
}
