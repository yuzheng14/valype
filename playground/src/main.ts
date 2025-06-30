import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { assertUser, validateUser } from './user.valype'

console.log(`validateUser ==>`, validateUser)

const a: unknown = {}

assertUser(a)
console.log(a)

createApp(App).mount('#app')
