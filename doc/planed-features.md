- [x] plain interface ( depth 1 with primitives type)

  ```typescript
  export interface User {
    username: string
    password: string
    age: number
    isValid: boolean
  }
  ```

- [x] primitives array in interface

  ```typescript
  export interface Node {
    children: string[]
  }
  ```

- [ ] nested type in interface

  ```typescript
  /**
   * This is a plain interface
   */
  interface User {
    username: string
    password: string
    age: number
    isValid: boolean
  }
  
  /**
   * Another interface referencing User
   */
  export interface UserProfile {
    user: User
    address: {
      street: string
      city: string
      country: string
    }
  }
  
  
  ```

- [ ] type like interface

  ```typescript
  export type User = {
    username: string
    password: string
    age: number
    isValid: boolean
  }
  ```

- [ ] primitives union type

  ```typescript
  export interface User {
    gender: 'male' | 'femail'
    type: 0 | 1 | 2 | 3 | boolean
    nation: Nation
  }
  
  export type Nation = 'China' | 'American'
  ```

- [ ] reference other files

  ```typescript
  // address.ts
  export interface Address {
    nation: string
    city: string
  }
  
  // User.validator.ts
  import { Address } from './address.ts'
  
  export interface User {
    name: string
    address: Address
  }
  ```

- [ ] multi adapter to adopt `zod` `@sinclair/typebox` and other validate tools
  