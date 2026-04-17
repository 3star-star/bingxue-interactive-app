// 题库数据（从 Vue 版本转换而来）
const quizQuestions = [
  {
    id: 'basic-snow-1',
    category: '基础',
    title: '雪花的形成',
    description: '了解雪花是如何在云层中形成的',
    question: '雪花的基本形状是什么？',
    options: ['正方形', '六边形', '圆形', '三角形'],
    correctAnswer: 1,
    difficulty: 1,
    explanation: '雪花的基本形状是六边形，这是因为水分子在结冰时会形成六边形的晶体结构。',
    points: 10
  },
  {
    id: 'skiing-1',
    category: '运动',
    title: '滑雪基础',
    description: '滑雪的基本知识和技巧',
    question: '滑雪时，正确的基本姿势是什么？',
    options: ['身体后仰，膝盖伸直', '身体前倾，膝盖弯曲', '身体侧向，单腿支撑', '身体前倾，膝盖伸直'],
    correctAnswer: 1,
    difficulty: 1,
    explanation: '滑雪时身体应该前倾，膝盖弯曲，这样可以更好地控制雪板和保持平衡。',
    points: 10
  },
  {
    id: 'safety-1',
    category: '安全',
    title: '冰雪安全知识',
    description: '冰雪活动中的安全注意事项',
    question: '在结冰的路面上行走时，正确的姿势是？',
    options: ['正常行走，脚步迈大一些', '小步慢行，身体微蹲', '跳跃前进', '快速跑过'],
    correctAnswer: 1,
    difficulty: 2,
    explanation: '在结冰路面上应该小步慢行，身体微蹲，降低重心，防止滑倒。',
    points: 15
  },
  {
    id: 'weather-1',
    category: '气象',
    title: '冰雪天气',
    description: '了解冰雪天气的形成和影响',
    question: '形成降雪的主要条件是什么？',
    options: ['高温高湿', '低温高湿', '高温低湿', '低温低湿'],
    correctAnswer: 1,
    difficulty: 2,
    explanation: '降雪需要低温（0℃以下）和高湿度（空气中有足够的水汽）的条件。',
    points: 15
  },
  {
    id: 'equipment-1',
    category: '装备',
    title: '滑雪装备',
    description: '滑雪装备的选择和使用',
    question: '滑雪头盔的主要作用是？',
    options: ['保暖', '美观', '保护头部安全', '提高视野'],
    correctAnswer: 2,
    difficulty: 1,
    explanation: '滑雪头盔的主要作用是保护头部免受碰撞伤害，确保滑雪安全。',
    points: 10
  },
  {
    id: 'history-1',
    category: '历史',
    title: '冰雪运动起源',
    description: '了解冰雪运动的悠久历史',
    question: '现代滑雪运动的发源地是？',
    options: ['中国', '日本', '挪威', '加拿大'],
    correctAnswer: 2,
    difficulty: 3,
    explanation: '现代滑雪运动起源于北欧的挪威，当地的岩画和文物证明了滑雪有着数千年的历史。',
    points: 20
  },
  {
    id: 'science-1',
    category: '科学',
    title: '冰的物理特性',
    description: '了解冰的物理特性',
    question: '冰的密度比水如何？',
    options: ['比水大', '比水小', '和水一样大', '不确定'],
    correctAnswer: 1,
    difficulty: 2,
    explanation: '冰的密度比水小，所以冰会浮在水面上。这就是为什么冰山会浮在海洋中的原因。',
    points: 15
  },
  {
    id: 'olympic-1',
    category: '奥运',
    title: '冬奥会项目',
    description: '了解冬奥会比赛项目',
    question: '冬奥会中，雪车和雪橇的主要区别是什么？',
    options: ['没有区别', '雪车有方向盘，雪橇没有', '雪橇有方向盘，雪车没有', '重量不同'],
    correctAnswer: 1,
    difficulty: 2,
    explanation: '雪车和雪橇的主要区别是雪车有方向盘和刹车，而雪橇没有，完全靠身体控制。',
    points: 15
  },
  {
    id: 'nature-1',
    category: '自然',
    title: '冰雪生态',
    description: '了解冰雪生态系统的特点',
    question: '在极地环境中，动物如何适应寒冷？',
    options: ['迁徙到温暖地区', '厚厚的皮毛和脂肪层', '冬眠', '改变食性'],
    correctAnswer: 1,
    difficulty: 2,
    explanation: '极地动物通过厚厚的皮毛和脂肪层来保暖，有些动物会迁徙，有些会冬眠。',
    points: 15
  },
  {
    id: 'technique-1',
    category: '技巧',
    title: '滑冰技巧',
    description: '学习滑冰的基本技巧',
    question: '初学滑冰时，正确的摔倒姿势是？',
    options: ['直接向前倒', '直接向后倒', '向侧向倒，用手保护头部', '原地蹲下'],
    correctAnswer: 2,
    difficulty: 1,
    explanation: '滑冰时应该向侧向倒，用手和臂部缓冲，保护头部和关节免受伤害。',
    points: 10
  }
];

// 获取随机题目
function getRandomQuestions(count) {
  const shuffled = [...quizQuestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, quizQuestions.length));
}
