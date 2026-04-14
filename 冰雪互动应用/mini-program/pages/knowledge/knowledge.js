// pages/knowledge/knowledge.js
import knowledgeData from '../../data/knowledgeData.js'

Page({
  data: {
    activeCategory: 'all',
    knowledgeList: [],
    showInteraction: false,
    currentKnowledge: null,
    currentInteraction: null,
    interactionProgress: 0,
    selectedOption: null,
    showResult: false,
    matchZones: [],
    draggedItem: null,
    matchItems: [],
    isDraggingOverZone: null,
    showHint: false,
    showMatchHint: false,
    interactionStartTime: 0,
    interactionTimeSpent: 0
  },

  onLoad() {
    this.initKnowledgeData()
  },

  onShow() {
    this.loadProgress()
  },

  // 初始化知识数据
  initKnowledgeData() {
    const processedKnowledge = knowledgeData.map(knowledge => ({
      ...knowledge,
      progress: 0,
      interactionTypes: knowledge.interactions.map(i => i.type),
      pointsGain: knowledge.interactions.reduce((sum, i) => sum + (i.points || 0), 0)
    }))
    this.setData({ knowledgeList: processedKnowledge })
  },

  // 加载学习进度
  loadProgress() {
    const userInfo = wx.getStorageSync('userInfo') || {}
    const knowledgeProgress = userInfo.knowledgeProgress || {}

    const updatedKnowledge = this.data.knowledgeList.map(knowledge => ({
      ...knowledge,
      progress: knowledgeProgress[knowledge.id] || 0
    }))

    this.setData({ knowledgeList: updatedKnowledge })
  },

  // 切换分类
  onCategoryChange(e) {
    const category = e.detail.name
    this.setData({ activeCategory: category })
  },

  // 开始学习
  startLearning(e) {
    const knowledge = e.currentTarget.dataset.knowledge
    const userInfo = wx.getStorageSync('userInfo') || {}

    // 检查是否已完成
    if (userInfo.knowledgeProgress && userInfo.knowledgeProgress[knowledge.id] === 100) {
      wx.showToast({
        title: '已完成',
        icon: 'none'
      })
      return
    }

    // 重置状态
    this.setData({
      currentKnowledge: knowledge,
      currentInteraction: knowledge.interactions[0],
      interactionProgress: 0,
      selectedOption: null,
      showResult: false,
      matchZones: this.initMatchZones(),
      matchItems: knowledge.interactions.find(i => i.type === 'match')?.items || [],
      showHint: false,
      showMatchHint: false,
      interactionStartTime: Date.now()
    })

    // 显示交互模态框
    this.setData({ showInteraction: true })
  },

  // 初始化匹配区域
  initMatchZones() {
    return Array(4).fill(null).map((_, i) => ({
      id: i,
      content: null
    }))
  },

  // 选择选项
  selectOption(e) {
    const index = e.currentTarget.dataset.index
    if (!this.data.showResult) {
      this.setData({ selectedOption: index })
    }
  },

  // 提交答案
  submitAnswer() {
    const app = getApp()
    const { currentInteraction, selectedOption } = this.data

    if (selectedOption === null) {
      wx.showToast({
        title: '请选择答案',
        icon: 'none'
      })
      return
    }

    this.setData({ showResult: true })

    // 计算答题时间
    const timeSpent = Date.now() - this.data.interactionStartTime
    this.setData({ interactionTimeSpent: timeSpent })

    // 判断答案
    const isCorrect = selectedOption === currentInteraction.correct

    if (isCorrect) {
      wx.showToast({
        title: '回答正确！+10积分',
        icon: 'success'
      })
      app.addPoints(10)

      // 根据答题速度给予额外奖励
      if (timeSpent < 5000) {
        wx.showToast({
          title: '速度奖！+5积分',
          icon: 'success'
        })
        app.addPoints(5)
      }
    } else {
      wx.showToast({
        title: '再接再厉！',
        icon: 'none'
      })
    }

    // 标记互动完成
    const updatedKnowledge = this.data.currentKnowledge
    const interactionIndex = updatedKnowledge.interactions.findIndex(i => i === currentInteraction)
    updatedKnowledge.interactions[interactionIndex].completed = true

    // 更新进度
    this.updateProgress(updatedKnowledge)

    // 1秒后进入下一个互动
    setTimeout(() => {
      this.startNextInteraction()
    }, 1000)
  },

  // 更新进度
  updateProgress(knowledge) {
    const userInfo = wx.getStorageSync('userInfo') || {}
    const completedInteractions = knowledge.interactions.filter(i => i.completed).length
    const progress = Math.round((completedInteractions / knowledge.interactions.length) * 100)

    userInfo.knowledgeProgress = userInfo.knowledgeProgress || {}
    userInfo.knowledgeProgress[knowledge.id] = progress

    wx.setStorageSync('userInfo', userInfo)

    // 更新列表中的进度
    const updatedKnowledgeList = this.data.knowledgeList.map(k =>
      k.id === knowledge.id ? { ...k, progress } : k
    )
    this.setData({ knowledgeList: updatedKnowledgeList })

    // 检查是否完成
    if (progress === 100) {
      wx.showToast({
        title: '恭喜完成所有互动！',
        icon: 'success'
      })
      app.addPoints(20)

      // 完成知识点
      const appInstance = getApp()
      appInstance.completeKnowledgePoint(knowledge.id)

      this.setData({ showInteraction: false })
    }
  },

  // 开始下一个互动
  startNextInteraction() {
    const { currentKnowledge } = this.data
    const incompleteInteractions = currentKnowledge.interactions.filter(i => !i.completed)

    if (incompleteInteractions.length > 0) {
      this.setData({
        currentInteraction: incompleteInteractions[0],
        selectedOption: null,
        showResult: false,
        showHint: false,
        showMatchHint: false,
        interactionProgress: (currentKnowledge.interactions.length - incompleteInteractions.length) / currentKnowledge.interactions.length * 100,
        interactionStartTime: Date.now()
      })
    } else {
      // 所有互动完成
      this.setData({ showInteraction: false })
    }
  },

  // 拖拽相关方法
  onDragStart(e) {
    const item = e.currentTarget.dataset.item
    this.setData({ draggedItem: item })
  },

  onDragEnd() {
    this.setData({ draggedItem: null, isDraggingOverZone: null })
  },

  onDragOver(e) {
    e.preventDefault()
    const zoneIndex = e.currentTarget.dataset.index
    this.setData({ isDraggingOverZone: zoneIndex })
  },

  onDrop(e) {
    const { draggedItem } = this.data
    const zoneIndex = e.currentTarget.dataset.index

    if (draggedItem) {
      const updatedZones = [...this.data.matchZones]
      updatedZones[zoneIndex] = {
        ...updatedZones[zoneIndex],
        content: draggedItem
      }

      // 隐藏已拖拽的项
      const matchItems = this.data.matchItems.filter(item => item !== draggedItem)

      this.setData({
        matchZones: updatedZones,
        matchItems: matchItems,
        isDraggingOverZone: null
      })

      // 检查是否全部完成
      this.checkMatchCompletion()
    }
  },

  // 检查匹配完成
  checkMatchCompletion() {
    if (this.data.matchZones.every(zone => zone.content)) {
      wx.showToast({
        title: '匹配成功！+15积分',
        icon: 'success'
      })

      const app = getApp()
      app.addPoints(15)

      // 标记当前互动完成
      const updatedKnowledge = this.data.currentKnowledge
      const interactionIndex = updatedKnowledge.interactions.findIndex(i => i === this.data.currentInteraction)
      updatedKnowledge.interactions[interactionIndex].completed = true

      this.updateProgress(updatedKnowledge)
    }
  },

  // 显示提示
  showHint() {
    const { currentInteraction } = this.data
    if (currentInteraction.hint) {
      this.setData({ showHint: true })

      // 使用提示后扣除积分
      const app = getApp()
      app.addPoints(-2)
      wx.showToast({
        title: '使用提示：-2积分',
        icon: 'none'
      })
    }
  },

  // 跳过互动
  skipInteraction() {
    const app = getApp()
    const { currentKnowledge, currentInteraction } = this.data

    // 跳过互动
    const updatedKnowledge = this.data.currentKnowledge
    const interactionIndex = updatedKnowledge.interactions.findIndex(i => i === currentInteraction)
    updatedKnowledge.interactions[interactionIndex].completed = true

    // 更新进度
    this.updateProgress(updatedKnowledge)

    // 扣除积分
    app.addPoints(-5)
    wx.showToast({
      title: '跳过互动：-5积分',
      icon: 'none'
    })

    // 开始下一个互动
    this.startNextInteraction()
  },

  // 获取互动类型文本
  getInteractionTypeText(type) {
    const typeMap = {
      'explore': '探索',
      'match': '匹配',
      'quiz': '问答'
    }
    return typeMap[type] || type
  },

  // 完成知识点
  completeKnowledge() {
    const app = getApp()
    const { currentKnowledge } = this.data

    // 完成知识点
    app.completeKnowledgePoint(currentKnowledge.id)

    // 检查成就
    app.checkFeatureAchievements()

    this.setData({ showInteraction: false })
  },

  onInteractionClose() {
    this.setData({ showInteraction: false })
  }
})