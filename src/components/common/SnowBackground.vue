<template>
  <div class="snow-background">
    <div class="snowflake" v-for="flake in snowflakes" :key="flake.id" :style="flake.style">
      ❄
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// 雪花数量
const SNOWFLAKE_COUNT = 100

// 雪花数据
const snowflakes = ref([])

// 生成随机雪花
const generateSnowflake = () => {
  return {
    id: Math.random(),
    style: {
      left: Math.random() * 100 + '%',
      animationDuration: Math.random() * 3 + 2 + 's',
      animationDelay: Math.random() * 2 + 's',
      fontSize: Math.random() * 10 + 10 + 'px',
      opacity: Math.random() * 0.6 + 0.4
    }
  }
}

// 初始化雪花
const initSnowflakes = () => {
  snowflakes.value = []
  for (let i = 0; i < SNOWFLAKE_COUNT; i++) {
    snowflakes.value.push(generateSnowflake())
  }
}

// 动画循环
let animationFrameId
const animateSnow = () => {
  // 这里可以添加更复杂的雪花动画逻辑
  animationFrameId = requestAnimationFrame(animateSnow)
}

// 生命周期
onMounted(() => {
  initSnowflakes()
  animateSnow()
})

onUnmounted(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

.snow-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.snowflake {
  position: absolute;
  color: white;
  user-select: none;
  animation: snowfall linear infinite;
  animation-timing-function: linear;
}

@keyframes snowfall {
  0% {
    transform: translateY(-100px) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(360deg);
    opacity: 0;
  }
}
</style>