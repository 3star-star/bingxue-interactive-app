// pages/scenes/scenes.js
import { scenesData } from '../../data/scenesData.js'

Page({
  data: {
    scenesList: [],
    showViewer: false,
    currentScene: null,
    currentHotspot: null,
    showHotspotPopup: false,
    soundEnabled: true,
    loading: false,
    panoramaRotation: 0,
    userScenes: [],
    showPhotoPreview: false,
    photoPreviewUrl: '',
    currentScenePhotos: []
  },

  onLoad() {
    this.initScenes()
    this.loadVisitedScenes()
  },

  onShow() {
    this.loadVisitedScenes()
  },

  // 初始化场景数据
  initScenes() {
    this.setData({
      scenesList: scenesData.map(scene => ({
        ...scene,
        visited: false,
        favorite: false,
        photosTaken: 0
      }))
    })
  },

  // 加载已访问场景
  loadVisitedScenes() {
    const userInfo = wx.getStorageSync('userInfo') || {}
    const userScenes = userInfo.scenesVisited || []
    const userFavorites = userInfo.sceneFavorites || []
    const scenePhotos = userInfo.scenePhotos || {}

    const updatedScenes = this.data.scenesList.map(scene => ({
      ...scene,
      visited: userScenes.includes(scene.id),
      favorite: userFavorites.includes(scene.id),
      photosTaken: scenePhotos[scene.id] || 0
    }))

    this.setData({
      scenesList: updatedScenes,
      userScenes: userScenes,
      userFavorites: userFavorites,
      scenePhotos: scenePhotos
    })
  },

  // 进入场景
  enterScene(e) {
    const scene = e.currentTarget.dataset.scene
    const app = getApp()

    // 标记为已访问
    if (!scene.visited) {
      const userInfo = wx.getStorageSync('userInfo') || {}
      userInfo.scenesVisited = userInfo.scenesVisited || []
      userInfo.scenesVisited.push(scene.id)

      wx.setStorageSync('userInfo', userInfo)

      // 添加访问积分
      app.addPoints(5)
    }

    this.setData({
      currentScene: scene,
      showViewer: true,
      loading: true,
      panoramaRotation: 0,
      showPhotoPreview: false,
      photoPreviewUrl: '',
      currentScenePhotos: []
    })

    // 模拟加载
    setTimeout(() => {
      this.setData({ loading: false })
    }, 1000)
  },

  // 离开场景
  exitScene() {
    this.setData({
      showViewer: false,
      currentScene: null,
      showPhotoPreview: false,
      photoPreviewUrl: ''
    })
  },

  // 显示热点信息
  showHotspotInfo(e) {
    const hotspot = e.currentTarget.dataset.hotspot
    this.setData({
      currentHotspot: hotspot,
      showHotspotPopup: true
    })
  },

  // 在热点打卡
  checkInAtHotspot() {
    wx.showToast({
      title: '打卡成功！',
      icon: 'success'
    })

    const app = getApp()
    app.addPoints(10)

    // 标记热点为已访问
    const updatedScene = this.data.currentScene
    const hotspotIndex = updatedScene.hotspots.findIndex(h => h.id === this.data.currentHotspot.id)
    if (hotspotIndex !== -1) {
      updatedScene.hotspots[hotspotIndex].visited = true
      this.setData({ currentScene: updatedScene })
    }

    this.setData({ showHotspotPopup: false })
  },

  // 查看热点照片
  showHotspotPhoto() {
    const app = getApp()
    const { currentHotspot } = this.data

    // 模拟生成照片
    const photoUrl = `/assets/images/scenes/${currentHotspot.id}_photo.jpg`
    this.setData({
      showPhotoPreview: true,
      photoPreviewUrl: photoUrl
    })

    // 添加拍照积分
    app.addPoints(5)
  },

  // 切换音效
  toggleSound() {
    const newSoundState = !this.data.soundEnabled
    this.setData({ soundEnabled: newSoundState })

    wx.showToast({
      title: newSoundState ? '音效已开启' : '音效已关闭',
      icon: 'none'
    })
  },

  // 切换收藏
  toggleFavorite() {
    const { currentScene } = this.data
    const app = getApp()

    const newFavoriteState = !currentScene.favorite
    const updatedScene = { ...currentScene, favorite: newFavoriteState }

    this.setData({ currentScene: updatedScene })

    // 更新用户收藏
    const userInfo = wx.getStorageSync('userInfo') || {}
    userInfo.sceneFavorites = userInfo.sceneFavorites || []

    if (newFavoriteState) {
      if (!userInfo.sceneFavorites.includes(currentScene.id)) {
        userInfo.sceneFavorites.push(currentScene.id)
        wx.showToast({
          title: '收藏成功！',
          icon: 'success'
        })
        app.addPoints(5)
      }
    } else {
      userInfo.sceneFavorites = userInfo.sceneFavorites.filter(id => id !== currentScene.id)
      wx.showToast({
        title: '已取消收藏',
        icon: 'none'
      })
    }

    wx.setStorageSync('userInfo', userInfo)
  },

  // 重置视角
  resetView() {
    this.setData({ panoramaRotation: 0 })
  },

  // 旋转视角
  rotatePanorama(e) {
    if (this.data.loading) return

    const touch = e.touches[0]
    const startX = touch.clientX
    const moveThreshold = 5

    const handleMove = (moveEvent) => {
      const currentX = moveEvent.touches[0].clientX
      const deltaX = currentX - startX

      if (Math.abs(deltaX) > moveThreshold) {
        const rotationDelta = deltaX * 0.5
        this.setData({
          panoramaRotation: this.data.panoramaRotation + rotationDelta
        })
      }
    }

    const handleEnd = () => {
      document.removeEventListener('touchmove', handleMove)
      document.removeEventListener('touchend', handleEnd)
    }

    document.addEventListener('touchmove', handleMove)
    document.addEventListener('touchend', handleEnd)
  },

  // 拍照功能
  takePhoto() {
    const app = getApp()
    const { currentScene } = this.data

    // 模拟拍照
    const photoUrl = `/assets/images/scenes/${currentScene.id}_photo_${Date.now()}.jpg`

    // 保存照片
    const userInfo = wx.getStorageSync('userInfo') || {}
    userInfo.scenePhotos = userInfo.scenePhotos || {}
    userInfo.scenePhotos[currentScene.id] = (userInfo.scenePhotos[currentScene.id] || 0) + 1

    wx.setStorageSync('userInfo', userInfo)

    // 更新场景照片数量
    const updatedScene = { ...currentScene, photosTaken: currentScene.photosTaken + 1 }
    this.setData({ currentScene: updatedScene })

    // 显示照片预览
    this.setData({
      showPhotoPreview: true,
      photoPreviewUrl: photoUrl
    })

    wx.showToast({
      title: '拍照成功！',
      icon: 'success'
    })

    // 添加拍照积分
    app.addPoints(10)
  },

  // 保存照片
  savePhoto() {
    wx.showToast({
      title: '照片已保存到相册',
      icon: 'success'
    })

    this.closePhotoPreview()
  },

  // 关闭照片预览
  closePhotoPreview() {
    this.setData({
      showPhotoPreview: false,
      photoPreviewUrl: ''
    })
  },

  // 分享
  onShareAppMessage() {
    const scene = this.data.currentScene
    return {
      title: `${scene.name} - 360°全景体验`,
      path: '/pages/scenes/scenes',
      imageUrl: '/assets/images/share.jpg'
    }
  }
})