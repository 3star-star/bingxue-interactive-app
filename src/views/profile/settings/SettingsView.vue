<template>
  <div class="settings-view">
    <BackButton to="/profile" text="返回个人中心" />

    <div class="page-header">
      <h2>个人设置</h2>
      <p>自定义你的冰雪世界体验</p>
    </div>

    <div class="settings-body">

      <!-- 账户信息 -->
      <div class="settings-section">
        <p class="section-label">账户信息</p>
        <div class="cell-group">
          <div class="cell">
            <span class="cell-title">昵称</span>
            <span class="cell-value">{{ userStore.nickname }}</span>
          </div>
          <div class="cell">
            <span class="cell-title">等级</span>
            <span class="cell-value">Lv.{{ userStore.level }} · {{ userStore.levelName }}</span>
          </div>
          <div class="cell">
            <span class="cell-title">积分</span>
            <span class="cell-value">{{ userStore.points }}</span>
          </div>
          <div class="cell">
            <span class="cell-title">连续登录</span>
            <span class="cell-value">{{ userStore.loginStreak }} 天</span>
          </div>
        </div>
      </div>

      <!-- 音效设置 -->
      <div class="settings-section">
        <p class="section-label">音效设置</p>
        <div class="cell-group">
          <div class="cell">
            <span class="cell-title">背景音乐</span>
            <van-switch v-model="userStore.settings.musicEnabled" size="22" @change="autoSave" />
          </div>
          <div class="cell">
            <span class="cell-title">音效</span>
            <van-switch v-model="userStore.settings.soundEnabled" size="22" @change="autoSave" />
          </div>
        </div>
      </div>

      <!-- 通知设置 -->
      <div class="settings-section">
        <p class="section-label">通知设置</p>
        <div class="cell-group">
          <div class="cell">
            <span class="cell-title">推送通知</span>
            <van-switch v-model="userStore.settings.notificationsEnabled" size="22" @change="autoSave" />
          </div>
        </div>
      </div>

      <!-- 其他 -->
      <div class="settings-section">
        <p class="section-label">其他</p>
        <div class="cell-group">
          <div class="cell" @click="clearCache">
            <span class="cell-title">清除缓存</span>
            <van-icon name="delete" color="rgba(255,255,255,0.4)" />
          </div>
          <div class="cell">
            <span class="cell-title">关于应用</span>
            <span class="cell-value">冰雪互动世界 v1.0.0</span>
          </div>
          <div class="cell danger-cell" @click="logout">
            <span class="cell-title">退出登录</span>
            <van-icon name="close" color="#EF4444" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { showToast, showConfirmDialog } from 'vant'
import BackButton from '@/components/common/BackButton.vue'

const router = useRouter()
const userStore = useUserStore()

const autoSave = () => {
  userStore.saveToLocalStorage()
  showToast({ message: '已保存', duration: 800 })
}

const clearCache = () => {
  showConfirmDialog({
    title: '清除缓存',
    message: '确定要清除缓存吗？这将重置所有用户数据。'
  }).then(() => {
    localStorage.clear()
    userStore.createUser()
    showToast('缓存已清除')
  }).catch(() => {})
}

const logout = () => {
  showConfirmDialog({
    title: '退出登录',
    message: '确定要退出登录吗？'
  }).then(() => {
    localStorage.removeItem('userProfile')
    userStore.createUser()
    showToast('已退出登录')
    router.push('/')
  }).catch(() => {})
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

.settings-view {
  min-height: 100vh;
  background: linear-gradient(to bottom, #1e3c72 0%, #2a5298 100%);
  padding-bottom: 40px;
}

.page-header {
  text-align: center;
  padding: 70px $spacing-xl $spacing-lg;

  h2 {
    font-size: 1.8rem;
    color: white;
    margin-bottom: 6px;
  }

  p {
    font-size: 0.95rem;
    color: rgba(255, 255, 255, 0.6);
  }
}

.settings-body {
  padding: 0 $spacing-lg;
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
}

.settings-section {
  .section-label {
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.45);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 8px;
    padding-left: 4px;
  }

  .cell-group {
    background: rgba(255, 255, 255, 0.09);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 12px;
    overflow: hidden;
  }

  .cell {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 16px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.07);
    cursor: pointer;
    transition: background 0.15s;

    &:last-child {
      border-bottom: none;
    }

    &:active {
      background: rgba(255, 255, 255, 0.06);
    }

    .cell-title {
      font-size: 0.95rem;
      color: white;
    }

    .cell-value {
      font-size: 0.88rem;
      color: rgba(255, 255, 255, 0.5);
    }

    &.danger-cell .cell-title {
      color: #EF4444;
    }
  }
}
</style>
