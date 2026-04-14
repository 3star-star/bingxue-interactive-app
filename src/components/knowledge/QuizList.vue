<template>
  <div class="quiz-list-container">
    <!-- 难度选择 -->
    <div class="difficulty-selector">
      <h3>选择难度</h3>
      <div class="difficulty-buttons">
        <van-button
          v-for="level in [1, 2, 3]"
          :key="level"
          :type="selectedDifficulty === level ? 'primary' : 'default'"
          @click="selectDifficulty(level)"
        >
          {{ level }}级
        </van-button>
      </div>
    </div>

    <!-- 分类选择 -->
    <div class="category-selector">
      <h3>选择分类</h3>
      <div class="category-list">
        <van-button
          v-for="category in categories"
          :key="category.value"
          :type="selectedCategory === category.value ? 'primary' : 'default'"
          size="small"
          @click="selectCategory(category.value)"
        >
          {{ category.label }}
        </van-button>
      </div>
    </div>

    <!-- 题目列表 -->
    <div class="quiz-list">
      <div
        v-for="question in filteredQuestions"
        :key="question.id"
        class="quiz-item"
        @click="startQuiz(question)"
      >
        <div class="quiz-card">
          <div class="quiz-header">
            <div class="category-badge">{{ question.category }}</div>
            <div class="difficulty-level">
              <van-icon :name="getDifficultyIcon(question.difficulty)" size="16" />
              难度 {{ question.difficulty }}
            </div>
          </div>

          <div class="quiz-content">
            <h4>{{ question.title }}</h4>
            <p class="description">{{ question.description }}</p>
            <div class="quiz-stats">
              <span class="stat-item">
                <van-icon name="question-circle" size="14" />
                {{ question.options.length }} 个选项
              </span>
              <span class="stat-item">
                <van-icon name="gem" size="14" color="#FFD700" />
                {{ question.points }} 分
              </span>
            </div>
          </div>

          <div class="quiz-footer">
            <van-button type="primary" size="small">
              开始答题
            </van-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 成就挑战 -->
    <div class="achievement-challenge">
      <h3>成就挑战</h3>
      <div class="challenge-list">
        <div
          v-for="challenge in challenges"
          :key="challenge.id"
          class="challenge-item"
          :class="{ 'completed': isChallengeCompleted(challenge) }"
        >
          <div class="challenge-info">
            <h4>{{ challenge.title }}</h4>
            <p>{{ challenge.description }}</p>
            <div class="reward">
              <van-icon name="gem" size="16" color="#FFD700" />
              <span>奖励：{{ challenge.pointsRequired }} 分</span>
            </div>
          </div>
          <div class="challenge-progress">
            <van-progress
              :percentage="getChallengeProgress(challenge)"
              stroke-width="4"
              :show-pivot="false"
              color="#FFD700"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Toast } from 'vant'
import { useUserStore } from '@/stores/user'
import { getQuestionsByCategory, getRandomQuestions, achievementQuestionSets } from '@/data/quizData'

// Props
const props = defineProps({
  difficulty: {
    type: Number,
    default: null
  },
  category: {
    type: String,
    default: 'all'
  }
})

// 状态
const router = useRouter()
const userStore = useUserStore()
const selectedDifficulty = ref(props.difficulty)
const selectedCategory = ref(props.category)
const challenges = ref([
  {
    id: 'beginner',
    title: '冰雪初学者',
    description: '完成5道基础题目',
    pointsRequired: 50,
    type: 'category'
  },
  {
    id: 'sports',
    title: '冰雪运动达人',
    description: '完成10道运动题目',
    pointsRequired: 150,
    type: 'category'
  },
  {
    id: 'safety',
    title: '安全专家',
    description: '完成所有安全题目',
    pointsRequired: 200,
    type: 'category'
  },
  {
    id: 'master',
    title: '冰雪知识大师',
    description: '完成20道不同类别的题目',
    pointsRequired: 300,
    type: 'mixed'
  }
])

// 分类数据
const categories = ref([
  { label: '全部', value: 'all' },
  { label: '基础', value: '基础' },
  { label: '运动', value: '运动' },
  { label: '安全', value: '安全' },
  { label: '气象', value: '气象' },
  { label: '装备', value: '装备' },
  { label: '历史', value: '历史' },
  { label: '科学', value: '科学' },
  { label: '奥运', value: '奥运' },
  { label: '自然', value: '自然' },
  { label: '技巧', value: '技巧' },
  { label: '文化', value: '文化' },
  { label: '医学', value: '医学' },
  { label: '比赛', value: '比赛' },
  { label: '地理', value: '地理' },
  { label: '艺术', value: '艺术' },
  { label: '环保', value: '环保' },
  { label: '物理', value: '物理' },
  { label: '神话', value: '神话' },
  { label: '科技', value: '科技' },
  { label: '健康', value: '健康' }
])

