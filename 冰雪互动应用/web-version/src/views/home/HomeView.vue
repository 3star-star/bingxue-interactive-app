<template>
  <div class="home-view">
    <SnowBackground />

    <!-- 欢迎区域 -->
    <div class="welcome-section fade-in">
      <h1 class="main-title">冰雪互动世界</h1>
      <p class="subtitle">探索知识的乐趣，领略冰雪的美丽</p>
      <div class="daily-reward" @click="claimDailyReward">
        <van-icon name="gift" size="24" />
        <span>每日登录奖励</span>
        <van-tag type="primary" v-if="!hasClaimedToday">{{ rewardPoints }}</van-tag>
      </div>
    </div>

    <!-- 主要功能区 -->
    <div class="main-section">
      <div class="feature-grid">
        <!-- 知识探索 -->
        <router-link to="/knowledge" class="feature-card" @click="handleFeatureClick('knowledge')">
          <div class="feature-icon">
            <div class="icon-bg" style="background: #3B82F6;">
              <van-icon name="book" size="24" color="white" />
            </div>
          </div>
          <h3>知识探索</h3>
          <p>学习冰雪知识，互动体验</p>
        </router-link>

        <!-- 美景体验 -->
        <router-link to="/scenes" class="feature-card" @click="handleFeatureClick('scenes')">
          <div class="feature-icon">
            <div class="icon-bg" style="background: #10B981;">
              <van-icon name="photo" size="24" color="white" />
            </div>
          </div>
          <h3>美景体验</h3>
          <p>360°全景漫游，虚拟打卡</p>
        </router-link>

        <!-- 游戏挑战 -->
        <router-link to="/games" class="feature-card" @click="handleFeatureClick('games')">
          <div class="feature-icon">
            <div class="icon-bg" style="background: #F59E0B;">
              <van-icon name="trophy" size="24" color="white" />
            </div>
          </div>
          <h3>游戏挑战</h3>
          <p>成就系统，积分排行</p>
        </router-link>

        <!-- 个人中心 -->
        <router-link to="/profile" class="feature-card" @click="handleFeatureClick('profile')">
          <div class="feature-icon">
            <div class="icon-bg" style="background: #8B5CF6;">
              <van-icon name="user-circle" size="24" color="white" />
            </div>
          </div>
          <h3>个人中心</h3>
          <p>学习进度，个人设置</p>
        </router-link>
      </div>
    </div>

    <!-- 新功能提示 -->
    <div class="new-feature-banner" v-if="showNewFeature">
      <div class="banner-content">
        <van-icon name="info" size="20" />
        <span>新功能：知识竞赛挑战赛已上线！</span>
        <van-button size="small" type="primary" @click="viewNewFeature">查看</van-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import SnowBackground from '@/components/common/SnowBackground.vue'

const router = useRouter()
const userStore = useUserStore()

// 状态
const hasClaimedToday = ref(false)
const rewardPoints = ref(10)
const showNewFeature = ref(true)

// 生命周期
onMounted(() => {
  checkDailyReward()
  checkNewFeature()
})

// 检查每日奖励
const checkDailyReward = () => {
  const today = new Date().toDateString()
  const lastClaim = localStorage.getItem('lastClaimDate')

  if (lastClaim === today) {
    hasClaimedToday.value = true
  }
}

// 领取每日奖励
const claimDailyReward = () => {
  if (hasClaimedToday.value) return

  const today = new Date().toDateString()
  localStorage.setItem('lastClaimDate', today)
  localStorage.setItem('rewardPoints', rewardPoints.value)

  hasClaimedToday.value = true
  userStore.addPoints(rewardPoints.value)

  // 显示领取成功提示
  showToast('成功领取每日奖励！+' + rewardPoints.value + '积分')
}

// 检查新功能
const checkNewFeature = () => {
  const lastViewed = localStorage.getItem('lastNewFeatureView')
  if (lastViewed) {
    showNewFeature.value = false
  }
}

// 查看新功能
const viewNewFeature = () => {
  localStorage.setItem('lastNewFeatureView', 'true')
  showNewFeature.value = false
  router.push('/games')
}

// 处理功能点击
const handleFeatureClick = (feature) => {
  // 记录用户访问行为
  userStore.recordFeatureAccess(feature)
}

// 显示提示
const showToast = (message) => {
  // 使用vant的Toast组件
  const toast = document.createElement('div')
  toast.className = 'custom-toast'
  toast.textContent = message
  document.body.appendChild(toast)

  setTimeout(() => {
    toast.remove()
  }, 2000)
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

.home-view {
  position: relative;
  min-height: 100vh;
  padding: $spacing-xl 0;
  overflow-x: hidden;
}

.welcome-section {
  text-align: center;
  padding: $spacing-xl;
  margin-bottom: $spacing-xl;

  .main-title {
    font-size: 3rem;
    color: white;
    margin-bottom: $spacing-sm;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }

  .subtitle {
    font-size: 1.25rem;
    color: $text-secondary;
    margin-bottom: $spacing-lg;
  }

  .daily-reward {
    display: inline-flex;
    align-items: center;
    gap: $spacing-sm;
    padding: $spacing-sm $spacing-md;
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    border-radius: $radius-md;
    cursor: pointer;
    transition: all $transition-normal;

    &:hover {
      transform: translateY(-2px);
      background: rgba(255, 255, 255, 0.3);
    }
  }
}

.main-section {
  .feature-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: $spacing-lg;
    padding: 0 $spacing-xl;
  }

  .feature-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: $spacing-xl;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: $radius-lg;
    color: white;
    text-decoration: none;
    transition: all $transition-normal;
    border: 1px solid rgba(255, 255, 255, 0.2);

    &:hover {
      transform: translateY(-5px);
      background: rgba(255, 255, 255, 0.15);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    }

    .feature-icon {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: $spacing-md;
      transition: all $transition-normal;

      .icon-bg {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all $transition-normal;
      }

      .icon-bg:hover {
        transform: scale(1.1);
      }
    }

    h3 {
      font-size: 1.5rem;
      margin-bottom: $spacing-xs;
    }

    p {
      font-size: 1rem;
      opacity: 0.8;
      text-align: center;
    }
  }
}

.new-feature-banner {
  position: fixed;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  max-width: 600px;

  .banner-content {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    padding: $spacing-md;
    background: linear-gradient(90deg, #FF6B6B 0%, #FF8E53 100%);
    border-radius: $radius-md;
    color: white;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
}

.custom-toast {
  position: fixed;
  bottom: 120px;
  left: 50%;
  transform: translateX(-50%);
  padding: $spacing-sm $spacing-md;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  border-radius: $radius-md;
  z-index: 9999;
}

@media (max-width: $mobile) {
  .welcome-section {
    padding: $spacing-lg;

    .main-title {
      font-size: 2rem;
    }

    .subtitle {
      font-size: 1rem;
    }
  }

  .main-section {
    .feature-grid {
      grid-template-columns: 1fr;
      padding: 0 $spacing-md;
    }
  }
}
</style>