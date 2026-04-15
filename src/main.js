import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useUserStore } from './stores/user'
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
  Switch,
  Loading,
  Dialog,
  Slider
} from 'vant'

// 创建应用实例
const app = createApp(App)

// 使用插件 - 顺序很重要！
const pinia = createPinia()
app.use(pinia)
app.use(router)

// 注册Vant组件
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
app.use(Loading)
app.use(Dialog)
app.use(Slider)

// 初始化用户状态
const userStore = useUserStore()
userStore.initializeUser()

app.mount('#app')
