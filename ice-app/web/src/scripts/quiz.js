// 知识竞赛逻辑
let currentQuestions = [];
let currentQuestionIndex = 0;
let userAnswers = [];
let correctCount = 0;
let totalScore = 0;

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', function() {
  initQuiz();
  setupEventListeners();
});

// 初始化竞赛
function initQuiz() {
  // 获取10道随机题目
  currentQuestions = getRandomQuestions(10);
  currentQuestionIndex = 0;
  userAnswers = new Array(currentQuestions.length).fill(null);
  correctCount = 0;
  totalScore = 0;

  // 显示答题界面
  showQuizSection();
  renderQuestion();
}

// 设置事件监听
function setupEventListeners() {
  // 上一题按钮
  const prevBtn = document.getElementById('prevBtn');
  if (prevBtn) {
    prevBtn.addEventListener('click', goToPrevQuestion);
  }

  // 下一题按钮
  const nextBtn = document.getElementById('nextBtn');
  if (nextBtn) {
    nextBtn.addEventListener('click', goToNextQuestion);
  }

  // 提交答案按钮
  const submitBtn = document.getElementById('submitBtn');
  if (submitBtn) {
    submitBtn.addEventListener('click', submitQuiz);
  }

  // 重新答题按钮
  const retryBtn = document.getElementById('retryBtn');
  if (retryBtn) {
    retryBtn.addEventListener('click', initQuiz);
  }

  // 返回知识中心按钮
  const backBtn = document.getElementById('backBtn');
  if (backBtn) {
    backBtn.addEventListener('click', function() {
      window.location.href = 'knowledge.html';
    });
  }
}

// 显示答题界面
function showQuizSection() {
  document.getElementById('quizSection').style.display = 'block';
  document.getElementById('resultSection').style.display = 'none';
}

// 显示结果界面
function showResultSection() {
  document.getElementById('quizSection').style.display = 'none';
  document.getElementById('resultSection').style.display = 'block';
}

// 渲染当前题目
function renderQuestion() {
  const question = currentQuestions[currentQuestionIndex];

  // 更新进度
  document.getElementById('currentQuestion').textContent = currentQuestionIndex + 1;
  document.getElementById('totalQuestions').textContent = currentQuestions.length;

  // 更新题目信息
  document.getElementById('questionCategory').textContent = question.category;
  document.getElementById('questionTitle').textContent = question.question;
  document.getElementById('questionDescription').textContent = question.description;

  // 渲染选项
  const optionsContainer = document.getElementById('optionsContainer');
  optionsContainer.innerHTML = '';

  question.options.forEach((option, index) => {
    const optionDiv = document.createElement('div');
    optionDiv.className = 'option';
    optionDiv.textContent = option;

    // 如果已经选择过，显示选中状态
    if (userAnswers[currentQuestionIndex] === index) {
      optionDiv.classList.add('selected');
    }

    // 点击选项
    optionDiv.addEventListener('click', function() {
      selectOption(index);
    });

    optionsContainer.appendChild(optionDiv);
  });

  // 更新按钮状态
  updateButtonStates();
}

// 选择选项
function selectOption(optionIndex) {
  userAnswers[currentQuestionIndex] = optionIndex;

  // 更新UI
  const options = document.querySelectorAll('.option');
  options.forEach((option, index) => {
    if (index === optionIndex) {
      option.classList.add('selected');
    } else {
      option.classList.remove('selected');
    }
  });

  updateButtonStates();
}

// 上一题
function goToPrevQuestion() {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    renderQuestion();
  }
}

// 下一题
function goToNextQuestion() {
  if (currentQuestionIndex < currentQuestions.length - 1) {
    currentQuestionIndex++;
    renderQuestion();
  }
}

// 更新按钮状态
function updateButtonStates() {
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const submitBtn = document.getElementById('submitBtn');

  // 上一题按钮
  prevBtn.disabled = currentQuestionIndex === 0;

  // 下一题和提交按钮
  const isLastQuestion = currentQuestionIndex === currentQuestions.length - 1;
  nextBtn.style.display = isLastQuestion ? 'none' : 'inline-block';
  submitBtn.style.display = isLastQuestion ? 'inline-block' : 'none';

  // 检查是否所有题目都已回答
  const allAnswered = userAnswers.every(answer => answer !== null);
  submitBtn.disabled = !allAnswered;
}

// 提交答案
function submitQuiz() {
  // 计算得分
  correctCount = 0;
  totalScore = 0;

  currentQuestions.forEach((question, index) => {
    if (userAnswers[index] === question.correctAnswer) {
      correctCount++;
      totalScore += question.points;
    }
  });

  // 显示结果
  displayResults();
  showResultSection();
}

// 显示结果
function displayResults() {
  const totalQuestions = currentQuestions.length;
  const wrongCount = totalQuestions - correctCount;
  const accuracyRate = Math.round((correctCount / totalQuestions) * 100);

  document.getElementById('totalQuestionsResult').textContent = totalQuestions;
  document.getElementById('correctCount').textContent = correctCount;
  document.getElementById('wrongCount').textContent = wrongCount;
  document.getElementById('accuracyRate').textContent = accuracyRate + '%';
  document.getElementById('totalScore').textContent = totalScore;

  // 根据正确率显示不同的评价
  const resultMessage = document.getElementById('resultMessage');
  if (accuracyRate >= 90) {
    resultMessage.textContent = '太棒了！你对冰雪知识掌握得非常好！';
    resultMessage.style.color = '#4CAF50';
  } else if (accuracyRate >= 70) {
    resultMessage.textContent = '不错！继续加油，你会更棒的！';
    resultMessage.style.color = '#2196F3';
  } else if (accuracyRate >= 60) {
    resultMessage.textContent = '还不错，但还有提升空间哦！';
    resultMessage.style.color = '#FF9800';
  } else {
    resultMessage.textContent = '加油！多学习冰雪知识会更好！';
    resultMessage.style.color = '#F44336';
  }
}
