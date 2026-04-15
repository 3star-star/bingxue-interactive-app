import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useUserStore } from './stores/user'

const app = createApp(App)

const pinia = createPinia()

app.use(pinia)
app.use(router)

import './assets/main.css'

import {
  Button,
  Icon,
  Tag,
  Toast,
  Tabbar,
  TabbarItem,
  Tabs,
  Tab,
  Popup,
  Progress,
  Cell,
  CellGroup,
  Switch
} from 'vant'

app.use(Button)
app.use(Icon)
app.use(Tag)
app.use(Toast)
app.use(Tabbar)
app.use(TabbarItem)
app.use(Tabs)
app.use(Tab)
app.use(Popup)
app.use(Progress)
app.use(Cell)
app.use(CellGroup)
app.use(Switch)

const userStore = useUserStore()
userStore.initializeUser()

app.mount('#app')
