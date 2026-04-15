<template>
  <div class="knowledge-view">
    <!-- 返回首页按钮 -->
    <BackButton to="/" text="返回首页" icon="home" />

    <div class="knowledge-header">
      <h1>知识探索中心</h1>
      <p>探索冰雪世界的奥秘，开启学习之旅</p>
    </div>

    <!-- 知识分类导航 -->
    <div class="category-nav">
      <van-tabs v-model:active="activeCategory" @click="handleCategoryChange">
        <van-tab title="全部" name="all"></van-tab>
        <van-tab v-for="category in knowledgeCategories"
                 :key="category.id"
                 :title="category.name"
                 :name="category.id">
          <template #title>
            <span :style="{ color: category.color }">{{ category.name }}</span>
          </template>
        </van-tab>
      </van-tabs>
    </div>

    <!-- 知识卡片列表 -->
    <div class="knowledge-grid">
      <!-- 知识答题入口卡片 -->
      <div class="knowledge-card quiz-entrance" @click="goToQuiz">
        <div class="card-header">
          <span class="category-tag" style="background-color: #F59E0B;">
            知识答题
          </span>
          <span class="difficulty-badge" style="background: #8B5CF6;">
            挑战
          </span>
        </div>

        <div class="card-content">
          <h3>📝 知识答题挑战</h3>
          <p>测试你的冰雪知识，完成答题获得积分奖励！</p>
        </div>

        <div class="card-actions">
          <van-button
            type="primary"
            size="small"
            @click.stop="goToQuiz">
            开始答题
          </van-button>
        </div>
      </div>

      <div v-for="knowledge in filteredKnowledge"
           :key="knowledge.id"
           class="knowledge-card"
           :class="{ 'completed': isKnowledgeCompleted(knowledge.id) }">

        <div class="card-header">
          <span class="category-tag"
                :style="{ backgroundColor: getCategoryColor(knowledge.category) }">
            {{ getCategoryName(knowledge.category) }}
          </span>
          <span class="difficulty-badge" :class="'difficulty-' + knowledge.difficulty">
            {{ getDifficultyText(knowledge.difficulty) }}
          </span>
        </div>

        <div class="card-content">
          <h3>{{ knowledge.title }}</h3>
          <p>{{ knowledge.description }}</p>
          <div class="progress-bar" v-if="isKnowledgeStarted(knowledge.id)">
            <div class="progress-fill" :style="{ width: getKnowledgeProgress(knowledge.id) + '%' }"></div>
          </div>
        </div>

        <div class="card-actions">
          <van-button
            type="primary"
            size="small"
            @click="startLearning(knowledge)"
            :disabled="isKnowledgeCompleted(knowledge.id)">
            {{ isKnowledgeCompleted(knowledge.id) ? '已完成' : '开始学习' }}
          </van-button>
        </div>
      </div>
    </div>

    <!-- 交互学习模态框 -->
    <van-popup
      v-model:show="showInteraction"
      position="bottom"
      :style="{ height: '80%' }"
      round
      closeable>

      <div class="interaction-container">
        <div class="interaction-header">
          <h3>{{ currentKnowledge?.title }}</h3>
          <van-progress
            :percentage="interactionProgress"
            stroke-width="6"
            color="#3B82F6"/>
        </div>

        <div class="interaction-content">
          <!-- 点击探索 -->
          <div v-if="currentInteraction.type === 'explore'" class="explore-mode">
            <div class="explore-image">
              <img :src="getExploreImage(currentKnowledge.id)" alt="探索内容">
            </div>
            <div class="explore-info">
              <h4>{{ currentInteraction.question }}</h4>
              <p>{{ currentInteraction.answer }}</p>
            </div>
          </div>

          <!-- 拖拽匹配 -->
          <div v-else-if="currentInteraction.type === 'match'" class="match-mode">
            <div class="match-items">
              <div v-for="item in currentInteraction.items"
                   :key="item"
                   class="match-item"
                   draggable="true"
                   @dragstart="handleDragStart($event, item)"
                   @dragend="handleDragEnd">
                {{ item }}
              </div>
            </div>
            <div class="match-zones">
              <div class="match-zone"
                   v-for="(zone, index) in matchZones"
                   :key="index"
                   @dragover.prevent
                   @drop="handleDrop($event, index)">
                <span v-if="zone.content">{{ zone.content }}</span>
                <span v-else>拖拽到这里</span>
              </div>
            </div>
          </div>

          <!-- 选择题 -->
          <div v-else-if="currentInteraction.type === 'quiz'" class="quiz-mode">
            <h4>{{ currentInteraction.question }}</h4>
            <div class="quiz-options">
              <div v-for="(option, index) in currentInteraction.options"
                   :key="index"
                   class="quiz-option"
                   :class="{
                     'selected': selectedOption === index,
                     'correct': showResult && index === currentInteraction.correct,
                     'wrong': showResult && selectedOption === index && index !== currentInteraction.correct
                   }"
                   @click="selectOption(index)">
                {{ option }}
              </div>
            </div>
            <van-button
              type="primary"
              block
              @click="submitAnswer"
              :disabled="selectedOption === null || showResult">
              {{ showResult ? '下一题' : '提交答案' }}
            </van-button>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { knowledgeData, knowledgeCategories } from '@/data/knowledgeData'
