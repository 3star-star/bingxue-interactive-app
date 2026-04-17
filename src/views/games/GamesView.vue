<template>
  <div class="games-view">
    <!-- 返回首页按钮 -->
    <BackButton to="/" text="返回首页" icon="home" />

    <!-- 页面头部 -->
    <div class="games-header">
      <h1>游戏挑战中心</h1>
      <p>挑战自我，解锁成就，登上排行榜</p>
    </div>

    <!-- 用户状态栏 -->
    <div class="user-status-bar">
      <div class="status-card">
        <div class="level-info">
          <van-icon name="trophy" size="24" color="#FFD700" />
          <div>
            <p class="level-text">Lv.{{ userStore.level }}</p>
            <p class="level-name">{{ userStore.levelName }}</p>
          </div>
        </div>
        <div class="points-info">
          <p class="points-label">积分</p>
          <p class="points-value">{{ userStore.points }}</p>
        </div>
      </div>

      <!-- 成就展示 -->
      <div class="achievement-preview">
        <h3>最新成就</h3>
        <div class="badges-grid">
          <div v-for="badge in userStore.unlockedBadges.slice(-3)"
               :key="badge.id"
               class="badge-item">
            <van-icon name="star" size="20" color="#FFD700" />
            <span>{{ badge.title }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 游戏模块 -->
    <div class="games-section">
      <!-- 知识竞赛 -->
      <div class="game-card knowledge-quiz" @click="startQuiz">
        <div class="game-icon">
          <van-icon name="question" size="40" color="#3B82F6" />
        </div>
        <div class="game-info">
          <h3>知识竞赛</h3>
          <p>测试你的冰雪知识</p>
          <div class="game-stats">
            <span>🏆 {{ getQuizStats().played }}次参与</span>
            <span>⭐ {{ getQuizStats().best }}分</span>
          </div>
        </div>
      </div>

      <!-- 每日挑战 -->
      <div class="game-card daily-challenge" @click="startDailyChallenge">
        <div class="game-icon">
          <van-icon name="calendar" size="40" color="#10B981" />
        </div>
        <div class="game-info">
          <h3>每日挑战</h3>
          <p>完成每日任务赢取奖励</p>
          <div class="challenge-progress">
            <van-progress :percentage="getDailyProgress()" stroke-width="4" />
            <span>{{ getDailyProgress() }}% 完成</span>
          </div>
        </div>
      </div>

      <!-- 周赛活动 -->
      <div class="game-card weekly-contest" @click="joinWeeklyContest">
        <div class="game-icon">
          <van-icon name="fire" size="40" color="#EF4444" />
        </div>
        <div class="game-info">
          <h3>周赛活动</h3>
          <p>与其他玩家一较高下</p>
          <div class="contest-info">
            <span>剩余时间：{{ getContestTime() }}</span>
            <span>🏅 奖池：{{ getPrizePool() }}</span>
          </div>
        </div>
      </div>

      <!-- 排行榜 -->
      <div class="leaderboard-section">
        <div class="leaderboard-header">
          <h3>周排行榜</h3>
          <van-button type="primary" size="small" @click="refreshLeaderboard">刷新</van-button>
        </div>

        <div class="leaderboard-list">
          <div v-for="(player, index) in leaderboard"
               :key="player.id"
               class="leaderboard-item"
               :class="{ 'top-player': index < 3 }">

            <div class="rank">
              <span v-if="index === 0" class="rank-gold">🥇</span>
              <span v-else-if="index === 1" class="rank-silver">🥈</span>
              <span v-else-if="index === 2" class="rank-bronze">🥉</span>
              <span v-else>{{ index + 1 }}</span>
            </div>

            <div class="player-info">
              <img :src="getAvatar(player.avatar)" :alt="player.name" class="avatar">
              <div>
                <p class="player-name">{{ player.name }}</p>
                <p class="player-level">Lv.{{ player.level }}</p>
              </div>
            </div>

            <div class="player-score">
              <p class="score-value">{{ player.score }}</p>
              <p class="score-label">积分</p>
            </div>
          </div>

          <!-- 自己的排名 -->
          <div class="leaderboard-item self-player" v-if="userStore.id">
            <div class="rank">
              <span>{{ findUserRank() }}</span>
            </div>
            <div class="player-info">
              <img :src="getAvatar(userStore.avatar)" :alt="userStore.nickname" class="avatar">
              <div>
                <p class="player-name">{{ userStore.nickname }}</p>
                <p class="player-level">Lv.{{ userStore.level }}</p>
              </div>
            </div>
            <div class="player-score">
              <p class="score-value">{{ userStore.points }}</p>
              <p class="score-label">积分</p>
            </div>
          </div>
        </div>
      </div>
    </div>


    <!-- 每日挑战模态框 -->
    <van-popup
      v-model:show="showDailyChallenge"
      position="bottom"
      :style="{ height: '70%' }"
      round
      closeable>

      <div class="daily-challenge-container">
        <h3>每日任务</h3>

        <div class="task-list">
          <div v-for="task in dailyTasks"
               :key="task.id"
               class="task-item"
               :class="{ 'completed': task.completed }">

            <div class="task-checkbox">
              <van-icon v-if="task.completed" name="success" color="#10B981" />
              <van-icon v-else name="circle" color="#999" />
            </div>

            <div class="task-info">
              <h4>{{ task.title }}</h4>
              <p>{{ task.description }}</p>
            </div>

            <div class="task-reward">
              <van-tag type="primary">{{ task.reward }}积分</van-tag>
            </div>
          </div>
        </div>

        <van-button type="primary" block @click="claimDailyRewards">
          领取已完成奖励
        </van-button>
      </div>
    </van-popup>
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

// 状态
const showDailyChallenge = ref(false)

// 模拟数据
const leaderboard = ref([
  {
    id: 1,
    name: '冰雪大师',
    avatar: '',
    level: 5,
    score: 2500
  },
  {
    id: 2,
    name: '探索者小王',
    avatar: '',
    level: 4,
    score: 2200
  },
  {
    id: 3,
    name: '雪域女王',
    avatar: '',
    level: 4,
    score: 2100
  },
  {
    id: 4,
    name: '北极熊',
    avatar: '',
    level: 3,
    score: 1800
  },
  {
    id: 5,
    name: '冰川探险家',
    avatar: '',
    level: 3,
    score: 1500
  }
])

const dailyTasks = ref([
  {
    id: 1,
    title: '登录游戏',
    description: '每日登录应用',
    reward: 10,
    completed: false
  },
  {
    id: 2,
    title: '完成一个知识点',
    description: '学习任意一个冰雪知识',
    reward: 20,
    completed: false
  },
  {
    id: 3,
    title: '访问一个景点',
    description: '360°浏览任意一个景点',
    reward: 15,
    completed: false
  },
  {
    id: 4,
    title: '参与知识竞赛',
    description: '完成一轮知识竞赛',
    reward: 30,
    completed: false
  }
])

// 计算属性
const userProgress = computed(() => {
  return userStore.featureAccess
})

// 方法
const getQuizStats = () => {
  return {
    played: userProgress.value.quiz || 0,
    best: Math.floor(Math.random() * 80) + 20
  }
}

const getDailyProgress = () => {
  const completed = dailyTasks.value.filter(t => t.completed).length
  return Math.round((completed / dailyTasks.value.length) * 100)
}

const getContestTime = () => {
  const now = new Date()
  const endOfWeek = new Date(now)
  endOfWeek.setDate(now.getDate() + (7 - now.getDay()))
  endOfWeek.setHours(23, 59, 59)

  const diff = endOfWeek - now
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

  if (days > 0) {
    return `${days}天${hours}小时`
  }
  return `${hours}小时`
}

const getPrizePool = () => {
  return "5000积分"
}

const getAvatar = (avatar) => {
  return avatar || '/assets/images/default-avatar.png'
}

const findUserRank = () => {
  const userScore = userStore.points
  const sorted = [...leaderboard.value].sort((a, b) => b.score - a.score)
  return sorted.findIndex(p => p.id === userStore.id) + 1 || sorted.length + 1
}

const refreshLeaderboard = () => {
  showToast('排行榜已更新')
}

const startQuiz = () => {
  // 跳转到知识竞赛页面
  router.push('/quiz')

  // 记录参与
  userStore.recordFeatureAccess('quiz')
}

const startDailyChallenge = () => {
  showDailyChallenge.value = true
}

const joinWeeklyContest = () => {
  showToast('周赛即将开始，敬请期待！')
}

// 领取每日奖励
const claimDailyRewards = () => {
  const completedTasks = dailyTasks.value.filter(t => t.completed)
  let totalReward = 0

  completedTasks.forEach(task => {
    if (!task.claimed) {
      totalReward += task.reward
      task.claimed = true
      userStore.addPoints(task.reward)
    }
  })

  if (totalReward > 0) {
    showToast(`获得${totalReward}积分奖励！`)
  } else {
    showToast('没有可领取的奖励')
  }

  // 保存任务状态
  wx.setStorageSync('dailyTasks', dailyTasks.value)
}

// 生命周期
onMounted(() => {
  userStore.initializeUser()
  loadDailyTasks()
})

// 加载每日任务
const loadDailyTasks = () => {
  const savedTasks = wx.getStorageSync('dailyTasks')
  if (savedTasks) {
    dailyTasks.value = savedTasks
  } else {
    // 标记登录任务为已完成
    dailyTasks.value[0].completed = true
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

.games-view {
  min-height: 100vh;
  padding: $spacing-xl 0;
}

.games-header {
  text-align: center;
  padding: 0 $spacing-xl $spacing-lg;
  margin-bottom: $spacing-lg;

  h1 {
    font-size: 2.5rem;
    color: white;
    margin-bottom: $spacing-sm;
  }

  p {
    font-size: 1.1rem;
    color: $text-secondary;
  }
}

.user-status-bar {
  padding: 0 $spacing-xl $spacing-lg;
}

.status-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: $radius-lg;
  padding: $spacing-lg;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacing-lg;
  border: 1px solid rgba(255, 255, 255, 0.2);

  .level-info {
    display: flex;
    align-items: center;
    gap: $spacing-md;

    .level-text {
      font-size: 2rem;
      color: white;
      font-weight: bold;
    }

    .level-name {
      font-size: 0.9rem;
      color: $text-secondary;
    }
  }

  .points-info {
    text-align: right;

    .points-label {
      font-size: 0.9rem;
      color: $text-secondary;
    }

    .points-value {
      font-size: 2rem;
      color: #FFD700;
      font-weight: bold;
    }
  }
}

.achievement-preview {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: $radius-lg;
  padding: $spacing-lg;
  border: 1px solid rgba(255, 255, 255, 0.2);

  h3 {
    font-size: 1.2rem;
    color: white;
    margin-bottom: $spacing-md;
  }

  .badges-grid {
    display: flex;
    gap: $spacing-sm;
    flex-wrap: wrap;

    .badge-item {
      display: flex;
      align-items: center;
      gap: $spacing-xs;
      padding: $spacing-xs $spacing-sm;
      background: rgba(255, 255, 255, 0.1);
      border-radius: $radius-md;
      font-size: 0.9rem;
      color: white;
    }
  }
}

.games-section {
  padding: 0 $spacing-xl;
}

.game-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: $radius-lg;
  padding: $spacing-xl;
  margin-bottom: $spacing-lg;
  display: flex;
  align-items: center;
  gap: $spacing-lg;
  cursor: pointer;
  transition: all $transition-normal;
  border: 1px solid rgba(255, 255, 255, 0.2);

  &:hover {
    transform: translateY(-5px);
    box-shadow: $shadow-xl;
  }

  .game-icon {
    width: 80px;
    height: 80px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .game-info {
    flex: 1;

    h3 {
      font-size: 1.5rem;
      color: white;
      margin-bottom: $spacing-sm;
    }

    p {
      font-size: 1rem;
      color: $text-secondary;
      margin-bottom: $spacing-md;
    }
  }

  .game-stats,
  .challenge-progress,
  .contest-info {
    display: flex;
    gap: $spacing-md;
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.8);
  }

  .challenge-progress {
    align-items: center;

    span {
      margin-left: $spacing-sm;
    }
  }
}

.leaderboard-section {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: $radius-lg;
  padding: $spacing-lg;
  border: 1px solid rgba(255, 255, 255, 0.2);

  .leaderboard-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $spacing-lg;

    h3 {
      font-size: 1.5rem;
      color: white;
    }
  }

  .leaderboard-list {
    .leaderboard-item {
      display: flex;
      align-items: center;
      gap: $spacing-md;
      padding: $spacing-md;
      background: rgba(255, 255, 255, 0.05);
      border-radius: $radius-md;
      margin-bottom: $spacing-sm;

      &.top-player {
        background: linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 215, 0, 0.2) 100%);
        border: 1px solid rgba(255, 215, 0, 0.3);
      }

      &.self-player {
        border: 2px solid #3B82F6;
      }

      .rank {
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 50%;
        font-weight: bold;
        color: white;

        .rank-gold {
          color: #FFD700;
        }

        .rank-silver {
          color: #C0C0C0;
        }

        .rank-bronze {
          color: #CD7F32;
        }
      }

      .player-info {
        display: flex;
        align-items: center;
        gap: $spacing-sm;
        flex: 1;

        .avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
        }

        .player-name {
          font-weight: bold;
          color: white;
          margin-bottom: 4px;
        }

        .player-level {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.6);
        }
      }

      .player-score {
        text-align: right;

        .score-value {
          font-size: 1.25rem;
          font-weight: bold;
          color: #FFD700;
        }

        .score-label {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.6);
        }
      }
    }
  }
}


@media (max-width: $mobile) {
  .game-card {
    flex-direction: column;
    text-align: center;

    .game-info {
      width: 100%;
    }
  }

  .leaderboard-item {
    .rank {
      width: 30px;
      height: 30px;
      font-size: 0.9rem;
    }

    .avatar {
      width: 40px;
      height: 40px;
    }
  }
}
</style>