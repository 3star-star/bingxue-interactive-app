import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useUserStore } from './stores/user'

// 创建应用实例
const app = createApp(App)

// 创建应用实例
const app = createApp(App)

// 设置路由
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// 设置状态管理 - 必须先注册pinia才能使用store
const pinia = createPinia()

// 使用插件 - 顺序很重要！
app.use(pinia)
app.use(router)

// 全局样式
import './assets/main.css'

// 注册Vant组件（完整注册）
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

// 初始化用户状态 - 在挂载前初始化
const userStore = useUserStore()
userStore.initializeUser()

// 在应用挂载后初始化用户状态
app.mount('#app')