import { showToast } from 'vant'
import BackButton from '@/components/common/BackButton.vue'

const router = useRouter()
const userStore = useUserStore()

// 状态
const activeCategory = ref('all')
const showInteraction = ref(false)
const currentKnowledge = ref(null)
const currentInteraction = ref(null)
const interactionProgress = ref(0)
const selectedOption = ref(null)
const showResult = ref(false)
const matchZones = ref([])
const draggedItem = ref(null)

// 计算属性
const filteredKnowledge = computed(() => {
  if (activeCategory.value === 'all') {
    return knowledgeData
  }
  return knowledgeData.filter(k => k.category === activeCategory.value)
})

// 获取分类颜色
const getCategoryColor = (categoryName) => {
  const category = knowledgeCategories.find(c => c.name === categoryName)
  return category ? category.color : '#999999'
}

// 获取分类名称
const getCategoryName = (categoryId) => {
  const category = knowledgeCategories.find(c => c.id === categoryId)
  return category ? category.name : '其他'
}

// 获取难度文本
const getDifficultyText = (difficulty) => {
  const levels = {
    1: '初级',
    2: '中级',
    3: '高级'
  }
  return levels[difficulty] || '未知'
}

// 检查知识点是否已完成
const isKnowledgeCompleted = (knowledgeId) => {
  return userStore.knowledgeProgress[knowledgeId] === 100
}

// 检查知识点是否已开始
const isKnowledgeStarted = (knowledgeId) => {
  return userStore.knowledgeProgress[knowledgeId] > 0
}

// 获取知识点进度
const getKnowledgeProgress = (knowledgeId) => {
  return userStore.knowledgeProgress[knowledgeId] || 0
}

// 获取探索图片
const getExploreImage = (knowledgeId) => {
  // 这里可以根据知识点ID返回不同的图片
  return `/assets/images/knowledge/${knowledgeId}.jpg`
}

// 切换分类
const handleCategoryChange = () => {
  // 重置进度
  interactionProgress.value = 0
}

// 开始学习
const startLearning = (knowledge) => {
  currentKnowledge.value = knowledge
  showInteraction.value = true
  showResult.value = false
  selectedOption.value = null

  // 重置匹配区域
  matchZones.value = Array(4).fill(null).map((_, i) => ({
    id: i,
    content: null
  }))

  // 开始第一个互动
  startNextInteraction()
}

// 开始下一个互动
const startNextInteraction = () => {
  // 找出未完成的互动
  const incompleteInteractions = currentKnowledge.value.interactions.filter(
    interaction => !interaction.completed
  )

  if (incompleteInteractions.length > 0) {
    currentInteraction.value = incompleteInteractions[0]
    interactionProgress.value = (
      (currentKnowledge.value.interactions.length - incompleteInteractions.length) /
      currentKnowledge.value.interactions.length
    ) * 100
  } else {
    // 所有互动完成
    completeKnowledge()
  }
}

// 选择选项
const selectOption = (index) => {
  if (!showResult.value) {
    selectedOption.value = index
  }
}

// 提交答案
const submitAnswer = () => {
  showResult.value = true

  // 如果答案正确，增加积分
  if (selectedOption.value === currentInteraction.value.correct) {
    userStore.addPoints(10)
    showToast('回答正确！+10积分')
  } else {
    showToast('再接再厉！')
  }

  // 标记互动完成
  currentInteraction.value.completed = true

  // 1秒后进入下一个互动
  setTimeout(() => {
    startNextInteraction()
  }, 1000)
}

// 拖拽开始
const handleDragStart = (event, item) => {
  draggedItem.value = item
  event.dataTransfer.effectAllowed = 'move'
}

// 拖拽结束
const handleDragEnd = () => {
  draggedItem.value = null
}

// 处理放置
const handleDrop = (event, zoneIndex) => {
  if (draggedItem.value) {
    matchZones.value[zoneIndex].content = draggedItem.value

    // 移除已拖拽的项
    const itemElements = document.querySelectorAll('.match-item')
    itemElements.forEach(el => {
      if (el.textContent === draggedItem.value) {
        el.style.display = 'none'
      }
    })

    // 检查是否全部完成
    checkMatchCompletion()
  }
}

// 检查匹配是否完成
const checkMatchCompletion = () => {
  if (matchZones.value.every(zone => zone.content)) {
    setTimeout(() => {
      showToast('匹配成功！')
      currentInteraction.value.completed = true
      userStore.addPoints(15)
      startNextInteraction()
    }, 500)
  }
}

// 完成知识点
const completeKnowledge = () => {
  userStore.completeKnowledgePoint(currentKnowledge.value.id)
  showToast('恭喜完成所有互动！')
  showInteraction.value = false

  // 检查成就
  userStore.checkFeatureAchievements()
}

// 跳转到答题页面
const goToQuiz = () => {
  router.push('/quiz')
}

