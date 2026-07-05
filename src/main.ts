import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './main.css'
import { createI18n } from 'vue-i18n'
import localization from '@/localization'

const locale = () => {
  return localStorage.getItem('locale') || 'en'
}

const i18n = createI18n({
  legacy: false,
  locale: locale(),
  fallbackLocale: 'en',
  messages: localization,
})

const app = createApp(App)

app.use(i18n)
app.use(router)

app.mount('#app')
