<template>
  <div class="quiz-container">
    <!-- 题目卡片 -->
    <div class="quiz-card" :class="{ 'show-result': showResult }">
      <!-- 顶部信息栏 -->
      <div class="quiz-header">
        <div class="category-info">
          <span class="category-tag">{{ currentQuestion.category }}</span>
          <span class="difficulty">
            <van-icon :name="getDifficultyIcon" size="16" />
            {{ currentQuestion.difficulty }}级
          </span>
        </div>
        <div class="progress-info">
          <span>{{ currentQuestionIndex + 1 }} / {{ totalQuestions }}</span>
          <van-progress
            :percentage="progressPercentage"
            stroke-width="4"
            :show-pivot="false"
            color="#3B82F6"
          />
        </div>
      </div>

      <!-- 问题内容 -->
      <div class="question-content">
        <div class="question-header">
          <h3>{{ currentQuestion.title }}</h3>
          <p class="question-description">{{ currentQuestion.description }}</p>
        </div>

        <!-- 问题图片 -->
        <div v-if="currentQuestion.image" class="question-image">
          <img :src="currentQuestion.image" :alt="currentQuestion.title" />
        </div>

        <!-- 问题文本 -->
        <div class="question-text">
          <h4>{{ currentQuestion.question }}</h4>
        </div>

        <!-- 选项 -->
        <div v-if="!showResult" class="options-container">
          <div
            v-for="(option, index) in currentQuestion.options"
            :key="index"
            class="option-item"
            :class="{ 'selected': selectedOption === index, 'correct': showResult && index === currentQuestion.correctAnswer }"
            @click="selectOption(index)"
          >
            <div class="option-marker">
              <span class="option-letter">{{ String.fromCharCode(65 + index) }}</span>
            </div>
            <div class="option-text">{{ option }}</div>
          </div>
        </div>

        <!-- 结果显示 -->
        <div v-if="showResult" class="result-container">
          <div class="result-header" :class="resultClass">
            <van-icon :name="resultIcon" size="32" />
            <h4>{{ resultTitle }}</h4>
          </div>

          <div class="explanation">
            <h5>解释：</h5>
            <p>{{ currentQuestion.explanation }}</p>
          </div>

          <div class="key-points">
            <h5>关键词：</h5>
            <div class="tags">
              <van-tag
                v-for="(keyword, index) in currentQuestion.keywords"
                :key="index"
                type="primary"
                size="medium"
              >
                {{ keyword }}
              </van-tag>
            </div>
          </div>

          <div class="score-info">
            <van-icon name="gem" size="20" color="#FFD700" />
            <span>获得积分：+{{ currentQuestion.points }}</span>
          </div>

          <div class="next-button">
            <van-button
              type="primary"
              block
              round
              size="large"
              @click="nextQuestion"
              :disabled="!canProceed"
            >
              {{ currentQuestionIndex === totalQuestions - 1 ? '查看结果' : '下一题' }}
            </van-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部信息 -->
    <div class="quiz-footer">
      <div class="stats">
        <van-icon name="clock" size="16" />
        <span>用时：{{ formatTime }}</span>
      </div>
      <div class="score">
        <van-icon name="trophy" size="16" />
        <span>总分：{{ totalScore }}</span>
      </div>
    </div>

    <!-- 成功提示 -->
    <van-popup
      v-model:show="showSuccess"
      position="center"
      :style="{ width: '80%' }"
      round
      closeable>
      <div class="success-popup">
        <van-icon name="checked" size="48" color="#52C41A" />
        <h3>恭喜完成！</h3>
        <p>您答对了 {{ correctCount }} 题</p>
        <p>总分：{{ finalScore }} 分</p>
        <div class="achievements">
          <h4>获得成就：</h4>
          <div v-for="achievement in unlockedAchievements" :key="achievement.id" class="achievement-item">
            <van-icon :name="getAchievementIcon(achievement.id)" size="24" />
            <span>{{ achievement.title }}</span>
          </div>
        </div>
        <van-button
          type="primary"
          block
          round
          @click="restartQuiz"
        >
          再来一次
        </van-button>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { showToast } from 'vant'
import { useUserStore } from '@/stores/user'
import { getQuestionsByDifficulty, achievementQuestionSets } from '@/data/quizData'

// Props
const props = defineProps({
  questions: {
    type: Array,
    required: true
  },
  category: {
    type: String,
    default: 'all'
  }
})

// Emits
const emit = defineEmits(['quizComplete'])

