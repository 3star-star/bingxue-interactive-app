// 个人中心页面逻辑
Page({
    data: {
        userData: {
            learnedPoints: 15,
            totalPoints: 3280,
            achievements: 8,
            consecutiveDays: 5,
            progress: 75,
            level: 1,
            levelProgress: 65,
            achievementProgress: 40,
            loginProgress: 50,
            nickname: '冰雪探索者',
            achievementsList: [
                {
                    name: '知识达人',
                    icon: '🏆',
                    desc: '完成10个知识点学习',
                    unlocked: true,
                    unlockedAt: '2024-01-15'
                },
                {
                    name: '探索家',
                    icon: '🗺️',
                    desc: '访问3个全景景点',
                    unlocked: true,
                    unlockedAt: '2024-01-16'
                },
                {
                    name: '学习先锋',
                    icon: '📚',
                    desc: '连续登录7天',
                    unlocked: false,
                    unlockedAt: ''
                },
                {
                    name: '积分大师',
                    icon: '⭐',
                    desc: '累计获得2000积分',
                    unlocked: true,
                    unlockedAt: '2024-01-14'
                },
                {
                    name: '答题高手',
                    icon: '🎯',
                    desc: '答对20道题目',
                    unlocked: false,
                    unlockedAt: ''
                },
                {
                    name: '冰雪爱好者',
                    icon: '🏔️',
                    desc: '完成所有基础知识点',
                    unlocked: false,
                    unlockedAt: ''
                }
            ],
            favorites: [
                { title: '雪山知识', desc: '雪山的形成与分类', image: 'snow-mountain.jpg' },
                { title: '滑冰技巧', desc: '基础滑冰动作指导', image: 'ice-skating.jpg' },
                { title: '雪景摄影', desc: '冬季摄影技巧', image: 'snow-scene.jpg' }
            ]
        }
    },

    onLoad: function() {
        this.initPage();
    },

    onShow: function() {
        this.loadUserData();
        this.loadAchievements();
        this.loadFavorites();
    },

    // 初始化页面
    initPage: function() {
        this.updateStats();
        this.animateElements();
        this.drawChart();
    },

    // 加载用户数据
    loadUserData: function() {
        const userInfo = wx.getStorageSync('userInfo') || {}
        const knowledgeProgress = userInfo.knowledgeProgress || {}
        const userStats = userInfo.userStats || {}
        const scenePhotos = userInfo.scenePhotos || {}
        const sceneFavorites = userInfo.sceneFavorites || []

        // 计算学习进度
        const learnedPoints = Object.values(knowledgeProgress).filter(p => p === 100).length
        const totalPoints = Object.keys(knowledgeProgress).length
        const progress = totalPoints > 0 ? (learnedPoints / totalPoints) * 100 : 0

        // 计算等级
        const level = Math.floor(userInfo.points / 100) + 1
        const levelProgress = ((userInfo.points % 100) / 100) * 100

        // 计算成就进度
        const achievements = userStats.achievements || 0
        const achievementProgress = achievements > 0 ? Math.min((achievements / 12) * 100, 100) : 0

        this.setData({
            'userData.learnedPoints': learnedPoints,
            'userData.totalPoints': userInfo.points || 0,
            'userData.achievements': achievements,
            'userData.consecutiveDays': userInfo.loginStreak || 1,
            'userData.progress': progress,
            'userData.level': level,
            'userData.levelProgress': levelProgress,
            'userData.achievementProgress': achievementProgress,
            'userData.loginProgress': Math.min((userInfo.loginStreak || 1) / 7 * 100, 100)
        })
    },

    // 加载成就
    loadAchievements: function() {
        const achievements = wx.getStorageSync('achievements') || []
        const updatedAchievements = this.data.userData.achievementsList.map(achievement => {
            const unlockedAchievement = achievements.find(a => a.id === achievement.name)
            return {
                ...achievement,
                unlocked: !!unlockedAchievement,
                unlockedAt: unlockedAchievement ? unlockedAchievement.unlockedAt : ''
            }
        })

        this.setData({ 'userData.achievementsList': updatedAchievements })
    },

    // 加载收藏
    loadFavorites: function() {
        const userInfo = wx.getStorageSync('userInfo') || {}
        const sceneFavorites = userInfo.sceneFavorites || []
        const scenePhotos = userInfo.scenePhotos || {}

        // 获取收藏的场景
        const favorites = sceneFavorites.map(sceneId => {
            const scene = this.getSceneById(sceneId)
            return {
                title: scene ? scene.name : '未知场景',
                desc: scene ? `已拍${scenePhotos[sceneId] || 0}张照片` : '',
                image: scene ? `scenes/${scene.id}.jpg` : 'default.jpg'
            }
        })

        this.setData({ 'userData.favorites': favorites })
    },

    // 获取场景信息
    getSceneById: function(sceneId) {
        const scenesData = [
            { id: 1, name: '雪山风光' },
            { id: 2, name: '冰湖美景' },
            { id: 3, name: '雪原探险' },
            { id: 4, name: '冰川奇观' },
            { id: 5, name: '极光雪景' }
        ]
        return scenesData.find(s => s.id === sceneId)
    },

    // 更新统计数据
    updateStats: function() {
        // 已在loadUserData中实现
    },

    // 元素动画效果
    animateElements: function() {
        const cards = this.selectAllComponents('.stat-card, .achievement-card, .favorite-item');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.setData({
                    animation: {
                        opacity: 0,
                        transform: 'translateY(20px)'
                    }
                });

                setTimeout(() => {
                    card.setData({
                        animation: {
                            opacity: 1,
                            transform: 'translateY(0)'
                        }
                    });
                }, 100);
            }, index * 100);
        });
    },

    // 绘制图表
    drawChart: function() {
        const ctx = wx.createCanvasContext('learningChart')

        // 简单的柱状图
        const data = [30, 45, 60, 75, 90, 85, 70]
        const maxValue = Math.max(...data)
        const barWidth = 40
        const barSpacing = 20
        const chartHeight = 200
        const chartWidth = data.length * (barWidth + barSpacing)
        const startX = (750 - chartWidth) / 2

        // 绘制坐标轴
        ctx.beginPath()
        ctx.moveTo(startX, 50)
        ctx.lineTo(startX, 50 + chartHeight)
        ctx.lineTo(startX + chartWidth, 50 + chartHeight)
        ctx.stroke()

        // 绘制柱状图
        data.forEach((value, index) => {
            const barHeight = (value / maxValue) * chartHeight
            const x = startX + index * (barWidth + barSpacing)
            const y = 50 + chartHeight - barHeight

            // 绘制柱子
            ctx.fillStyle = '#0288d1'
            ctx.fillRect(x, y, barWidth, barHeight)

            // 绘制数值
            ctx.fillStyle = '#333'
            ctx.font = '20rpx Arial'
            ctx.textAlign = 'center'
            ctx.fillText(value, x + barWidth / 2, y - 10)

            // 绘制标签
            ctx.fillText(`周${index + 1}`, x + barWidth / 2, 50 + chartHeight + 20)
        })

        ctx.draw()
    },

    // 刷新成就
    refreshAchievements: function() {
        this.loadAchievements()
        wx.showToast({
            title: '成就已刷新',
            icon: 'success'
        })
    },

    // 管理收藏
    manageFavorites: function() {
        wx.showToast({
            title: '收藏管理功能开发中...',
            icon: 'none'
        })
    },

    // 移除收藏
    removeFavorite: function(e) {
        const index = e.currentTarget.dataset.index
        const userInfo = wx.getStorageSync('userInfo') || {}
        const favorites = userInfo.sceneFavorites || []

        // 移除收藏
        const updatedFavorites = favorites.filter((_, i) => i !== index)
        userInfo.sceneFavorites = updatedFavorites

        wx.setStorageSync('userInfo', userInfo)
        this.loadFavorites()

        wx.showToast({
            title: '已移除收藏',
            icon: 'success'
        })
    },

    // 处理收藏项点击
    handleFavoriteTap: function(e) {
        const index = e.currentTarget.dataset.index
        const favorite = this.data.userData.favorites[index]

        wx.navigateTo({
            url: `/pages/scenes/scenes?id=${this.getSceneIdByName(favorite.title)}`
        })
    },

    // 根据名称获取场景ID
    getSceneIdByName: function(name) {
        const scenesData = [
            { id: 1, name: '雪山风光' },
            { id: 2, name: '冰湖美景' },
            { id: 3, name: '雪原探险' },
            { id: 4, name: '冰川奇观' },
            { id: 5, name: '极光雪景' }
        ]
        const scene = scenesData.find(s => s.name === name)
        return scene ? scene.id : 1
    },

    // 导航到其他页面
    navigateTo: function(e) {
        const page = e.currentTarget.dataset.page
        wx.navigateTo({
            url: `../${page}/${page}`
        })
    }
})