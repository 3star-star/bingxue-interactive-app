export const quizQuestions = [
  {
    id: 'basic-snow-1',
    category: '基础',
    title: '雪花的形成',
    description: '了解雪花是如何在云层中形成的',
    question: '雪花的基本形状是什么？',
    options: [
      '正方形',
      '六边形',
      '圆形',
      '三角形'
    ],
    correctAnswer: 1,
    difficulty: 1,
    explanation: '雪花的基本形状是六边形，这是因为水分子在结冰时会形成六边形的晶体结构。',
    points: 10,
    image: '/assets/images/snowflake.png',
    keywords: ['雪花', '晶体', '水分子']
  },
  {
    id: 'skiing-1',
    category: '运动',
    title: '滑雪基础',
    description: '滑雪的基本知识和技巧',
    question: '滑雪时，正确的基本姿势是什么？',
    options: [
      '身体后仰，膝盖伸直',
      '身体前倾，膝盖弯曲',
      '身体侧向，单腿支撑',
      '身体前倾，膝盖伸直'
    ],
    correctAnswer: 1,
    difficulty: 1,
    explanation: '滑雪时身体应该前倾，膝盖弯曲，这样可以更好地控制雪板和保持平衡。',
    points: 10,
    image: '/assets/images/skiing-stance.png',
    keywords: ['滑雪', '姿势', '平衡']
  },
  {
    id: 'safety-1',
    category: '安全',
    title: '冰雪安全知识',
    description: '冰雪活动中的安全注意事项',
    question: '在结冰的路面上行走时，正确的姿势是？',
    options: [
      '正常行走，脚步迈大一些',
      '小步慢行，身体微蹲',
      '跳跃前进',
      '快速跑过'
    ],
    correctAnswer: 1,
    difficulty: 2,
    explanation: '在结冰路面上应该小步慢行，身体微蹲，降低重心，防止滑倒。',
    points: 15,
    image: '/assets/images/walking-on-ice.jpg',
    keywords: ['安全', '结冰路面', '防滑']
  },
  {
    id: 'weather-1',
    category: '气象',
    title: '冰雪天气',
    description: '了解冰雪天气的形成和影响',
    question: '形成降雪的主要条件是什么？',
    options: [
      '高温高湿',
      '低温高湿',
      '高温低湿',
      '低温低湿'
    ],
    correctAnswer: 1,
    difficulty: 2,
    explanation: '降雪需要低温（0℃以下）和高湿度（空气中有足够的水汽）的条件。',
    points: 15,
    image: '/assets/images/snow-weather.jpg',
    keywords: ['降雪', '温度', '湿度']
  },
  {
    id: 'equipment-1',
    category: '装备',
    title: '滑雪装备',
    description: '滑雪装备的选择和使用',
    question: '滑雪头盔的主要作用是？',
    options: [
      '保暖',
      '美观',
      '保护头部安全',
      '提高视野'
    ],
    correctAnswer: 2,
    difficulty: 1,
    explanation: '滑雪头盔的主要作用是保护头部免受碰撞伤害，确保滑雪安全。',
    points: 10,
    image: '/assets/images/ski-helmet.jpg',
    keywords: ['头盔', '安全', '保护']
  },
  {
    id: 'history-1',
    category: '历史',
    title: '冰雪运动起源',
    description: '了解冰雪运动的悠久历史',
    question: '现代滑雪运动的发源地是？',
    options: [
      '中国',
      '日本',
      '挪威',
      '加拿大'
    ],
    correctAnswer: 2,
    difficulty: 3,
    explanation: '现代滑雪运动起源于北欧的挪威，当地的岩画和文物证明了滑雪有着数千年的历史。',
    points: 20,
    image: '/assets/images/ski-history.jpg',
    keywords: ['滑雪', '历史', '起源']
  },
  {
    id: 'science-1',
    category: '科学',
    title: '冰的物理特性',
    description: '了解冰的物理特性',
    question: '冰的密度比水如何？',
    options: [
      '比水大',
      '比水小',
      '和水一样大',
      '不确定'
    ],
    correctAnswer: 1,
    difficulty: 2,
    explanation: '冰的密度比水小，所以冰会浮在水面上。这就是为什么冰山会浮在海洋中的原因。',
    points: 15,
    image: '/assets/images/ice-density.jpg',
    keywords: ['冰', '密度', '物理特性']
  },
  {
    id: 'olympic-1',
    category: '奥运',
    title: '冬奥会项目',
    description: '了解冬奥会比赛项目',
    question: '冬奥会中，雪车和雪橇的主要区别是什么？',
    options: [
      '没有区别',
      '雪车有方向盘，雪橇没有',
      '雪橇有方向盘，雪车没有',
      '重量不同'
    ],
    correctAnswer: 1,
    difficulty: 2,
    explanation: '雪车和雪橇的主要区别是雪车有方向盘和刹车，而雪橇没有，完全靠身体控制。',
    points: 15,
    image: '/assets/images/bobsled-lympics.jpg',
    keywords: ['冬奥会', '雪车', '雪橇']
  },
  {
    id: 'nature-1',
    category: '自然',
    title: '冰雪生态',
    description: '了解冰雪生态系统的特点',
    question: '在极地环境中，动物如何适应寒冷？',
    options: [
      '迁徙到温暖地区',
      '厚厚的皮毛和脂肪层',
      '冬眠',
      '改变食性'
    ],
    correctAnswer: 1,
    difficulty: 2,
    explanation: '极地动物通过厚厚的皮毛和脂肪层来保暖，有些动物会迁徙，有些会冬眠。',
    points: 15,
    image: '/assets/images/polar-bear.jpg',
    keywords: ['极地', '动物', '适应']
  },
  {
    id: 'technique-1',
    category: '技巧',
    title: '滑冰技巧',
    description: '学习滑冰的基本技巧',
    question: '初学滑冰时，正确的摔倒姿势是？',
    options: [
      '直接向前倒',
      '直接向后倒',
      '向侧向倒，用手保护头部',
      '原地蹲下'
    ],
    correctAnswer: 2,
    difficulty: 1,
    explanation: '滑冰时应该向侧向倒，用手和臂部缓冲，保护头部和关节免受伤害。',
    points: 10,
    image: '/assets/images/ice-fall.jpg',
    keywords: ['滑冰', '摔倒', '安全']
  },
  {
    id: 'culture-1',
    category: '文化',
    title: '冰雪文化',
    description: '世界各地的冰雪文化',
    question: '日本的雪祭是在哪个城市举办的？',
    options: [
      '东京',
      '大阪',
      '札幌',
      '北海道'
    ],
    correctAnswer: 2,
    difficulty: 2,
    explanation: '日本札幌雪节是世界著名的冰雪节，每年都会吸引数百万游客参观。',
    points: 15,
    image: '/assets/images/snow-festival.jpg',
    keywords: ['日本', '雪节', '文化']
  },
  {
    id: 'equipment-2',
    category: '装备',
    title: '冰球装备',
    description: '了解冰球运动装备',
    question: '冰球比赛中，守门员的特殊装备是什么？',
    options: [
      '更大的护腿',
      '特殊的面具',
      '更宽的球杆',
      '以上都是'
    ],
    correctAnswer: 3,
    difficulty: 1,
    explanation: '守门员拥有特殊的装备，包括更大的护腿、特殊的面具和更宽的球杆，以保护身体和阻挡球。',
    points: 10,
    image: '/assets/images/hockey-gear.jpg',
    keywords: ['冰球', '守门员', '装备']
  },
  {
    id: 'medical-1',
    category: '医学',
    title: '冻伤防护',
    description: '了解冻伤的防护和治疗',
    question: '轻微冻伤的初期症状是什么？',
    options: [
      '皮肤发红发热',
      '皮肤发白发冷',
      '皮肤出现水泡',
      '皮肤失去感觉'
    ],
    correctAnswer: 1,
    difficulty: 2,
    explanation: '轻微冻伤的初期症状是皮肤发红、发热、刺痛，这是血液循环受到影响的信号。',
    points: 15,
    image: '/assets/images/frostbite.jpg',
    keywords: ['冻伤', '防护', '症状']
  },
  {
    id: 'competition-1',
    category: '比赛',
    title: '花样滑冰',
    description: '了解花样滑冰的技术要求',
    question: '花样滑冰中的"阿克塞尔跳"是什么？',
    options: [
      '向前跳跃',
      '向后跳跃',
      '单周跳',
      '空中转体半周的前跳'
    ],
    correctAnswer: 3,
    difficulty: 3,
    explanation: '阿克塞尔跳是花样滑冰中最难的跳跃之一，它在空中转体半周后向前跳跃。',
    points: 20,
    image: '/assets/images/figure-skating.jpg',
    keywords: ['花样滑冰', '跳跃', '技术']
  },
  {
    id: 'geography-1',
    category: '地理',
    title: '冰雪地区',
    description: '了解世界主要冰雪地区',
    question: '世界上最大的冰原位于哪里？',
    options: [
      '南极洲',
      '格陵兰',
      '西伯利亚',
      '加拿大'
    ],
    correctAnswer: 0,
    difficulty: 2,
    explanation: '南极洲拥有世界上最大的冰原，冰层厚度平均达2.3公里。',
    points: 15,
    image: '/assets/images/antarctica.jpg',
    keywords: ['南极洲', '冰原', '地理']
  },
  {
    id: 'art-1',
    category: '艺术',
    title: '冰雪艺术',
    description: '冰雪艺术的表现形式',
    question: '冰雕艺术的起源可以追溯到哪个国家？',
    options: [
      '中国',
      '俄罗斯',
      '瑞典',
      '芬兰'
    ],
    correctAnswer: 0,
    difficulty: 2,
    explanation: '冰雕艺术起源于中国古代，最早的记载可以追溯到唐朝。',
    points: 15,
    image: '/assets/images/ice-sculpture.jpg',
    keywords: ['冰雕', '艺术', '中国']
  },
  {
    id: 'environment-1',
    category: '环保',
    title: '冰雪与环保',
    description: '冰雪活动与环境保护',
    question: '在雪山旅游时，应该如何处理垃圾？',
    options: [
      '随手丢弃',
      '带走所有垃圾',
      '掩埋在雪中',
      '扔在指定地点'
    ],
    correctAnswer: 1,
    difficulty: 1,
    explanation: '在雪山旅游时应该带走所有垃圾，保护脆弱的生态环境，避免污染水源。',
    points: 10,
    image: '/assets/images/mountain-cleanup.jpg',
    keywords: ['环保', '雪山', '垃圾']
  },
  {
    id: 'physics-1',
    category: '物理',
    title: '摩擦力原理',
    description: '了解冰雪中的摩擦力',
    question: '为什么在冰上容易滑倒？',
    options: [
      '冰面太光滑',
      '摩擦力太小',
      '重心不稳',
      '以上都是'
    ],
    correctAnswer: 3,
    difficulty: 2,
    explanation: '在冰上容易滑倒是因为冰面光滑、摩擦力小、而且行走时容易重心不稳。',
    points: 15,
    image: '/assets/images/ice-friction.jpg',
    keywords: ['摩擦力', '冰面', '物理']
  },
  {
    id: 'mythology-1',
    category: '神话',
    title: '冰雪神话',
    description: '世界各地的冰雪神话',
    question: '北欧神话中的冰雪之神是谁？',
    options: [
      '奥丁',
      '托尔',
      '乌尔',
      '弗雷'
    ],
    correctAnswer: 2,
    difficulty: 2,
    explanation: '乌尔（Ullr）是北欧神话中的冰雪之神和狩猎之神，被认为是滑雪的保护神。',
    points: 20,
    image: '/assets/images/norse-god.jpg',
    keywords: ['北欧神话', '冰雪神', '乌尔']
  },
  {
    id: 'technology-1',
    category: '科技',
    title: '造雪技术',
    description: '现代造雪技术的发展',
    question: '人工造雪需要什么条件？',
    options: [
      '高温高湿',
      '低温高湿',
      '常温环境',
      '没有特殊要求'
    ],
    correctAnswer: 1,
    difficulty: 2,
    explanation: '人工造雪需要在低温（0℃以下）和高湿度的环境下进行，这样才能形成雪花。',
    points: 15,
    image: '/assets/images/snow-making.jpg',
    keywords: ['人工造雪', '技术', '条件']
  },
  {
    id: 'health-1',
    category: '健康',
    title: '冰雪运动益处',
    description: '冰雪运动对健康的益处',
    question: '滑雪运动对健康的主要益处是什么？',
    options: [
      '增强心肺功能',
      '提高平衡能力',
      '锻炼全身肌肉',
      '以上都是'
    ],
    correctAnswer: 3,
    difficulty: 1,
    explanation: '滑雪是一项全身运动，可以增强心肺功能、提高平衡能力、锻炼全身肌肉。',
    points: 10,
    image: '/assets/images/skiing-health.jpg',
    keywords: ['滑雪', '健康', '运动']
  }
]

