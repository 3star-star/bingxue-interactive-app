Component({
  properties: {
    snowflakeCount: {
      type: Number,
      value: 100
    },
    enableInteraction: {
      type: Boolean,
      value: true
    }
  },

  data: {
    snowflakes: [],
    isPaused: false,
    clickEffects: []
  },

  lifetimes: {
    attached() {
      this.initSnowflakes()
      this.startAnimation()
    },

    detached() {
      if (this.animationTimer) {
        clearInterval(this.animationTimer)
      }
      if (this.clickEffectTimer) {
        clearInterval(this.clickEffectTimer)
      }
    }
  },

  methods: {
    // 初始化雪花
    initSnowflakes() {
      const snowflakes = []
      for (let i = 0; i < this.properties.snowflakeCount; i++) {
        snowflakes.push(this.generateSnowflake())
      }
      this.setData({ snowflakes })
    },

    // 生成单个雪花
    generateSnowflake() {
      return {
        id: Math.random(),
        left: Math.random() * 100 + '%',
        animationDuration: Math.random() * 3 + 2 + 's',
        animationDelay: Math.random() * 2 + 's',
        fontSize: Math.random() * 10 + 10 + 'rpx',
        opacity: Math.random() * 0.6 + 0.4,
        rotation: Math.random() * 360,
        swayAmount: Math.random() * 20 - 10
      }
    },

    // 开始动画
    startAnimation() {
      this.animationTimer = setInterval(() => {
        if (!this.data.isPaused) {
          // 更新雪花位置
          this.setData({
            snowflakes: this.data.snowflakes.map(flake => ({
              ...flake,
              left: `${(parseFloat(flake.left) + 0.1 + flake.swayAmount * 0.01) % 100}%`,
              rotation: (flake.rotation + 1) % 360
            }))
          })
        }
      }, 50)
    },

    // 处理点击事件
    handleTap(e) {
      if (!this.properties.enableInteraction) return

      const clickX = e.detail.x
      const clickY = e.detail.y

      // 创建点击效果
      const newEffect = {
        id: Date.now(),
        x: clickX,
        y: clickY,
        opacity: 1,
        scale: 1
      }

      this.setData({
        clickEffects: [...this.data.clickEffects, newEffect]
      })

      // 移除点击效果
      this.clickEffectTimer = setTimeout(() => {
        this.setData({
          clickEffects: this.data.clickEffects.filter(effect => effect.id !== newEffect.id)
        })
      }, 1000)

      // 生成新的雪花
      const newSnowflake = this.generateSnowflake()
      newSnowflake.left = `${clickX / window.innerWidth * 100}%`
      newSnowflake.top = `${clickY / window.innerHeight * 100}%`

      this.setData({
        snowflakes: [...this.data.snowflakes, newSnowflake]
      })

      // 限制雪花数量
      if (this.data.snowflakes.length > this.properties.snowflakeCount) {
        this.setData({
          snowflakes: this.data.snowflakes.slice(1)
        })
      }
    },

    // 暂停/恢复动画
    toggleAnimation() {
      this.setData({
        isPaused: !this.data.isPaused
      })
    },

    // 清除所有雪花
    clearSnowflakes() {
      this.setData({
        snowflakes: []
      })
    },

    // 重新生成雪花
    regenerateSnowflakes() {
      this.initSnowflakes()
    }
  }
})