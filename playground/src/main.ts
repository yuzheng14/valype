import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { validateUser } from './user.valype'

console.log(`validateUser ==>`, validateUser)

createApp(App).mount('#app')
