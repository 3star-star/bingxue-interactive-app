<template>
  <div class="settings-view">
    <!-- 页面头部 -->
    <div class="settings-header">
      <h2>个人设置</h2>
      <p>自定义您的冰雪世界体验</p>
    </div>

    <!-- 设置内容 -->
    <div class="settings-content">
      <!-- 账户设置 -->
      <div class="settings-section">
        <h3>账户信息</h3>
        <van-cell-group>
          <van-cell title="用户ID" :value="userStore.id" />
          <van-cell title="昵称" :value="userStore.nickname">
            <template #right-icon>
              <van-icon name="edit" />
            </template>
          </van-cell>
          <van-cell title="等级" :value="userStore.levelName" />
          <van-cell title="积分" :value="userStore.points" />
          <van-cell title="注册时间" :value="formatDate(userStore.registeredAt || new Date())" />
        </van-cell-group>
      </div>

      <!-- 个性化设置 -->
      <div class="settings-section">
        <h3>个性化设置</h3>
        <van-cell-group>
          <van-cell title="深色模式" :value="userStore.settings.darkMode ? '开启' : '关闭'">
            <template #right-icon>
              <van-switch v-model="userStore.settings.darkMode" />
            </template>
          </van-cell>
          <van-cell title="主题颜色" value="冰雪蓝">
            <template #right-icon>
              <van-icon name="color" />
            </template>
          </van-cell>
          <van-cell title="字体大小" value="标准">
            <template #right-icon>
              <van-icon name="expand" />
            </template>
          </van-cell>
        </van-cell-group>
      </div>

      <!-- 音效设置 -->
      <div class="settings-section">
        <h3>音效设置</h3>
        <van-cell-group>
          <van-cell title="背景音乐" :value="userStore.settings.musicEnabled ? '开启' : '关闭'">
            <template #right-icon>
              <van-switch v-model="userStore.settings.musicEnabled" />
            </template>
          </van-cell>
          <van-cell title="音效" :value="userStore.settings.soundEnabled ? '开启' : '关闭'">
            <template #right-icon>
              <van-switch v-model="userStore.settings.soundEnabled" />
            </template>
          </van-cell>
          <van-cell title="音量" value="75%">
            <template #right-icon>
              <van-slider v-model="volume" :max="100" />
            </template>
          </van-cell>
        </van-cell-group>
      </div>

      <!-- 通知设置 -->
      <div class="settings-section">
        <h3>通知设置</h3>
        <van-cell-group>
          <van-cell title="推送通知" :value="userStore.settings.notificationsEnabled ? '开启' : '关闭'">
            <template #right-icon>
              <van-switch v-model="userStore.settings.notificationsEnabled" />
            </template>
          </van-cell>
          <van-cell title="每日提醒" :value="dailyReminder ? '开启' : '关闭'">
            <template #right-icon>
              <van-switch v-model="dailyReminder" />
            </template>
          </van-cell>
          <van-cell title="成就通知" :value="achievementNotification ? '开启' : '关闭'">
            <template #right-icon>
              <van-switch v-model="achievementNotification" />
            </template>
          </van-cell>
        </van-cell-group>
      </div>

      <!-- 隐私设置 -->
      <div class="settings-section">
        <h3>隐私设置</h3>
        <van-cell-group>
          <van-cell title="公开个人资料" :value="profilePublic ? '所有人可见' : '仅自己可见'">
            <template #right-icon>
              <van-switch v-model="profilePublic" />
            </template>
          </van-cell>
          <van-cell title="学习进度公开" :value="progressPublic ? '公开' : '私密'">
            <template #right-icon>
              <van-switch v-model="progressPublic" />
            </template>
          </van-cell>
          <van-cell title="数据同步" :value="dataSync ? '自动同步' : '手动同步'">
            <template #right-icon>
              <van-switch v-model="dataSync" />
            </template>
          </van-cell>
        </van-cell-group>
      </div>

      <!-- 其他设置 -->
      <div class="settings-section">
        <h3>其他设置</h3>
        <van-cell-group>
          <van-cell title="清除缓存" @click="clearCache">
            <template #right-icon>
              <van-icon name="delete" />
            </template>
          </van-cell>
          <van-cell title="关于应用" value="冰雪互动世界 v1.0.0">
            <template #right-icon>
              <van-icon name="info" />
            </template>
          </van-cell>
          <van-cell title="帮助中心" @click="goToHelp">
            <template #right-icon>
              <van-icon name="question" />
            </template>
          </van-cell>
          <van-cell title="退出登录" @click="logout">
            <template #right-icon>
              <van-icon name="close" />
            </template>
          </van-cell>
        </van-cell-group>
      </div>
    </div>

    <!-- 保存按钮 -->
    <div class="settings-actions">
      <van-button type="primary" block @click="saveSettings">保存设置</van-button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { showToast } from 'vant'

const router = useRouter()
const userStore = useUserStore()

// 状态
const volume = ref(75)
const dailyReminder = ref(true)
const achievementNotification = ref(true)
const profilePublic = ref(false)
const progressPublic = ref(true)
const dataSync = ref(true)

// 方法
const formatDate = (date) => {
  const d = new Date(date)
  return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`
}

const saveSettings = () => {
  // 更新用户设置
  userStore.updateSettings({
    ...userStore.settings,
    volume,
    dailyReminder,
    achievementNotification,
    profilePublic,
    progressPublic,
    dataSync
  })

  showToast('设置已保存')
}

const clearCache = () => {
  if (confirm('确定要清除缓存吗？这将重置部分用户数据。')) {
    localStorage.clear()
    userStore.createUser()
    showToast('缓存已清除，用户数据已重置')
  }
}

const goToHelp = () => {
  showToast('帮助中心功能开发中')
}

const logout = () => {
  if (confirm('确定要退出登录吗？')) {
    localStorage.removeItem('userProfile')
    userStore.createUser()
    showToast('已退出登录')
    router.push('/')
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

.settings-view {
  min-height: 100vh;
  padding: $spacing-xl 0;
  background: linear-gradient(to bottom, #1e3c72 0%, #2a5298 100%);
}

.settings-header {
  text-align: center;
  padding: 0 $spacing-xl $spacing-lg;
  margin-bottom: $spacing-lg;

  h2 {
    font-size: 2rem;
    color: white;
    margin-bottom: $spacing-sm;
  }

  p {
    font-size: 1.1rem;
    color: $text-secondary;
  }
}

.settings-content {
  padding: 0 $spacing-xl;
}

.settings-section {
  margin-bottom: $spacing-xl;

  h3 {
    font-size: 1.2rem;
    color: white;
    margin-bottom: $spacing-md;
    padding: 0 $spacing-md;
  }

  .van-cell {
    background: rgba(255, 255, 255, 0.1);
    color: white;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);

    .van-cell__title {
      color: white;
    }

    .van-cell__value {
      color: $text-secondary;
    }
  }
}

.settings-actions {
  margin-top: $spacing-xl;
  padding: 0 $spacing-xl;
}
</style>