// 生命周期
onMounted(() => {
  // 初始化用户数据
  userStore.initializeUser()
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

.knowledge-view {
  padding: $spacing-xl 0;
  min-height: 100vh;
}

.knowledge-header {
  text-align: center;
  padding: 0 $spacing-xl $spacing-lg;
  margin-bottom: $spacing-lg;

  h1 {
    font-size: 2.5rem;
    color: white;
    margin-bottom: $spacing-sm;
  }

  p {
    font-size: 1.1rem;
    color: $text-secondary;
  }
}

.category-nav {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: $spacing-sm;
  margin: 0 $spacing-xl;
  border-radius: $radius-md;
}

.knowledge-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: $spacing-lg;
  padding: $spacing-xl;
}

.knowledge-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: $radius-lg;
  padding: $spacing-lg;
  transition: all $transition-normal;
  border: 1px solid rgba(255, 255, 255, 0.2);
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.15);
  }

  &.completed {
    border-color: #10B981;
    background: rgba(16, 185, 129, 0.1);
  }

  &.quiz-entrance {
    border-color: #F59E0B;
    background: rgba(245, 158, 11, 0.15);

    &:hover {
      background: rgba(245, 158, 11, 0.25);
      transform: translateY(-5px) scale(1.02);
    }
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $spacing-md;

    .category-tag {
      padding: $spacing-xs $spacing-sm;
      border-radius: $radius-sm;
      font-size: 0.875rem;
      color: white;
    }

    .difficulty-badge {
      padding: $spacing-xs $spacing-sm;
      border-radius: $radius-sm;
      font-size: 0.875rem;
      font-weight: 500;
      color: white;

      &.difficulty-1 {
        background: #10B981;
      }

      &.difficulty-2 {
        background: #F59E0B;
      }

      &.difficulty-3 {
        background: #EF4444;
      }
    }
  }

  .card-content {
    margin-bottom: $spacing-md;

    h3 {
      font-size: 1.25rem;
      color: white;
      margin-bottom: $spacing-sm;
    }

    p {
      font-size: 0.95rem;
      color: $text-secondary;
      line-height: 1.5;
      margin-bottom: $spacing-md;
    }

    .progress-bar {
      height: 6px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 3px;
      overflow: hidden;

      .progress-fill {
        height: 100%;
        background: #10B981;
        transition: width $transition-normal;
      }
    }
  }
}

.interaction-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: $spacing-md;

  .interaction-header {
    margin-bottom: $spacing-lg;

    h3 {
      font-size: 1.5rem;
      color: white;
      margin-bottom: $spacing-sm;
    }
  }

  .interaction-content {
    flex: 1;
    overflow-y: auto;
  }
}

.explore-mode {
  text-align: center;

  .explore-image {
    margin-bottom: $spacing-lg;

    img {
      width: 100%;
      max-width: 400px;
      border-radius: $radius-md;
      box-shadow: $shadow-lg;
    }
  }

  .explore-info {
    background: rgba(255, 255, 255, 0.1);
    padding: $spacing-lg;
    border-radius: $radius-md;

    h4 {
      color: white;
      margin-bottom: $spacing-sm;
    }

    p {
      color: $text-secondary;
      line-height: 1.6;
    }
  }
}

.match-mode {
  .match-items {
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-md;
    margin-bottom: $spacing-lg;
    padding: $spacing-md;
    background: rgba(255, 255, 255, 0.1);
    border-radius: $radius-md;

    .match-item {
      padding: $spacing-md;
      background: $accent-blue;
      border-radius: $radius-md;
      color: white;
      cursor: move;
      transition: all $transition-normal;

      &:hover {
        transform: scale(1.05);
      }
    }
  }

  .match-zones {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: $spacing-md;

    .match-zone {
      padding: $spacing-lg;
      background: rgba(255, 255, 255, 0.1);
      border: 2px dashed rgba(255, 255, 255, 0.3);
      border-radius: $radius-md;
      min-height: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: $text-secondary;
      transition: all $transition-normal;

      &:hover {
        border-color: $accent-blue;
        background: rgba(255, 255, 255, 0.15);
      }
    }
  }
}

.quiz-mode {
  h4 {
    color: white;
    font-size: 1.25rem;
    margin-bottom: $spacing-lg;
  }

  .quiz-options {
    margin-bottom: $spacing-lg;

    .quiz-option {
      padding: $spacing-md;
      margin-bottom: $spacing-md;
      background: rgba(255, 255, 255, 0.1);
      border-radius: $radius-md;
      color: white;
      cursor: pointer;
      transition: all $transition-normal;

      &:hover {
        background: rgba(255, 255, 255, 0.2);
      }

      &.selected {
        background: $accent-blue;
      }

      &.correct {
        background: #10B981;
      }

      &.wrong {
        background: #EF4444;
      }
    }
  }
}

@media (max-width: $mobile) {
  .knowledge-grid {
    grid-template-columns: 1fr;
    padding: $spacing-md;
  }

  .match-zones {
    grid-template-columns: 1fr;
  }
}
</style>