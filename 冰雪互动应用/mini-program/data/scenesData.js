// 冰雪景点数据
const scenesData = [
  {
    id: 1,
    name: "阿尔卑斯雪山",
    location: "欧洲中南部",
    description: "欧洲最高的山脉，拥有壮丽的雪山风光",
    image: "/assets/images/scenes/alps.jpg",
    hotspots: [
      {
        id: "h1",
        title: "少女峰",
        description: "阿尔卑斯山的标志性山峰，海拔4158米"
      },
      {
        id: "h2",
        title: "冰川湖",
        description: "由冰川融水形成的美丽湖泊，湖水碧蓝清澈"
      },
      {
        id: "h3",
        title: "滑雪场",
        description: "世界著名的滑雪胜地，拥有多条专业雪道"
      }
    ],
    ambientSound: "wind"
  },
  {
    id: 2,
    name: "北海道雪国",
    location: "日本北海道",
    description: "日本最北端，冬季雪景如画",
    image: "/assets/images/scenes/hokkaido.jpg",
    hotspots: [
      {
        id: "h1",
        title: "小樽运河",
        description: "冬日运河两岸的雪松夜景，浪漫唯美"
      },
      {
        id: "h2",
        title: "富良野雪原",
        description: "广阔的雪原和梦幻的雾凇，宛如童话世界"
      }
    ],
    ambientSound: "snow"
  },
  {
    id: 3,
    name: "南极大陆",
    location: "地球最南端",
    description: "冰雪覆盖的神秘大陆",
    image: "/assets/images/scenes/antarctica.jpg",
    hotspots: [
      {
        id: "h1",
        title: "企鹅栖息地",
        description: "成群的帝企鹅在冰面上行走，憨态可掬"
      },
      {
        id: "h2",
        title: "冰山群",
        description: "巨大的冰山漂浮在海面上，蔚为壮观"
      }
    ],
    ambientSound: "ice"
  },
  {
    id: 4,
    name: "喜马拉雅山脉",
    location: "亚洲中部",
    description: "世界屋脊，雪山连绵",
    image: "/assets/images/scenes/himalayas.jpg",
    hotspots: [
      {
        id: "h1",
        title: "珠穆朗玛峰",
        description: "世界最高峰，海拔8848.86米"
      },
      {
        id: "h2",
        title: "冰塔林",
        description: "独特的冰雕奇观，晶莹剔透"
      }
    ],
    ambientSound: "mountain"
  },
  {
    id: 5,
    name: "北极冰原",
    location: "地球最北端",
    description: "北极熊的家园",
    image: "/assets/images/scenes/arctic.jpg",
    hotspots: [
      {
        id: "h1",
        title: "极光",
        description: "绚丽的北极光舞动，色彩斑斓"
      },
      {
        id: "h2",
        title: "北极熊",
        description: "北极霸主在冰面上漫游，威风凛凛"
      }
    ],
    ambientSound: "aurora"
  }
]

// 音效列表
const ambientSounds = {
  wind: {
    name: "风声"
  },
  snow: {
    name: "雪落"
  },
  ice: {
    name: "冰裂"
  },
  mountain: {
    name: "山谷回音"
  },
  aurora: {
    name: "极光声音"
  }
}

module.exports = {
  scenesData,
  ambientSounds
}