## [0.0.11](https://github.com/yuzheng14/valype/compare/v0.0.10...v0.0.11) (2025-07-15)

### Refactor

* **valype:** ♻️ implement topological sorting for schema generation ([#21](https://github.com/yuzheng14/valype/issues/21)) ([0132a97](https://github.com/yuzheng14/valype/commit/0132a97284ea114b5754cf455acf4728de3acc3f))



## [0.0.10](https://github.com/yuzheng14/valype/compare/v0.0.9...v0.0.10) (2025-06-30)


### Features

* **typescript:** ✨ add @valype/typescript-plugin to provide type infos ([#33](https://github.com/yuzheng14/valype/issues/33)) ([004d2ec](https://github.com/yuzheng14/valype/commit/004d2ec64ac26ffc763628cf8e39cbe40804a3d3))



## [0.0.9](https://github.com/yuzheng14/valype/compare/v0.0.8...v0.0.9) (2025-06-24)


### Features

* **valype:** :sparkles: add type alias supported ([#25](https://github.com/yuzheng14/valype/issues/25)) ([db9c5e7](https://github.com/yuzheng14/valype/commit/db9c5e7f5d8595ab20cd51ed19aced0a0a9ef457))



## [0.0.8](https://github.com/yuzheng14/valype/compare/v0.0.7...v0.0.8) (2025-06-21)


### Features

* **plugin:** :sparkles: add schema validation APIs and documentation ([#31](https://github.com/yuzheng14/valype/issues/31)) ([c562544](https://github.com/yuzheng14/valype/commit/c5625442c78042e34f005a513c0a077bc4fcda60))



## [0.0.7](https://github.com/yuzheng14/valype/compare/v0.0.6...v0.0.7) (2025-06-19)


### Bug Fixes

* **valype & plugin:** :bug: type signature mismatch ([ba20a24](https://github.com/yuzheng14/valype/commit/ba20a2462c59dafc3d25b8aff9e0bc0c21c5c8ef))


### Features

* **valype:** :sparkles: add more primitive type supported ([#18](https://github.com/yuzheng14/valype/issues/18)) ([21bb539](https://github.com/yuzheng14/valype/commit/21bb539788ddf6567e0763fb65a1b8c605325cc2))
* **valype:** ✨ compose Valype*Error with Span ([#24](https://github.com/yuzheng14/valype/issues/24)) ([a9d9b36](https://github.com/yuzheng14/valype/commit/a9d9b36a1f31432fcd69b2021a3f64e55984de84)), closes [#17](https://github.com/yuzheng14/valype/issues/17)



## [0.0.6](https://github.com/yuzheng14/valype/compare/v0.0.5...v0.0.6) (2025-06-18)


### Refactor

* **valype** :recycle: rewrite generation logic using Syntax-Directed Translation ([#19](https://github.com/yuzheng14/valype/pull/19)) ([21bd02f](https://github.com/yuzheng14/valype/commit/21bd02f6af8f991fb71c2ab5c02ff5a793d6805d))
  * deliver information using context
  * 🥳 Thanks of SDT, valype could transform infinitive nested type literal now!



## [0.0.5](https://github.com/yuzheng14/valype/compare/v0.0.4...v0.0.5) (2025-06-18)


### Bug Fixes

* **plugin:** :bug: load virtual module error on Windows ([6fc8e2e](https://github.com/yuzheng14/valype/commit/6fc8e2e5a0b14810aea1af4fd8f2cedfaa80319c)), closes [#16](https://github.com/yuzheng14/valype/issues/16)
* **plugin:** :bug: using self-hosted zod in library mode ([a9714fa](https://github.com/yuzheng14/valype/commit/a9714fa4978540bc42f070e511c3e16d07ea8310)), closes [#15](https://github.com/yuzheng14/valype/issues/15)



## [0.0.4](https://github.com/yuzheng14/valype/compare/v0.0.3...v0.0.4) (2025-06-17)


### Features

* **valype:** :sparkles: handle nested types in interfaces ([6db889c](https://github.com/yuzheng14/valype/commit/6db889c4e082a1a0c84b35cbbfe049a0927c5eef)), closes [#13](https://github.com/yuzheng14/valype/issues/13)



## [0.0.3](https://github.com/yuzheng14/valype/compare/v0.0.2...v0.0.3) (2025-06-16)


### Features

* **valype & plugin:** :sparkles: handle mixed usage of exported and unexported interfaces ([2cd98e1](https://github.com/yuzheng14/valype/commit/2cd98e1b46250f2c8a8b88c410201612763e70d8)), closes [#12](https://github.com/yuzheng14/valype/issues/12)



## [0.0.2](https://github.com/yuzheng14/valype/compare/v0.0.1...v0.0.2) (2025-06-15)


### Features

* **valype:** :sparkles: support for interfaces extending other type ([a05b0df](https://github.com/yuzheng14/valype/commit/a05b0dfd049135fd84e157390d75294d1f776647)), closes [#11](https://github.com/yuzheng14/valype/issues/11)



## [0.0.1](https://github.com/yuzheng14/valype/compare/709b1727e19255799aae43a44f8f26316cfc5cdb...v0.0.1) (2025-06-12)


### Bug Fixes

* **plugin:** :children_crossing: esbuild throw error during vite phase of pre-bundle ([fc42072](https://github.com/yuzheng14/valype/commit/fc42072568e71fc7f8e2edec23d115afac0cba65))


### Features

* **plugin:** :sparkles: unplugin to generate validation function automatically ([f2f2a9c](https://github.com/yuzheng14/valype/commit/f2f2a9c91ebeb8e3d1e448a6d452d2f34feb789f)), closes [#2](https://github.com/yuzheng14/valype/issues/2)
* **valype:** :sparkles: implement exported interface to schema initially ([23ebe24](https://github.com/yuzheng14/valype/commit/23ebe243622294af198a9f3edda2cd8f64550753))



