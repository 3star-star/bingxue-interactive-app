<template>
  <div id="app">
    <SnowBackground />
    <RouterView />
  </div>
</template>

<script setup>
import SnowBackground from '@/components/common/SnowBackground.vue'
import { RouterView } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { onMounted } from 'vue'

// 初始化用户状态
const userStore = useUserStore()

onMounted(() => {
  // 处理登录
  userStore.handleLogin()
})
</script>

<style lang="scss">
@import '@/assets/styles/variables';
@import '@/assets/styles/global.scss';

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  font-family: 'Microsoft YaHei', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: linear-gradient(to bottom, #1e3c72 0%, #2a5298 100%);
  min-height: 100vh;
  overflow-x: hidden;
}

#app {
  position: relative;
  min-height: 100vh;
}
</style>