// 状态
const userStore = useUserStore()
const currentQuestionIndex = ref(0)
const selectedOption = ref(-1)
const showResult = ref(false)
const startTime = ref(Date.now())
const timer = ref(null)
const showSuccess = ref(false)
const canProceed = ref(true)
const totalScore = ref(0)
const correctCount = ref(0)
const finalScore = ref(0)
const unlockedAchievements = ref([])

// 计算属性
const currentQuestion = computed(() => {
  return props.questions[currentQuestionIndex.value]
})

const totalQuestions = computed(() => props.questions.length)
const progressPercentage = computed(() => {
  return Math.round(((currentQuestionIndex.value + 1) / totalQuestions.value) * 100)
})

const getDifficultyIcon = computed(() => {
  const icons = {
    1: 'stars',
    2: 'star',
    3: 'fire'
  }
  return icons[currentQuestion.value.difficulty] || 'question'
})

const resultClass = computed(() => {
  return selectedOption.value === currentQuestion.value.correctAnswer ? 'correct' : 'wrong'
})

const resultIcon = computed(() => {
  return selectedOption.value === currentQuestion.value.correctAnswer ? 'success' : 'close'
})

const resultTitle = computed(() => {
  return selectedOption.value === currentQuestion.value.correctAnswer ? '回答正确！' : '回答错误'
})

const formatTime = computed(() => {
  const elapsed = Date.now() - startTime.value
  const minutes = Math.floor(elapsed / 60000)
  const seconds = Math.floor((elapsed % 60000) / 1000)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
})

// 方法
const selectOption = (index) => {
  if (showResult.value || selectedOption.value !== -1) return

  selectedOption.value = index
  showResult.value = true
  canProceed.value = true

  // 检查答案
  if (index === currentQuestion.value.correctAnswer) {
    correctCount.value++
    totalScore.value += currentQuestion.value.points
    userStore.addPoints(currentQuestion.value.points)
  }
}

const nextQuestion = () => {
  if (currentQuestionIndex.value < totalQuestions.value - 1) {
    currentQuestionIndex.value++
    selectedOption.value = -1
    showResult.value = false
    canProceed.value = false
    setTimeout(() => {
      canProceed.value = true
    }, 100)
  } else {
    // 测验完成
    completeQuiz()
  }
}

const completeQuiz = () => {
  finalScore.value = totalScore.value

  // 检查成就
  checkAchievements()

  // 显示成功弹窗
  showSuccess.value = true

  // 发送完成事件
  emit('quizComplete', {
    score: finalScore.value,
    correct: correctCount.value,
    total: totalQuestions.value
  })
}

const checkAchievements = () => {
  const accuracy = (correctCount.value / totalQuestions.value) * 100

  // 根据准确率解锁成就
  if (accuracy >= 80) {
    userStore.unlockAchievement('quiz_expert', '答题专家')
    unlockedAchievements.value.push({
      id: 'quiz_expert',
      title: '答题专家'
    })
  }

  if (accuracy >= 60) {
    userStore.unlockAchievement('quiz_good', '答题能手')
    unlockedAchievements.value.push({
      id: 'quiz_good',
      title: '答题能手'
    })
  }

  // 根据分数解锁成就
  if (finalScore.value >= 100) {
    userStore.unlockAchievement('score_100', '百分达人')
    unlockedAchievements.value.push({
      id: 'score_100',
      title: '百分达人'
    })
  }
}

const getAchievementIcon = (achievementId) => {
  const icons = {
    quiz_expert: 'diamond',
    quiz_good: 'star',
    score_100: 'trophy'
  }
  return icons[achievementId] || 'medal'
}

const restartQuiz = () => {
  currentQuestionIndex.value = 0
  selectedOption.value = -1
  showResult.value = false
  showSuccess.value = false
  startTime.value = Date.now()
  correctCount.value = 0
  totalScore.value = 0
  unlockedAchievements.value = []
}

// 生命周期
onMounted(() => {
  // 启动计时器
  timer.value = setInterval(() => {
    // 更新计时显示
  }, 1000)
})

onUnmounted(() => {
  // 清除计时器
  if (timer.value) {
    clearInterval(timer.value)
  }
})

