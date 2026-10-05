import { createApp } from 'vue'
import { Quasar } from 'quasar'
import { createPinia } from 'pinia'
import router from './routes/routes.js'

// Import Quasar css
import 'quasar/dist/quasar.sass'
import '@quasar/extras/material-icons/material-icons.css'

import App from './App.vue'
import './style.css'

const app = createApp(App)
const pinia = createPinia()

app.use(Quasar, {
  config: {},
})

app.use(pinia)
app.use(router)

app.mount('#app')