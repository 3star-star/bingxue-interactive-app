// 冰雪景点数据 - 吉林地区
export const scenesData = [
  {
    id: 1,
    name: "长白山天池",
    location: "吉林省延边州",
    description: "中国最美的火山湖，冬季冰封雪裹，宛如仙境",
    image: "/assets/images/scenes/changbai.jpg",
    panoramaImages: [
      { url: "/assets/images/changbai-tianchi/tianchi-1.jpg", title: "" },
      { url: "/assets/images/changbai-tianchi/tianchi-2.jpg", title: "" },
      { url: "/assets/images/changbai-tianchi/tianchi-3.jpg", title: "" },
      { url: "/assets/images/changbai-tianchi/tianchi-4.jpg", title: "" },
      { url: "/assets/images/changbai-tianchi/tianchi-5.jpg", title: "" }
    ],
    hotspots: [
      {
        id: "h1",
        title: "天池主峰",
        description: "海拔2691米，可俯瞰整个天池全景",
        position: { x: 30, y: 40 }
      },
      {
        id: "h2",
        title: "长白瀑布",
        description: "落差68米的壮观瀑布，冬季形成冰瀑",
        position: { x: 60, y: 70 }
      },
      {
        id: "h3",
        title: "温泉群",
        description: "天然温泉，冬季雪中泡温泉别有风味",
        position: { x: 20, y: 60 }
      }
    ],
    ambientSound: "mountain"
  },
  {
    id: 2,
    name: "雾凇岛",
    location: "吉林省吉林市",
    description: "中国四大自然奇观之一，冬季雾凇景观美不胜收",
    image: "/assets/images/scenes/wusong.jpg",
    panoramaImages: [
      { url: "/assets/images/wusong-island/wusong-1.jpg", title: "" },
      { url: "/assets/images/wusong-island/wusong-2.jpg", title: "" },
      { url: "/assets/images/wusong-island/wusong-3.jpg", title: "" },
      { url: "/assets/images/wusong-island/wusong-4.jpg", title: "" },
      { url: "/assets/images/wusong-island/wusong-5.jpg", title: "" }
    ],
    hotspots: [
      {
        id: "h1",
        title: "松花江畔",
        description: "江边树木挂满雾凇，如梦似幻",
        position: { x: 45, y: 50 }
      },
      {
        id: "h2",
        title: "雾凇长廊",
        description: "绵延数公里的雾凇景观带",
        position: { x: 70, y: 30 }
      },
      {
        id: "h3",
        title: "观景台",
        description: "最佳摄影点，可拍摄日出雾凇",
        position: { x: 50, y: 65 }
      }
    ],
    ambientSound: "snow"
  },
  {
    id: 3,
    name: "净月潭国家森林公园",
    location: "吉林省长春市",
    description: "亚洲最大的人工林海，冬季白雪覆盖，银装素裹",
    image: "/assets/images/scenes/jingyuetan.jpg",
    panoramaImages: [
      { url: "/assets/images/jingyuetan/jingyuetan-1.jpg", title: "" },
      { url: "/assets/images/jingyuetan/jingyuetan-2.jpg", title: "" },
      { url: "/assets/images/jingyuetan/jingyuetan-3.jpg", title: "" },
      { url: "/assets/images/jingyuetan/jingyuetan-4.jpg", title: "" },
      { url: "/assets/images/jingyuetan/jingyuetan-5.jpg", title: "" }
    ],
    hotspots: [
      {
        id: "h1",
        title: "净月潭湖面",
        description: "冬季湖面结冰，可进行冰上活动",
        position: { x: 40, y: 60 }
      },
      {
        id: "h2",
        title: "滑雪场",
        description: "专业滑雪场地，适合各级别滑雪爱好者",
        position: { x: 80, y: 40 }
      },
      {
        id: "h3",
        title: "森林步道",
        description: "雪中漫步，感受林海雪原的魅力",
        position: { x: 25, y: 45 }
      }
    ],
    ambientSound: "wind"
  },
  {
    id: 4,
    name: "北大湖滑雪场",
    location: "吉林省吉林市",
    description: "中国著名滑雪胜地，曾举办多项国际赛事",
    image: "/assets/images/scenes/beidahu.jpg",
    panoramaImages: [
      { url: "/assets/images/beidahu/beidahu-1.jpg", title: "" },
      { url: "/assets/images/beidahu/beidahu-2.jpg", title: "" },
      { url: "/assets/images/beidahu/beidahu-3.jpg", title: "" },
      { url: "/assets/images/beidahu/beidahu-4.jpg", title: "" },
      { url: "/assets/images/beidahu/beidahu-5.jpg", title: "" }
    ],
    hotspots: [
      {
        id: "h1",
        title: "高级雪道",
        description: "专业级滑雪道，挑战性强",
        position: { x: 50, y: 20 }
      },
      {
        id: "h2",
        title: "初级练习区",
        description: "适合初学者的缓坡雪道",
        position: { x: 30, y: 70 }
      },
      {
        id: "h3",
        title: "山顶观景台",
        description: "可俯瞰整个雪场和远山美景",
        position: { x: 65, y: 35 }
      }
    ],
    ambientSound: "wind"
  },
  {
    id: 5,
    name: "查干湖冬捕",
    location: "吉林省松原市",
    description: "千年传承的冬捕文化，体验冰雪渔猎的独特魅力",
    image: "/assets/images/scenes/chagan.jpg",
    panoramaImages: [
      { url: "/assets/images/chagan/chagan-1.jpg", title: "" },
      { url: "/assets/images/chagan/chagan-2.jpg", title: "" },
      { url: "/assets/images/chagan/chagan-3.jpg", title: "" },
      { url: "/assets/images/chagan/chagan-4.jpg", title: "" },
      { url: "/assets/images/chagan/chagan-5.jpg", title: "" }
    ],
    hotspots: [
      {
        id: "h1",
        title: "冬捕现场",
        description: "观看传统冬捕仪式和捕鱼过程",
        position: { x: 60, y: 30 }
      },
      {
        id: "h2",
        title: "冰上娱乐区",
        description: "冰车、冰滑梯等冰上娱乐项目",
        position: { x: 40, y: 50 }
      },
      {
        id: "h3",
        title: "渔猎文化展",
        description: "了解查干湖的历史和渔猎文化",
        position: { x: 75, y: 60 }
      }
    ],
    ambientSound: "ice"
  },
  {
    id: 6,
    name: "万科松花湖度假区",
    location: "吉林省吉林市",
    description: "国际级滑雪度假区，设施完善，景色优美",
    image: "/assets/images/scenes/songhuahu.jpg",
    panoramaImages: [
      { url: "/assets/images/songhuahu/songhuahu-1.jpg", title: "" },
      { url: "/assets/images/songhuahu/songhuahu-2.jpg", title: "" },
      { url: "/assets/images/songhuahu/songhuahu-3.jpg", title: "" },
      { url: "/assets/images/songhuahu/songhuahu-4.jpg", title: "" },
      { url: "/assets/images/songhuahu/songhuahu-5.jpg", title: "" }
    ],
    hotspots: [
      {
        id: "h1",
        title: "滑雪度假村",
        description: "高端滑雪度假设施，一站式服务",
        position: { x: 45, y: 55 }
      },
      {
        id: "h2",
        title: "山地雪道",
        description: "多条不同难度的专业雪道",
        position: { x: 70, y: 25 }
      },
      {
        id: "h3",
        title: "温泉中心",
        description: "滑雪后放松身心的理想场所",
        position: { x: 30, y: 75 }
      }
    ],
    ambientSound: "snow"
  }
]

// 音效列表
export const ambientSounds = {
  wind: {
    name: "风声",
    url: "/assets/sounds/wind.mp3"
  },
  snow: {
    name: "雪落",
    url: "/assets/sounds/snow.mp3"
  },
  ice: {
    name: "冰裂",
    url: "/assets/sounds/ice.mp3"
  },
  mountain: {
    name: "山谷回音",
    url: "/assets/sounds/mountain.mp3"
  },
  aurora: {
    name: "极光声音",
    url: "/assets/sounds/aurora.mp3"
  }
}