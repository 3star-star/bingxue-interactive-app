<template>
  <div class="debug-profile">
    <BackButton to="/" text="返回首页" icon="home" />

    <h1>个人中心（调试版）</h1>

    <div class="debug-info">
      <h2>用户状态信息</h2>
      <pre>{{ JSON.stringify(userStore, null, 2) }}</pre>

      <h2>计算属性</h2>
      <div class="computed-stats">
        <p>知识完成度: {{ knowledgeCompletion }}%</p>
        <p>成就进度: {{ achievementProgress }}%</p>
        <p>场景进度: {{ sceneProgress }}%</p>
        <p>访问过的景点数量: {{ visitedScenesCount }}</p>
      </div>

      <h2>操作</h2>
      <div class="actions">
        <van-button type="primary" @click="reinitializeUser">重新初始化用户</van-button>
        <van-button type="warning" @click="clearAllData">清除所有数据</van-button>
        <van-button type="success" @click="simulateProgress">模拟进度</van-button>
      </div>
    </div>

    <!-- 正常的个人中心内容 -->
    <div class="normal-profile" v-if="userStore.id">
      <h2>正常内容加载成功！</h2>
      <p>用户ID: {{ userStore.id }}</p>
      <p>昵称: {{ userStore.nickname }}</p>
      <p>等级: {{ userStore.level }} - {{ userStore.levelName }}</p>
      <p>积分: {{ userStore.points }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { showToast } from 'vant'
import BackButton from '@/components/common/BackButton.vue'

const router = useRouter()
const userStore = useUserStore()

const knowledgeCompletion = computed(() => userStore.knowledgeCompletion)
const visitedScenesCount = computed(() => userStore.visitedScenesCount)
const achievementProgress = computed(() => {
  const totalAchievements = 20
  const unlockedCount = userStore.unlockedBadges.length
  return Math.round((unlockedCount / totalAchievements) * 100)
})
const sceneProgress = computed(() => {
  const totalScenes = 5
  const visitedCount = userStore.scenesVisited.length
  return Math.round((visitedCount / totalScenes) * 100)
})

const reinitializeUser = () => {
  userStore.createUser()
  showToast('用户已重新初始化')
}

const clearAllData = () => {
  if (confirm('确定要清除所有用户数据吗？')) {
    localStorage.removeItem('userProfile')
    userStore.createUser()
    showToast('所有数据已清除')
  }
}

const simulateProgress = () => {
  // 模拟一些进度
  userStore.addPoints(100)
  userStore.recordFeatureAccess('knowledge')
  userStore.recordFeatureAccess('scenes')
  userStore.recordFeatureAccess('games')
  showToast('已模拟进度增加')
}

onMounted(() => {
  console.log('个人中心组件已加载')
  console.log('用户store状态:', userStore)

  // 确保用户store已初始化
  if (!userStore.id) {
    console.log('用户ID不存在，正在初始化...')
    userStore.initializeUser()
  }
})
</script>

<style scoped>
.debug-profile {
  padding: 20px;
  min-height: 100vh;
  background: linear-gradient(to bottom, #1e3c72 0%, #2a5298 100%);
  color: white;
}

.debug-info {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
}

pre {
  background: rgba(0, 0, 0, 0.3);
  padding: 15px;
  border-radius: 5px;
  overflow-x: auto;
  max-height: 300px;
  overflow-y: auto;
}

.computed-stats {
  margin: 15px 0;
}

.computed-stats p {
  margin: 5px 0;
  padding: 5px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 5px;
}

.actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 15px;
}

.normal-profile {
  background: rgba(255, 255, 255, 0.2);
  padding: 20px;
  border-radius: 10px;
  margin-top: 20px;
}
</style>