// 计算属性
const filteredQuestions = computed(() => {
  let questions = []

  if (selectedCategory.value === 'all') {
    if (selectedDifficulty.value) {
      questions = getQuestionsByCategory('基础', selectedDifficulty.value)
      // 这里应该根据实际数据结构调整
      // 实际应该根据选择过滤
    } else {
      questions = getRandomQuestions(10) // 显示10道随机题目
    }
  } else {
    questions = getQuestionsByCategory(selectedCategory.value, selectedDifficulty.value)
  }

  return questions
})

// 方法
const selectDifficulty = (level) => {
  selectedDifficulty.value = level
}

const selectCategory = (category) => {
  selectedCategory.value = category
}

const getDifficultyIcon = (level) => {
  const icons = {
    1: 'stars',
    2: 'star',
    3: 'fire'
  }
  return icons[level] || 'question'
}

const startQuiz = (question) => {
  // 记录用户访问
  userStore.recordFeatureAccess('knowledge')

  // 如果是单个题目，直接开始
  if (question) {
    router.push({
      path: '/knowledge/quiz',
      query: {
        questionId: question.id,
        difficulty: selectedDifficulty.value,
        category: selectedCategory.value
      }
    })
  } else {
    // 如果是列表中的题目，可以开始一个测验
    Toast('开始答题')
  }
}

const isChallengeCompleted = (challenge) => {
  // 根据用户进度判断是否完成挑战
  // 这里需要根据实际的数据结构实现
  return false
}

const getChallengeProgress = (challenge) => {
  // 获取挑战进度百分比
  // 这里需要根据实际的数据结构实现
  return 0
}

onMounted(() => {
  // 初始化时记录访问
  userStore.recordFeatureAccess('knowledge')
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

.quiz-list-container {
  min-height: 100vh;
  background: #f5f7fa;
  padding: $spacing-xl $spacing-lg;
}

.difficulty-selector {
  margin-bottom: $spacing-xl;

  h3 {
    font-size: 1.3rem;
    color: $text-primary;
    margin-bottom: $spacing-md;
  }

  .difficulty-buttons {
    display: flex;
    gap: $spacing-md;
    justify-content: center;
  }
}

.category-selector {
  margin-bottom: $spacing-xl;

  h3 {
    font-size: 1.3rem;
    color: $text-primary;
    margin-bottom: $spacing-md;
  }

  .category-list {
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-sm;
  }
}

.quiz-list {
  margin-bottom: $spacing-xl;

  .quiz-item {
    margin-bottom: $spacing-md;
    cursor: pointer;

    .quiz-card {
      background: white;
      border-radius: $radius-md;
      padding: $spacing-lg;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      transition: all $transition-normal;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
      }

      .quiz-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: $spacing-md;

        .category-badge {
          background: #e0e7ff;
          color: #4c51bf;
          padding: $spacing-xs $spacing-md;
          border-radius: $radius-sm;
          font-size: 0.85rem;
        }

        .difficulty-level {
          display: flex;
          align-items: center;
          gap: $spacing-xs;
          font-size: 0.85rem;
          color: #6b7280;
        }
      }

      .quiz-content {
        h4 {
          font-size: 1.2rem;
          color: $text-primary;
          margin-bottom: $spacing-sm;
        }

        .description {
          font-size: 0.95rem;
          color: $text-secondary;
          margin-bottom: $spacing-md;
          line-height: 1.5;
        }

        .quiz-stats {
          display: flex;
          gap: $spacing-md;

          .stat-item {
            display: flex;
            align-items: center;
            gap: $spacing-xs;
            font-size: 0.85rem;
            color: #6b7280;
          }
        }
      }

      .quiz-footer {
        margin-top: $spacing-md;
      }
    }
  }
}

.achievement-challenge {
  background: white;
  border-radius: $radius-md;
  padding: $spacing-xl;

  h3 {
    font-size: 1.3rem;
    color: $text-primary;
    margin-bottom: $spacing-lg;
    text-align: center;
  }

  .challenge-list {
    .challenge-item {
      border: 2px solid #e5e7eb;
      border-radius: $radius-md;
      padding: $spacing-lg;
      margin-bottom: $spacing-md;
      transition: all $transition-normal;

      &.completed {
        border-color: #10B981;
        background: #f0fdf4;
      }

      .challenge-info {
        h4 {
          font-size: 1.1rem;
          color: $text-primary;
          margin-bottom: $spacing-sm;
        }

        p {
          font-size: 0.95rem;
          color: $text-secondary;
          margin-bottom: $spacing-md;
        }

        .reward {
          display: flex;
          align-items: center;
          gap: $spacing-xs;
          font-size: 0.9rem;
          color: #FFD700;
          font-weight: 500;
        }
      }

      .challenge-progress {
        margin-top: $spacing-md;
      }
    }
  }
}

@media (max-width: $mobile) {
  .quiz-list-container {
    padding: $spacing-lg;
  }

  .difficulty-selector,
  .category-selector {
    margin-bottom: $spacing-lg;
  }

  .quiz-list .quiz-item .quiz-card {
    padding: $spacing-md;
  }

  .achievement-challenge {
    padding: $spacing-lg;
  }
}
</style>