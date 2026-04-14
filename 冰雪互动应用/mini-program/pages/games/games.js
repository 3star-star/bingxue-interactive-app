// pages/games/games.js
Page({
  data: {
    userLevel: 1,
    userPoints: 0,
    showQuiz: false,
    showDailyChallenge: false,
    quizTime: 30,
    currentQuestionIndex: 0,
    selectedOption: null,
    showResult: false,
    quizScore: 0,
    leaderboard: [],
    dailyTasks: [],
    userStats: {},
    achievements: [],
    showAchievementPopup: false,
    currentAchievement: null
  },

  onLoad() {
    this.loadUserData()
    this.loadLeaderboard()
    this.loadDailyTasks()
    this.loadUserStats()
    this.loadAchievements()
  },

  onShow() {
    this.loadUserData()
  },

  // 加载用户数据
  loadUserData() {
    const userInfo = wx.getStorageSync('userInfo') || {}
    this.setData({
      userLevel: userInfo.level || 1,
      userPoints: userInfo.points || 0
    })
  },

  // 加载排行榜数据
  loadLeaderboard() {
    // 模拟排行榜数据
    const leaderboard = [
      {
        id: 1,
        name: '冰雪大师',
        level: 5,
        score: 2500,
        achievements: 12
      },
      {
        id: 2,
        name: '探索者小王',
        level: 4,
        score: 2200,
        achievements: 10
      },
      {
        id: 3,
        name: '雪域女王',
        level: 4,
        score: 2100,
        achievements: 9
      },
      {
        id: 4,
        name: '北极熊',
        level: 3,
        score: 1800,
        achievements: 7
      },
      {
        id: 5,
        name: '冰川探险家',
        level: 3,
        score: 1500,
        achievements: 5
      },
      {
        id: 6,
        name: '雪花飘飘',
        level: 2,
        score: 1200,
        achievements: 3
      }
    ]

    this.setData({ leaderboard })
  },

  // 加载每日任务
  loadDailyTasks() {
    const savedTasks = wx.getStorageSync('dailyTasks')
    if (savedTasks) {
      this.setData({ dailyTasks: savedTasks })
    } else {
      const defaultTasks = [
        {
          id: 1,
          title: '登录游戏',
          description: '每日登录应用',
          reward: 10,
          completed: true,
          claimed: false
        },
        {
          id: 2,
          title: '完成一个知识点',
          description: '学习任意一个冰雪知识',
          reward: 20,
          completed: false,
          claimed: false
        },
        {
          id: 3,
          title: '访问一个景点',
          description: '360°浏览任意一个景点',
          reward: 15,
          completed: false,
          claimed: false
        },
        {
          id: 4,
          title: '参与知识竞赛',
          description: '完成一轮知识竞赛',
          reward: 30,
          completed: false,
          claimed: false
        },
        {
          id: 5,
          title: '收藏一个场景',
          description: '收藏360°场景',
          reward: 10,
          completed: false,
          claimed: false
        },
        {
          id: 6,
          title: '拍照5张',
          description: '在全景场景中拍照5张',
          reward: 25,
          completed: false,
          claimed: false
        }
      ]
      this.setData({ dailyTasks: defaultTasks })
    }
  },

  // 加载用户统计
  loadUserStats() {
    const stats = wx.getStorageSync('userStats') || {}
    this.setData({ userStats: stats })
  },

  // 加载成就
  loadAchievements() {
    const achievements = wx.getStorageSync('achievements') || []
    this.setData({ achievements })
  },

  // 开始知识竞赛
  startQuiz() {
    const userInfo = wx.getStorageSync('userInfo') || {}
    userInfo.userStats = userInfo.userStats || {}
    userInfo.userStats.quizPlayed = (userInfo.userStats.quizPlayed || 0) + 1

    wx.setStorageSync('userInfo', userInfo)

    this.setData({
      showQuiz: true,
      currentQuestionIndex: 0,
      selectedOption: null,
      showResult: false,
      quizScore: 0,
      quizTime: 30
    })

    this.startQuizTimer()
  },

  // 开始计时器
  startQuizTimer() {
    const timer = setInterval(() => {
      if (this.data.quizTime > 0) {
        this.setData({ quizTime: this.data.quizTime - 1 })
      } else {
        clearInterval(timer)
        this.submitQuizAnswer()
      }
    }, 1000)

    this.setData({ quizTimer: timer })
  },

  // 选择答案
  selectOption(e) {
    const index = e.currentTarget.dataset.index
    if (!this.data.showResult) {
      this.setData({ selectedOption: index })
    }
  },

  // 提交答案
  submitQuizAnswer() {
    if (this.data.selectedOption === null) {
      wx.showToast({
        title: '请选择答案',
        icon: 'none'
      })
      return
    }

    const currentQuestion = this.getQuestion(this.data.currentQuestionIndex)
    this.setData({ showResult: true })

    if (this.data.selectedOption === currentQuestion.correct) {
      this.setData({ quizScore: this.data.quizScore + 10 })

      // 添加积分
      const app = getApp()
      app.addPoints(10)
    }

    // 清除计时器
    if (this.data.quizTimer) {
      clearInterval(this.data.quizTimer)
    }

    // 1.5秒后继续或结束
    setTimeout(() => {
      if (this.data.currentQuestionIndex < 3) {
        this.nextQuestion()
      } else {
        this.completeQuiz()
      }
    }, 1500)
  },

  // 下一题
  nextQuestion() {
    this.setData({
      currentQuestionIndex: this.data.currentQuestionIndex + 1,
      selectedOption: null,
      showResult: false,
      quizTime: 30
    })
    this.startQuizTimer()
  },

  // 完成测验
  completeQuiz() {
    this.setData({ showQuiz: false })

    // 更新最高分
    const userInfo = wx.getStorageSync('userInfo') || {}
    userInfo.userStats = userInfo.userStats || {}
    userInfo.userStats.quizBestScore = Math.max(userInfo.userStats.quizBestScore || 0, this.data.quizScore)
    wx.setStorageSync('userInfo', userInfo)

    wx.showToast({
      title: `测验完成！得分：${this.data.quizScore}分`,
      icon: 'success'
    })

    // 检查成就
    this.checkQuizAchievements()
  },

  // 检查测验成就
  checkQuizAchievements() {
    const { quizScore } = this.data
    const app = getApp()

    if (quizScore >= 30) {
      this.unlockAchievement('quiz_expert', '知识达人', '连续答对3题以上')
    }

    if (quizScore >= 20) {
      this.unlockAchievement('quiz_master', '答题大师', '获得20分以上')
    }

    if (quizScore === 40) {
      this.unlockAchievement('quiz_perfect', '完美答题', '答对所有题目')
    }
  },

  // 解锁成就
  unlockAchievement(type, title, description = '') {
    const app = getApp()
    app.unlockAchievement(type, title, description)
  },

  // 获取题目
  getQuestion(index) {
    const questions = [
      {
        question: "雪花的基本形状是什么？",
        options: ["六边形", "圆形", "三角形", "正方形"],
        correct: 0
      },
      {
        question: "冰的密度比水：",
        options: ["大", "小", "相同", "不确定"],
        correct: 1
      },
      {
        question: "滑雪起源于哪个国家？",
        options: ["中国", "日本", "挪威", "瑞士"],
        correct: 2
      },
      {
        question: "雪崩的发生与哪个因素关系最大？",
        options: ["温度", "风力", "坡度", "积雪厚度"],
        correct: 3
      }
    ]
    return questions[index]
  },

  // 开始每日挑战
  startDailyChallenge() {
    this.setData({ showDailyChallenge: true })
  },

  // 完成任务
  completeTask(taskId) {
    const updatedTasks = this.data.dailyTasks.map(task => {
      if (task.id === taskId && !task.completed) {
        return { ...task, completed: true }
      }
      return task
    })

    this.setData({ dailyTasks: updatedTasks })
    wx.setStorageSync('dailyTasks', updatedTasks)

    // 检查任务成就
    this.checkTaskAchievements()

    wx.showToast({
      title: '任务完成！',
      icon: 'success'
    })
  },

  // 检查任务成就
  checkTaskAchievements() {
    const completedTasks = this.data.dailyTasks.filter(t => t.completed).length
    const app = getApp()

    if (completedTasks >= 3) {
      this.unlockAchievement('task_completer', '任务达人', '完成3个以上每日任务')
    }

    if (completedTasks >= 5) {
      this.unlockAchievement('task_master', '任务大师', '完成所有每日任务')
    }
  },

  // 领取每日奖励
  claimDailyRewards() {
    let totalReward = 0

    const updatedTasks = this.data.dailyTasks.map(task => {
      if (task.completed && !task.claimed) {
        totalReward += task.reward
        task.claimed = true
        return task
      }
      return task
    })

    this.setData({ dailyTasks: updatedTasks })
    wx.setStorageSync('dailyTasks', updatedTasks)

    if (totalReward > 0) {
      const app = getApp()
      app.addPoints(totalReward)

      wx.showToast({
        title: `获得${totalReward}积分奖励！`,
        icon: 'success'
      })
    } else {
      wx.showToast({
        title: '没有可领取的奖励',
        icon: 'none'
      })
    }
  },

  // 加入周赛
  joinWeeklyContest() {
    wx.showToast({
      title: '周赛即将开始，敬请期待！',
      icon: 'none'
    })
  },

  // 刷新排行榜
  refreshLeaderboard() {
    wx.showToast({
      title: '排行榜已更新',
      icon: 'success'
    })
    this.loadLeaderboard()
  },

  // 关闭知识竞赛
  closeQuiz() {
    this.setData({ showQuiz: false })
    if (this.data.quizTimer) {
      clearInterval(this.data.quizTimer)
    }
  },

  // 关闭每日挑战
  closeDailyChallenge() {
    this.setData({ showDailyChallenge: false })
  },

  onShareAppMessage() {
    return {
      title: '冰雪互动世界 - 知识竞赛等你来战！',
      path: '/pages/games/games',
      imageUrl: '/assets/images/share.jpg'
    }
  },

  onUnload() {
    // 清除计时器
    if (this.data.quizTimer) {
      clearInterval(this.data.quizTimer)
    }
  }
})