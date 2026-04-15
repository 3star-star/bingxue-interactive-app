<template>
  <div class="quiz-view">
    <!-- 返回按钮 -->
    <BackButton to="/knowledge" text="返回知识中心" icon="arrow-left" />

    <!-- 答题头部 -->
    <div class="quiz-header">
      <h1>知识答题</h1>
      <div class="quiz-stats">
        <div class="stat-item">
          <span class="stat-label">题目进度</span>
          <span class="stat-value">{{ currentQuestionIndex + 1 }} / {{ questions.length }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">当前得分</span>
          <span class="stat-value">{{ score }}</span>
        </div>
      </div>
    </div>

    <!-- 答题区域 -->
    <div class="quiz-content" v-if="!quizCompleted">
      <div class="question-card">
        <!-- 题目信息 -->
        <div class="question-header">
          <span class="question-category">{{ currentQuestion.category }}</span>
          <span class="question-difficulty" :class="'difficulty-' + currentQuestion.difficulty">
            {{ getDifficultyText(currentQuestion.difficulty) }}
          </span>
        </div>

        <!-- 题目标题 -->
        <h2 class="question-title">{{ currentQuestion.question }}</h2>

        <!-- 选项列表 -->
        <div class="options-list">
          <div
            v-for="(option, index) in currentQuestion.options"
            :key="index"
            class="option-item"
            :class="{
              'selected': selectedAnswer === index,
              'correct': showAnswer && index === currentQuestion.correctAnswer,
              'wrong': showAnswer && selectedAnswer === index && index !== currentQuestion.correctAnswer
            }"
            @click="selectAnswer(index)">
            <div class="option-label">{{ String.fromCharCode(65 + index) }}</div>
            <div class="option-text">{{ option }}</div>
            <div class="option-icon" v-if="showAnswer">
              <van-icon v-if="index === currentQuestion.correctAnswer" name="success" color="#10B981" />
              <van-icon v-else-if="selectedAnswer === index" name="cross" color="#EF4444" />
            </div>
          </div>
        </div>

        <!-- 答案解析 -->
        <transition name="fade">
          <div v-if="showAnswer" class="explanation">
            <h3>💡 答案解析</h3>
            <p>{{ currentQuestion.explanation }}</p>
          </div>
        </transition>

        <!-- 操作按钮 -->
        <div class="quiz-actions">
          <van-button
            v-if="!showAnswer"
            type="primary"
            block
            size="large"
            :disabled="selectedAnswer === null"
            @click="submitAnswer">
            提交答案
          </van-button>
          <van-button
            v-else
            type="primary"
            block
            size="large"
            @click="nextQuestion">
            {{ currentQuestionIndex < questions.length - 1 ? '下一题' : '查看结果' }}
          </van-button>
        </div>
      </div>
    </div>

    <!-- 答题完成 -->
    <div class="quiz-result" v-else>
      <div class="result-card">
        <div class="result-icon">🎉</div>
        <h2>答题完成！</h2>
        <div class="result-stats">
          <div class="result-item">
            <span class="result-label">总题数</span>
            <span class="result-value">{{ questions.length }}</span>
          </div>
          <div class="result-item">
            <span class="result-label">正确数</span>
            <span class="result-value correct">{{ correctCount }}</span>
          </div>
          <div class="result-item">
            <span class="result-label">错误数</span>
            <span class="result-value wrong">{{ questions.length - correctCount }}</span>
          </div>
          <div class="result-item">
            <span class="result-label">总得分</span>
            <span class="result-value score">{{ score }}</span>
          </div>
        </div>

        <div class="result-message">
          <p v-if="correctCount === questions.length">完美！全部答对！</p>
          <p v-else-if="correctCount >= questions.length * 0.8">太棒了！掌握得很好！</p>
          <p v-else-if="correctCount >= questions.length * 0.6">不错！继续加油！</p>
          <p v-else>还需努力，多多学习哦！</p>
        </div>

        <div class="result-actions">
          <van-button type="primary" block size="large" @click="restartQuiz">
            重新答题
          </van-button>
          <van-button plain type="primary" block size="large" @click="backToKnowledge" style="margin-top: 12px;">
            返回知识中心
          </van-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { quizQuestions, getRandomQuestions } from '@/data/quizData'
import { showToast } from 'vant'
import BackButton from '@/components/common/BackButton.vue'

const router = useRouter()
const userStore = useUserStore()

// 状态
const questions = ref([])
const currentQuestionIndex = ref(0)
const selectedAnswer = ref(null)
const showAnswer = ref(false)
const score = ref(0)
const correctCount = ref(0)
const quizCompleted = ref(false)

// 当前题目
const currentQuestion = computed(() => questions.value[currentQuestionIndex.value])

// 获取难度文本
const getDifficultyText = (difficulty) => {
  const levels = { 1: '初级', 2: '中级', 3: '高级' }
  return levels[difficulty] || '未知'
}

// 选择答案
const selectAnswer = (index) => {
  if (!showAnswer.value) {
    selectedAnswer.value = index
  }
}

// 提交答案
const submitAnswer = () => {
  if (selectedAnswer.value === null) return

  showAnswer.value = true

  // 判断答案是否正确
  if (selectedAnswer.value === currentQuestion.value.correctAnswer) {
    correctCount.value++
    score.value += currentQuestion.value.points
    userStore.addPoints(currentQuestion.value.points)
    showToast({
      message: `回答正确！+${currentQuestion.value.points}积分`,
      icon: 'success'
    })
  } else {
    showToast({
      message: '回答错误，再接再厉！',
      icon: 'fail'
    })
  }
}

