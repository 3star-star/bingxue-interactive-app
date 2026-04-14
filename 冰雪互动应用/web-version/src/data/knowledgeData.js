// 冰雪知识库数据
export const knowledgeData = [
  {
    id: 1,
    title: "雪花形成的奥秘",
    category: "基础知识",
    description: "了解雪花是如何从冰晶形成的",
    content: "雪花是由水蒸气在低温下直接凝华形成的冰晶。温度越低，雪花的形状越复杂...",
    type: "interactive",
    difficulty: 1,
    interactions: [
      {
        type: "explore",
        question: "点击查看雪花形成过程",
        answer: "雪花在空中飘落时会经历复杂的结晶过程"
      },
      {
        type: "match",
        items: ["水蒸气", "凝华", "冰晶", "结晶"]
      },
      {
        type: "quiz",
        question: "雪花是什么形态的水？",
        options: ["液态", "固态", "气态", "等离子态"],
        correct: 1
      }
    ]
  },
  {
    id: 2,
    title: "冰的结构与特性",
    category: "物理特性",
    description: "探索冰的晶体结构和独特性质",
    content: "冰是由水分子排列成六方晶格结构形成的固体...",
    type: "interactive",
    difficulty: 2,
    interactions: [
      {
        type: "explore",
        question: "查看冰的晶体结构",
        answer: "冰的分子排列呈现六方晶格状"
      },
      {
        type: "match",
        items: ["六方晶格", "氢键", "分子排列", "晶体结构"]
      },
      {
        type: "quiz",
        question: "冰的密度比水大还是小？",
        options: ["更大", "更小", "相同", "不确定"],
        correct: 1
      }
    ]
  },
  {
    id: 3,
    title: "雪崩的形成原因",
    category: "安全知识",
    description: "了解雪崩发生的条件和预防措施",
    content: "雪崩是指大量积雪从山坡上滑落的现象...",
    type: "scenario",
    difficulty: 2,
    interactions: [
      {
        type: "explore",
        question: "查看雪崩形成过程",
        answer: "积雪在重力作用下失去平衡，沿着山坡滑落"
      },
      {
        type: "quiz",
        question: "什么情况下容易发生雪崩？",
        options: ["大雪后24小时", "温度骤升", "持续降雪", "以上都是"],
        correct: 3
      }
    ]
  },
  {
    id: 4,
    title: "常见冰雪运动",
    category: "运动介绍",
    description: "探索各种精彩的冰雪运动项目",
    content: "冰雪运动是人类在寒冷地区发展起来的各种体育活动...",
    type: "media",
    difficulty: 1,
    interactions: [
      {
        type: "explore",
        question: "查看冰雪运动介绍",
        answer: "冰雪运动包括滑雪、滑冰、冰球等多种项目"
      }
    ]
  },
  {
    id: 5,
    title: "冰川的演变",
    category: "自然现象",
    description: "了解冰川的形成和其对地球的影响",
    content: "冰川是长期积累的冰雪经过重压形成的巨大冰体...",
    type: "interactive",
    difficulty: 3,
    interactions: [
      {
        type: "explore",
        question: "查看冰川形成过程",
        answer: "冰川需要积累数百年的雪才能形成"
      },
      {
        type: "match",
        items: ["积雪", "压实", "重结晶", "冰川冰"]
      },
      {
        type: "quiz",
        question: "冰川对气候的影响是什么？",
        options: ["降低温度", "提高湿度", "反射阳光", "以上都是"],
        correct: 3
      }
    ]
  }
]

// 知识分类
export const knowledgeCategories = [
  { id: "basic", name: "基础知识", color: "#3B82F6" },
  { id: "physics", name: "物理特性", color: "#10B981" },
  { id: "safety", name: "安全知识", color: "#EF4444" },
  { id: "sports", name: "运动介绍", color: "#F59E0B" },
  { id: "nature", name: "自然现象", color: "#8B5CF6" }
]