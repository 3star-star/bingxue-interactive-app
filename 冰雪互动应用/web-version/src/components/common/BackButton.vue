<template>
  <div class="back-button-container">
    <van-button
      type="default"
      size="small"
      @click="handleBack"
      class="back-button">
      <van-icon :name="icon" size="16" />
      <span>{{ text }}</span>
    </van-button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  to: {
    type: [String, Object],
    default: '/'
  },
  text: {
    type: String,
    default: '返回首页'
  },
  icon: {
    type: String,
    default: 'arrow-left'
  }
})

const router = useRouter()

const handleBack = () => {
  if (typeof props.to === 'string') {
    router.push(props.to)
  } else {
    router.push(props.to)
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

.back-button-container {
  position: fixed;
  top: $spacing-md;
  left: $spacing-md;
  z-index: 1000;
}

.back-button {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: $shadow-md;
  color: $accent-blue;
  font-weight: 500;

  &:hover {
    background: rgba(255, 255, 255, 1);
    transform: translateX(-3px);
    transition: all $transition-normal;
  }

  span {
    margin-left: $spacing-xs;
  }
}

@media (max-width: $mobile) {
  .back-button {
    padding: 6px 12px;
    font-size: 0.9rem;
  }
}
</style>