// 下一题
const nextQuestion = () => {
  if (currentQuestionIndex.value < questions.value.length - 1) {
    currentQuestionIndex.value++
    selectedAnswer.value = null
    showAnswer.value = false
  } else {
    quizCompleted.value = true
    // 检查成就
    userStore.checkFeatureAchievements()
  }
}

// 重新答题
const restartQuiz = () => {
  currentQuestionIndex.value = 0
  selectedAnswer.value = null
  showAnswer.value = false
  score.value = 0
  correctCount.value = 0
  quizCompleted.value = false
  initQuiz()
}

// 返回知识中心
const backToKnowledge = () => {
  router.push('/knowledge')
}

// 初始化答题
const initQuiz = () => {
  // 随机选择10道题
  questions.value = getRandomQuestions(10)
}

// 生命周期
onMounted(() => {
  initQuiz()
  userStore.initializeUser()
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

.quiz-view {
  min-height: 100vh;
  padding: $spacing-xl 0;
  background: linear-gradient(to bottom, #0f2547 0%, #1e3c72 100%);
}

.quiz-header {
  text-align: center;
  padding: 0 $spacing-xl $spacing-lg;
  margin-bottom: $spacing-lg;

  h1 {
    font-size: 2.5rem;
    color: white;
    margin-bottom: $spacing-md;
  }

  .quiz-stats {
    display: flex;
    justify-content: center;
    gap: $spacing-xl;

    .stat-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: $spacing-sm $spacing-md;
      background: rgba(255, 255, 255, 0.1);
      border-radius: $radius-md;
      backdrop-filter: blur(10px);

      .stat-label {
        font-size: 0.85rem;
        color: rgba(255, 255, 255, 0.7);
        margin-bottom: $spacing-xs;
      }

      .stat-value {
        font-size: 1.25rem;
        font-weight: 600;
        color: white;
      }
    }
  }
}

.quiz-content {
  padding: 0 $spacing-xl;
}

.question-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: $radius-lg;
  padding: $spacing-lg;
  border: 1px solid rgba(255, 255, 255, 0.2);

  .question-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $spacing-md;

    .question-category {
      padding: $spacing-xs $spacing-sm;
      background: rgba(59, 130, 246, 0.3);
      border-radius: $radius-sm;
      font-size: 0.875rem;
      color: white;
    }

    .question-difficulty {
      padding: $spacing-xs $spacing-sm;
      border-radius: $radius-sm;
      font-size: 0.875rem;
      font-weight: 500;
      color: white;

      &.difficulty-1 { background: #10B981; }
      &.difficulty-2 { background: #F59E0B; }
      &.difficulty-3 { background: #EF4444; }
    }
  }

  .question-title {
    font-size: 1.25rem;
    color: white;
    margin-bottom: $spacing-lg;
    line-height: 1.6;
  }
}

.options-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
  margin-bottom: $spacing-lg;

  .option-item {
    display: flex;
    align-items: center;
    gap: $spacing-md;
    padding: $spacing-md;
    background: rgba(255, 255, 255, 0.05);
    border: 2px solid rgba(255, 255, 255, 0.2);
    border-radius: $radius-md;
    cursor: pointer;
    transition: all $transition-normal;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    &.selected {
      background: rgba(59, 130, 246, 0.2);
      border-color: #3B82F6;
    }

    &.correct {
      background: rgba(16, 185, 129, 0.2);
      border-color: #10B981;
    }

    &.wrong {
      background: rgba(239, 68, 68, 0.2);
      border-color: #EF4444;
    }

    .option-label {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      font-weight: 600;
      color: white;
      flex-shrink: 0;
    }

    .option-text {
      flex: 1;
      color: white;
      font-size: 0.95rem;
      line-height: 1.5;
    }

    .option-icon {
      flex-shrink: 0;
    }
  }
}

.explanation {
  padding: $spacing-md;
  background: rgba(59, 130, 246, 0.1);
  border-left: 3px solid #3B82F6;
  border-radius: $radius-md;
  margin-bottom: $spacing-lg;

  h3 {
    font-size: 1rem;
    color: white;
    margin-bottom: $spacing-sm;
  }

  p {
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.8);
    line-height: 1.6;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.quiz-result {
  padding: 0 $spacing-xl;
}

.result-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: $radius-lg;
  padding: $spacing-xl;
  border: 1px solid rgba(255, 255, 255, 0.2);
  text-align: center;

  .result-icon {
    font-size: 4rem;
    margin-bottom: $spacing-md;
  }

  h2 {
    font-size: 2rem;
    color: white;
    margin-bottom: $spacing-lg;
  }

  .result-stats {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: $spacing-md;
    margin-bottom: $spacing-lg;

    .result-item {
      display: flex;
      flex-direction: column;
      padding: $spacing-md;
      background: rgba(255, 255, 255, 0.05);
      border-radius: $radius-md;

      .result-label {
        font-size: 0.9rem;
        color: rgba(255, 255, 255, 0.7);
        margin-bottom: $spacing-xs;
      }

      .result-value {
        font-size: 1.5rem;
        font-weight: 600;
        color: white;

        &.correct { color: #10B981; }
        &.wrong { color: #EF4444; }
        &.score { color: #F59E0B; }
      }
    }
  }

  .result-message {
    padding: $spacing-md;
    background: rgba(59, 130, 246, 0.2);
    border-radius: $radius-md;
    margin-bottom: $spacing-lg;

    p {
      font-size: 1.1rem;
      color: white;
      font-weight: 500;
    }
  }
}

@media (max-width: $mobile) {
  .quiz-header h1 {
    font-size: 2rem;
  }

  .quiz-stats {
    flex-direction: column;
    gap: $spacing-sm !important;
  }

  .result-stats {
    grid-template-columns: 1fr !important;
  }
}
</style>
