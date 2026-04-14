// pages/home/home.js
Page({
  data: {
    hasClaimedToday: false,
    rewardPoints: 10,
    showNewFeature: true,
    userInfo: {
      nickname: '冰雪探索者',
      level: 1,
      points: 0
    },
    showSnowControls: true,
    isSnowPaused: false,
    snowComponent: null
  },

  onLoad() {
    this.checkDailyReward()
    this.checkNewFeature()
    this.loadUserInfo()
    this.initSnowControls()
  },

  onShow() {
    // 每次显示时检查登录
    this.checkLogin()
  },

  // 初始化雪花控制
  initSnowControls() {
    if (this.data.showSnowControls) {
      this.setData({ showSnowControls: true })
    }
  },

  // 获取雪花组件实例
  getSnowComponent() {
    if (!this.snowComponent) {
      this.snowComponent = this.selectComponent('#snowBackground')
    }
    return this.snowComponent
  },

  // 检查登录
  checkLogin() {
    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      this.setData({
        'userInfo.points': userInfo.points || 0,
        'userInfo.level': userInfo.level || 1
      })
    }
  },

  // 检查每日奖励
  checkDailyReward() {
    const today = new Date().toDateString()
    const lastClaim = wx.getStorageSync('lastClaimDate')

    if (lastClaim === today) {
      this.setData({ hasClaimedToday: true })
    }
  },

  // 领取每日奖励
  claimDailyReward() {
    if (this.data.hasClaimedToday) {
      wx.showToast({
        title: '今日已领取',
        icon: 'none'
      })
      return
    }

    const today = new Date().toDateString()
    wx.setStorageSync('lastClaimDate', today)

    const userInfo = wx.getStorageSync('userInfo') || {}
    userInfo.points = (userInfo.points || 0) + this.data.rewardPoints
    userInfo.level = Math.floor(userInfo.points / 100) + 1

    wx.setStorageSync('userInfo', userInfo)

    this.setData({
      hasClaimedToday: true,
      'userInfo.points': userInfo.points,
      'userInfo.level': userInfo.level
    })

    wx.showToast({
      title: `成功领取每日奖励！+${this.data.rewardPoints}积分`,
      icon: 'success'
    })

    // 记录成就
    this.checkAchievements()
  },

  // 检查新功能
  checkNewFeature() {
    const lastViewed = wx.getStorageSync('lastNewFeatureView')
    if (lastViewed) {
      this.setData({ showNewFeature: false })
    }
  },

  // 查看新功能
  viewNewFeature() {
    wx.setStorageSync('lastNewFeatureView', 'true')
    this.setData({ showNewFeature: false })
    wx.navigateTo({
      url: '/pages/games/games'
    })
  },

  // 跳转到知识探索
  goToKnowledge() {
    wx.navigateTo({
      url: '/pages/knowledge/knowledge'
    })
  },

  // 跳转到美景体验
  goToScenes() {
    wx.navigateTo({
      url: '/pages/scenes/scenes'
    })
  },

  // 跳转到游戏挑战
  goToGames() {
    wx.navigateTo({
      url: '/pages/games/games'
    })
  },

  // 跳转到个人中心
  goToProfile() {
    wx.navigateTo({
      url: '/pages/profile/profile'
    })
  },

  // 加载用户信息
  loadUserInfo() {
    const userInfo = wx.getStorageSync('userInfo') || {}
    this.setData({
      'userInfo.points': userInfo.points || 0,
      'userInfo.level': userInfo.level || 1
    })
  },

  // 检查成就
  checkAchievements() {
    const userInfo = wx.getStorageSync('userInfo') || {}

    // 首次登录成就
    if (userInfo.points >= 10) {
      this.unlockAchievement('first_login', '初次探索')
    }

    // 连续登录成就
    const loginStreak = userInfo.loginStreak || 1
    if (loginStreak >= 3) {
      this.unlockAchievement('login_3', '坚持不懈')
    }
  },

  // 解锁成就
  unlockAchievement(type, title) {
    const achievements = wx.getStorageSync('achievements') || []
    if (!achievements.find(a => a.id === type)) {
      achievements.push({
        id: type,
        title,
        unlocked: true,
        unlockedAt: new Date().toISOString()
      })
      wx.setStorageSync('achievements', achievements)

      wx.showToast({
        title: `成就解锁：${title}`,
        icon: 'success'
      })
    }
  },

  // 切换雪花动画
  toggleSnowAnimation() {
    const snowComponent = this.getSnowComponent()
    if (snowComponent) {
      this.setData({ isSnowPaused: !this.data.isSnowPaused })
      snowComponent.toggleAnimation()
    }
  },

  // 重新生成雪花
  regenerateSnowflakes() {
    const snowComponent = this.getSnowComponent()
    if (snowComponent) {
      snowComponent.regenerateSnowflakes()
    }
  },

  // 清除雪花
  clearSnowflakes() {
    const snowComponent = this.getSnowComponent()
    if (snowComponent) {
      snowComponent.clearSnowflakes()
    }
  },

  // 分享
  onShareAppMessage() {
    return {
      title: '冰雪互动世界 - 探索知识的乐趣',
      path: '/pages/home/home',
      imageUrl: '/images/share.jpg'
    }
  }
})