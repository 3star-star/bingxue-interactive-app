import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/home/HomeView.vue'),
    meta: {
      title: '冰雪世界入口'
    }
  },
  {
    path: '/knowledge',
    name: 'Knowledge',
    component: () => import('@/views/knowledge/KnowledgeView.vue'),
    meta: {
      title: '知识探索中心'
    }
  },
  {
    path: '/scenes',
    name: 'Scenes',
    component: () => import('@/views/scenes/ScenesView.vue'),
    meta: {
      title: '冰雪美景体验'
    }
  },
  {
    path: '/scene-detail',
    name: 'SceneDetail',
    component: () => import('@/views/scenes/SceneDetailView.vue'),
    meta: {
      title: '场景详情'
    }
  },
  {
    path: '/games',
    name: 'Games',
    component: () => import('@/views/games/GamesView.vue'),
    meta: {
      title: '游戏挑战中心'
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/profile/DebugProfile.vue'),
    meta: {
      title: '个人中心'
    },
    children: [
      {
        path: 'collections',
        name: 'Collections',
        component: () => import('@/views/profile/collections/CollectionView.vue'),
        meta: {
          title: '我的收藏'
        }
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('@/views/profile/settings/SettingsView.vue'),
        meta: {
          title: '个人设置'
        }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory('/bingxue-interactive-app/'),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// 路由守卫
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || '冰雪互动世界'
  next()
})

export default router
