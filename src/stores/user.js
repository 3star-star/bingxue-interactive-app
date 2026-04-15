import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    // 用户基本信息
    id: null,
    nickname: '冰雪探索者',
    avatar: '',
    points: 0,
    level: 1,
    experience: 0,

    // 成就系统
    achievements: [],
    unlockedBadges: [],

    // 学习进度
    knowledgeProgress: {},
    scenesVisited: [],

    // 用户行为记录
    featureAccess: {},
    loginStreak: 0,
    lastLoginDate: null,

    // 设置
    settings: {
      soundEnabled: true,
      musicEnabled: true,
      notificationsEnabled: true,
      darkMode: false
    }
  }),

  getters: {
    // 获取用户等级名称
    levelName: (state) => {
      const levels = {
        1: '初学者',
        2: '冰雪爱好者',
        3: '冰雪达人',
        4: '冰雪专家',
        5: '冰雪大师'
      }
      return levels[state.level] || '探索者'
    },

    // 获取成就进度
    achievementProgress: (state) => {
      return state.achievements.map(achievement => ({
        ...achievement,
        progress: Math.min(achievement.progress, achievement.target)
      }))
    },

    // 获取访问过的景点数量
    visitedScenesCount: (state) => {
      return state.scenesVisited.length
    },

    // 获取知识完成度
    knowledgeCompletion: (state) => {
      const totalKnowledge = 20 // 总知识点数
      const completedKnowledge = Object.values(state.knowledgeProgress).filter(p => p >= 100).length
      return Math.round((completedKnowledge / totalKnowledge) * 100)
    }
  },

  actions: {
    // 初始化用户数据
    initializeUser() {
      const savedUser = localStorage.getItem('userProfile')
      if (savedUser) {
        const userData = JSON.parse(savedUser)
        Object.assign(this, userData)
      } else {
        // 创建新用户
        this.createUser()
      }
    },

    // 创建新用户
    createUser() {
      this.id = 'user_' + Date.now()
      this.nickname = '冰雪探索者'
      this.points = 0
      this.level = 1
      this.experience = 0
      this.achievements = []
      this.unlockedBadges = []
      this.knowledgeProgress = {}
      this.scenesVisited = []
      this.featureAccess = {}
      this.loginStreak = 0
      this.lastLoginDate = null
      this.settings = {
        soundEnabled: true,
        musicEnabled: true,
        notificationsEnabled: true,
        darkMode: false
      }

      this.saveToLocalStorage()
    },

    // 添加积分
    addPoints(amount) {
      this.points += amount
      this.experience += amount

      // 检查升级
      this.checkLevelUp()

      // 保存到本地存储
      this.saveToLocalStorage()
    },

    // 检查升级
    checkLevelUp() {
      const expNeeded = this.level * 100
      if (this.experience >= expNeeded) {
        this.level++
        this.experience = 0
        this.unlockAchievement('level_up', `达到${this.level}级`)
      }
    },

    // 解锁成就
    unlockAchievement(type, title) {
      // 防止重复解锁
      if (this.unlockedBadges.some(b => b.id === type)) return

      const achievement = {
        id: type,
        title,
        unlocked: true,
        unlockedAt: new Date().toISOString()
      }

      this.unlockedBadges.push(achievement)
      this.achievements.push(achievement)

      // 显示解锁通知
      this.showAchievementNotification(achievement)
    },

    // 显示成就通知
    showAchievementNotification(achievement) {
      // 这里可以添加通知逻辑
      console.log('成就解锁:', achievement.title)
    },

    // 记录功能访问
    recordFeatureAccess(feature) {
      this.featureAccess[feature] = (this.featureAccess[feature] || 0) + 1

      // 检查成就
      this.checkFeatureAchievements()

      this.saveToLocalStorage()
    },

    // 检查功能相关成就
    checkFeatureAchievements() {
      // 访问知识探索5次
      if (this.featureAccess.knowledge >= 5) {
        this.unlockAchievement('knowledge_explorer', '知识探索者')
      }

      // 访问美景3次
      if (this.featureAccess.scenes >= 3) {
        this.unlockAchievement('scene_visitor', '美景打卡者')
      }

      // 访问游戏10次
      if (this.featureAccess.games >= 10) {
        this.unlockAchievement('game_master', '游戏大师')
      }
    },

    // 完成知识点
    completeKnowledgePoint(knowledgeId) {
      this.knowledgeProgress[knowledgeId] = 100

      // 检查知识成就
      const completedCount = Object.values(this.knowledgeProgress).filter(p => p === 100).length
      if (completedCount >= 5) {
        this.unlockAchievement('knowledge_start', '知识入门')
      }
      if (completedCount >= 10) {
        this.unlockAchievement('knowledge_intermediate', '知识进阶')
      }
      if (completedCount >= 20) {
        this.unlockAchievement('knowledge_expert', '知识专家')
      }

      this.saveToLocalStorage()
    },

    // 访问场景
    visitScene(sceneId) {
      if (!this.scenesVisited.includes(sceneId)) {
        this.scenesVisited.push(sceneId)

        // 检查场景成就
        if (this.scenesVisited.length >= 3) {
          this.unlockAchievement('scene_explorer', '场景探索家')
        }
        if (this.scenesVisited.length >= 5) {
          this.unlockAchievement('scene_master', '场景大师')
        }

        this.saveToLocalStorage()
      }
    },

    // 更新设置
    updateSettings(newSettings) {
      this.settings = { ...this.settings, ...newSettings }
      this.saveToLocalStorage()
    },

    // 保存到本地存储
    saveToLocalStorage() {
      localStorage.setItem('userProfile', JSON.stringify({
        id: this.id,
        nickname: this.nickname,
        avatar: this.avatar,
        points: this.points,
        level: this.level,
        experience: this.experience,
        achievements: this.achievements,
        unlockedBadges: this.unlockedBadges,
        knowledgeProgress: this.knowledgeProgress,
        scenesVisited: this.scenesVisited,
        featureAccess: this.featureAccess,
        loginStreak: this.loginStreak,
        lastLoginDate: this.lastLoginDate,
        settings: this.settings
      }))
    },

    // 登录处理
    handleLogin() {
      const today = new Date().toDateString()
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString()

      if (this.lastLoginDate === today) {
        // 已经登录过
        return
      }

      if (this.lastLoginDate === yesterday) {
        // 连续登录
        this.loginStreak++
        this.addPoints(5) // 连续登录奖励

        // 检查连续登录成就
        if (this.loginStreak === 3) {
          this.unlockAchievement('login_3', '坚持不懈')
        } else if (this.loginStreak === 7) {
          this.unlockAchievement('login_7', '连续一周')
        } else if (this.loginStreak === 30) {
          this.unlockAchievement('login_30', '月度达人')
        }
      } else {
        // 新的一天
        this.loginStreak = 1
        this.addPoints(1) // 首次登录奖励
      }

      this.lastLoginDate = today
      this.saveToLocalStorage()
    }
  }
})