// 导出方法供外部调用
defineExpose({
  restartQuiz
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

.quiz-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: $spacing-xl $spacing-lg;
}

.quiz-card {
  background: white;
  border-radius: $radius-lg;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all $transition-normal;

  &.show-result {
    background: #f8f9fa;
  }

  .quiz-header {
    padding: $spacing-lg;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;

    .category-info {
      display: flex;
      align-items: center;
      gap: $spacing-md;
      margin-bottom: $spacing-md;

      .category-tag {
        background: rgba(255, 255, 255, 0.2);
        padding: $spacing-xs $spacing-md;
        border-radius: $radius-sm;
        font-size: 0.9rem;
      }

      .difficulty {
        display: flex;
        align-items: center;
        gap: $spacing-xs;
        font-size: 0.9rem;
      }
    }

    .progress-info {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: $spacing-md;

      span:first-child {
        font-size: 0.9rem;
        font-weight: 500;
      }
    }
  }

  .question-content {
    padding: $spacing-xl;

    .question-header {
      text-align: center;
      margin-bottom: $spacing-xl;

      h3 {
        font-size: 1.5rem;
        color: $text-primary;
        margin-bottom: $spacing-sm;
      }

      .question-description {
        font-size: 1rem;
        color: $text-secondary;
      }
    }

    .question-image {
      text-align: center;
      margin-bottom: $spacing-xl;

      img {
        max-width: 100%;
        max-height: 300px;
        border-radius: $radius-md;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }
    }

    .question-text {
      h4 {
        font-size: 1.3rem;
        color: $text-primary;
        text-align: center;
        margin-bottom: $spacing-xl;
      }
    }

    .options-container {
      display: flex;
      flex-direction: column;
      gap: $spacing-md;

      .option-item {
        display: flex;
        align-items: center;
        padding: $spacing-md;
        background: white;
        border: 2px solid #e0e0e0;
        border-radius: $radius-md;
        cursor: pointer;
        transition: all $transition-normal;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        &.selected {
          border-color: #3B82F6;
          background: #eff6ff;
        }

        &.correct {
          border-color: #10B981;
          background: #d1fae5;
        }

        .option-marker {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #f3f4f6;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: $spacing-md;

          .option-letter {
            font-weight: bold;
            color: #6b7280;
          }
        }

        .option-text {
          flex: 1;
          font-size: 1.1rem;
          color: $text-primary;
        }
      }
    }

    .result-container {
      text-align: center;
      padding: $spacing-xl;

      .result-header {
        margin-bottom: $spacing-xl;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: $spacing-sm;

        &.correct {
          color: #10B981;
        }

        &.wrong {
          color: #EF4444;
        }

        h4 {
          font-size: 1.5rem;
          margin: 0;
        }
      }

      .explanation {
        background: #f3f4f6;
        padding: $spacing-lg;
        border-radius: $radius-md;
        margin-bottom: $spacing-xl;

        h5 {
          font-size: 1.1rem;
          color: $text-primary;
          margin-bottom: $spacing-sm;
        }

        p {
          color: $text-secondary;
          line-height: 1.6;
        }
      }

      .key-points {
        margin-bottom: $spacing-xl;

        h5 {
          font-size: 1.1rem;
          color: $text-primary;
          margin-bottom: $spacing-sm;
        }

        .tags {
          display: flex;
          flex-wrap: wrap;
          gap: $spacing-sm;
          justify-content: center;
        }
      }

      .score-info {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: $spacing-sm;
        margin-bottom: $spacing-xl;
        font-size: 1.2rem;
        color: #FFD700;
        font-weight: bold;
      }

      .next-button {
        margin-top: $spacing-xl;
      }
    }
  }

  .quiz-footer {
    padding: $spacing-lg;
    background: white;
    border-top: 1px solid #e0e0e0;
    display: flex;
    justify-content: space-around;

    .stats, .score {
      display: flex;
      align-items: center;
      gap: $spacing-sm;
      font-size: 0.9rem;
      color: $text-secondary;
    }
  }
}

.success-popup {
  text-align: center;
  padding: $spacing-xl;

  h3 {
    font-size: 1.5rem;
    color: $text-primary;
    margin: $spacing-lg 0;
  }

  p {
    font-size: 1.1rem;
    color: $text-secondary;
    margin: $spacing-sm 0;
  }

  .achievements {
    margin: $spacing-xl 0;

    h4 {
      font-size: 1.1rem;
      color: $text-primary;
      margin-bottom: $spacing-md;
    }

    .achievement-item {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: $spacing-sm;
      margin-bottom: $spacing-sm;
      font-size: 1rem;
      color: $text-secondary;
    }
  }
}

@media (max-width: $mobile) {
  .quiz-container {
    padding: $spacing-lg;
  }

  .quiz-content {
    padding: $spacing-lg;

    .question-header h3 {
      font-size: 1.2rem;
    }

    .options-container {
      .option-item {
        padding: $spacing-sm;

        .option-text {
          font-size: 1rem;
        }
      }
    }
  }
}
</style>