// 按分类和难度筛选题目
export const getQuestionsByCategory = (category, difficulty = null) => {
  return quizQuestions.filter(q => {
    const match = q.category === category
    if (difficulty !== null) {
      return match && q.difficulty === difficulty
    }
    return match
  })
}

export const getQuestionsByDifficulty = (difficulty) => {
  return quizQuestions.filter(q => q.difficulty === difficulty)
}

export const getRandomQuestions = (count, category = null, difficulty = null) => {
  let pool = quizQuestions
  if (category) {
    pool = getQuestionsByCategory(category, difficulty)
  } else if (difficulty !== null) {
    pool = getQuestionsByDifficulty(difficulty)
  }

  // 打乱顺序
  const shuffled = [...pool].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

export const getQuestionById = (id) => {
  return quizQuestions.find(q => q.id === id)
}

// 成就系统相关的题目集
export const achievementQuestionSets = {
  // 初学者成就
  beginner: {
    title: '冰雪初学者',
    description: '完成5道基础题目',
    questions: getRandomQuestions(5, '基础'),
    pointsRequired: 50
  },
  // 运动爱好者成就
  sports: {
    title: '冰雪运动达人',
    description: '完成10道运动题目',
    questions: getRandomQuestions(10, '运动'),
    pointsRequired: 150
  },
  // 安全专家成就
  safety: {
    title: '安全专家',
    description: '完成所有安全题目',
    questions: getQuestionsByCategory('安全'),
    pointsRequired: 200
  },
  // 知识大师成就
  master: {
    title: '冰雪知识大师',
    description: '完成20道不同类别的题目',
    questions: getRandomQuestions(20, null),
    pointsRequired: 300
  }
}