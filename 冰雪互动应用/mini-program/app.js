// app.js
App({
  onLaunch() {
    // 初始化用户数据
    this.initUserData()

    // 检查系统设置
    this.checkSystemSettings()
  },

  onShow() {
    // 每次显示时记录访问
    this.recordAccess()
  },

  // 初始化用户数据
  initUserData() {
    const userInfo = wx.getStorageSync('userInfo') || {}

    // 如果没有用户数据，创建新用户
    if (!userInfo.id) {
      const newUser = {
        id: 'user_' + Date.now(),
        nickname: '冰雪探索者',
        points: 0,
        level: 1,
        experience: 0,
        achievements: [],
        knowledgeProgress: {},
        scenesVisited: [],
        featureAccess: {},
        loginStreak: 0,
        lastLoginDate: null,
        settings: {
          soundEnabled: true,
          musicEnabled: true,
          notificationsEnabled: true
        }
      }

      wx.setStorageSync('userInfo', newUser)
    }
  },

  // 检查系统设置
  checkSystemSettings() {
    wx.getSystemInfo({
      success: (res) => {
        this.globalData.systemInfo = res
        this.globalData.isIOS = res.system.includes('iOS')
        this.globalData.isAndroid = res.system.includes('Android')
      }
    })
  },

  // 记录访问
  recordAccess() {
    const userInfo = wx.getStorageSync('userInfo') || {}
    const today = new Date().toDateString()

    // 更新访问统计
    const accessLog = wx.getStorageSync('accessLog') || []
    accessLog.push({
      date: today,
      time: new Date().toISOString()
    })

    // 只保留最近30天的记录
    if (accessLog.length > 30) {
      accessLog.shift()
    }

    wx.setStorageSync('accessLog', accessLog)

    // 检查每日登录
    const lastLogin = userInfo.lastLoginDate
    userInfo.lastLoginDate = today

    if (lastLogin !== today) {
      // 新的一天
      userInfo.loginStreak = (userInfo.loginStreak || 0) + 1

      // 首次登录奖励
      if (userInfo.loginStreak === 1) {
        userInfo.points = (userInfo.points || 0) + 1
      }

      // 连续登录奖励
      if (userInfo.loginStreak >= 3) {
        userInfo.points = (userInfo.points || 0) + 5

        // 解锁成就
        this.unlockAchievement('login_3', '坚持不懈')
      }

      if (userInfo.loginStreak >= 7) {
        this.unlockAchievement('login_7', '连续一周')
      }

      if (userInfo.loginStreak >= 30) {
        this.unlockAchievement('login_30', '月度达人')
      }
    }

    wx.setStorageSync('userInfo', userInfo)
  },

  // 添加积分
  addPoints(amount, reason = '') {
    const userInfo = wx.getStorageSync('userInfo') || {}
    userInfo.points = (userInfo.points || 0) + amount

    // 检查升级
    const newLevel = Math.floor(userInfo.points / 100) + 1
    if (newLevel > userInfo.level) {
      userInfo.level = newLevel
      this.unlockAchievement('level_up', `达到${newLevel}级`)
    }

    wx.setStorageSync('userInfo', userInfo)

    // 返回更新后的用户信息
    return userInfo
  },

  // 解锁成就
  unlockAchievement(type, title) {
    const achievements = wx.getStorageSync('achievements') || []

    // 检查是否已解锁
    const exists = achievements.find(a => a.id === type)
    if (!exists) {
      achievements.push({
        id: type,
        title,
        unlocked: true,
        unlockedAt: new Date().toISOString()
      })

      wx.setStorageSync('achievements', achievements)

      // 显示通知
      wx.showToast({
        title: `成就解锁：${title}`,
        icon: 'success',
        duration: 2000
      })
    }
  },

  // 完成知识点
  completeKnowledgePoint(knowledgeId) {
    const userInfo = wx.getStorageSync('userInfo') || {}
    userInfo.knowledgeProgress = userInfo.knowledgeProgress || {}
    userInfo.knowledgeProgress[knowledgeId] = 100

    // 检查知识成就
    const completedCount = Object.values(userInfo.knowledgeProgress).filter(p => p === 100).length

    if (completedCount >= 5) {
      this.unlockAchievement('knowledge_start', '知识入门')
    }

    if (completedCount >= 10) {
      this.unlockAchievement('knowledge_intermediate', '知识进阶')
    }

    if (completedCount >= 20) {
      this.unlockAchievement('knowledge_expert', '知识专家')
    }

    wx.setStorageSync('userInfo', userInfo)
  },

  // 访问场景
  visitScene(sceneId) {
    const userInfo = wx.getStorageSync('userInfo') || {}
    userInfo.scenesVisited = userInfo.scenesVisited || []

    if (!userInfo.scenesVisited.includes(sceneId)) {
      userInfo.scenesVisited.push(sceneId)

      // 检查场景成就
      if (userInfo.scenesVisited.length >= 3) {
        this.unlockAchievement('scene_explorer', '场景探索家')
      }

      if (userInfo.scenesVisited.length >= 5) {
        this.unlockAchievement('scene_master', '场景大师')
      }
    }

    wx.setStorageSync('userInfo', userInfo)
  },

  // 更新设置
  updateSettings(settings) {
    const userInfo = wx.getStorageSync('userInfo') || {}
    userInfo.settings = { ...userInfo.settings, ...settings }
    wx.setStorageSync('userInfo', userInfo)
  },

  // 全局数据
  globalData: {
    systemInfo: null,
    isIOS: false,
    isAndroid: false
  }
})