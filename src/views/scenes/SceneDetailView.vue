<template>
  <div class="scene-detail-view">
    <!-- 顶部导航 -->
    <div class="detail-header">
      <van-icon name="arrow-left" size="24" class="nav-btn" @click="goBack" />
      <span class="header-title">{{ scene?.name || '美景详情' }}</span>
      <van-icon name="home" size="24" class="nav-btn" @click="router.push('/')" />
    </div>

    <!-- 数据加载中 -->
    <div v-if="!scene" class="loading-state">
      <van-loading type="spinner" color="white" size="36" />
      <p>加载中...</p>
    </div>

    <!-- 场景内容 -->
    <template v-else>
      <!-- 全景查看器 -->
      <PanoramaViewer
        v-model:visible="showPanoramaViewer"
        :images="scene?.panoramaImages || []"
        :scene-name="scene?.name || ''"
        @close="handlePanoramaClose"
      />
      <!-- 场景图片 -->
      <div class="scene-banner">
        <div class="scene-img-wrap">
          <img
            :src="scene.coverImage"
            :alt="scene.name"
            class="scene-img"
            @error="handleImgError"
          >
          <div class="banner-gradient"></div>
          <div class="banner-info">
            <h1>{{ scene.name }}</h1>
            <p class="location">
              <van-icon name="location" size="14" />
              {{ scene.location }}
            </p>
          </div>
        </div>
      </div>

      <!-- 基本信息 -->
      <div class="content-body">

        <!-- 标签 -->
        <div class="tag-row">
          <span v-for="tag in scene.tags" :key="tag" class="tag">{{ tag }}</span>
          <span class="tag visited" v-if="isVisited">✓ 已访问</span>
        </div>

        <!-- 介绍 -->
        <div class="section">
          <h2 class="section-title">景点介绍</h2>
          <p class="intro-text">{{ scene.fullDescription }}</p>
        </div>

        <!-- 亮点 -->
        <div class="section">
          <h2 class="section-title">景点亮点</h2>
          <div class="highlights">
            <div v-for="hl in scene.highlights" :key="hl.title" class="highlight-item">
              <div class="hl-icon">{{ hl.icon }}</div>
              <div class="hl-content">
                <p class="hl-title">{{ hl.title }}</p>
                <p class="hl-desc">{{ hl.desc }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 打卡点 -->
        <div class="section">
          <h2 class="section-title">打卡热点（{{ scene.hotspots.length }}个）</h2>
          <div class="hotspot-list">
            <div v-for="spot in scene.hotspots" :key="spot.id" class="hotspot-card" @click="showSpotToast(spot)">
              <van-icon name="location" color="#3B82F6" size="20" />
              <div class="spot-info">
                <p class="spot-title">{{ spot.title }}</p>
                <p class="spot-desc">{{ spot.description }}</p>
              </div>
              <van-icon name="arrow" color="rgba(255,255,255,0.4)" size="16" />
            </div>
          </div>
        </div>

        <!-- 旅行小贴士 -->
        <div class="section">
          <h2 class="section-title">旅行小贴士</h2>
          <div class="tips-list">
            <div v-for="tip in scene.tips" :key="tip" class="tip-item">
              <span class="tip-dot">💡</span>
              <span>{{ tip }}</span>
            </div>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="action-area">
          <van-button type="primary" block size="large" @click="enterPanorama">
            🌐 进入全景体验
          </van-button>
          <van-button plain type="primary" block size="large" @click="goBack" style="margin-top: 12px;">
            ← 返回美景列表
          </van-button>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { scenesData } from '@/data/scenesData'
import { showToast } from 'vant'
import PanoramaViewer from '@/components/common/PanoramaViewer.vue'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const scene = ref(null)
const showPanoramaViewer = ref(false)

// 每个场景的详细信息（扩展 scenesData 中没有的字段）
const sceneDetails = {
  1: {
    coverImage: 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=800&q=80',
    fullDescription: '长白山天池位于吉林省延边朝鲜族自治州，是中国最深的湖泊，也是中朝两国的界湖。天池海拔2189.1米，是一座休眠火山口湖。冬季的长白山银装素裹，天池冰封，周围群峰环绕，景色壮美。这里不仅有壮观的自然景观，还有丰富的温泉资源和独特的生态系统。',
    tags: ['吉林', '火山湖', '温泉', '世界遗产'],
    highlights: [
      { icon: '🏔️', title: '天池奇观', desc: '中国最深的湖泊，冬季冰封景色壮美，是火山口形成的高山湖泊' },
      { icon: '💧', title: '长白瀑布', desc: '落差68米的壮观瀑布，冬季形成巨大冰瀑，晶莹剔透' },
      { icon: '♨️', title: '天然温泉', desc: '丰富的地热资源，雪中泡温泉是独特的体验' }
    ],
    tips: [
      '最佳游览时间为12月至次年2月，可观赏冰封天池',
      '山顶气温极低，需准备充足的保暖衣物',
      '建议乘坐越野车上山，普通车辆冬季难以通行',
      '注意高原反应，不要剧烈运动'
    ]
  },
  2: {
    coverImage: 'https://images.unsplash.com/photo-1548777123-e216912df7d8?w=800&q=80',
    fullDescription: '雾凇岛位于吉林省吉林市龙潭区乌拉街满族镇，是松花江上的一座小岛。每年冬季，由于松花江上游丰满水电站的影响，江水不结冰，江面上升腾的水汽遇冷凝结在岸边的树木上，形成壮观的雾凇景观。雾凇岛的雾凇是中国四大自然奇观之一，被誉为"人间仙境"。',
    tags: ['吉林', '雾凇奇观', '摄影天堂', '自然奇观'],
    highlights: [
      { icon: '❄️', title: '雾凇奇观', desc: '中国四大自然奇观之一，树木挂满晶莹剔透的雾凇' },
      { icon: '📸', title: '摄影胜地', desc: '日出时分的雾凇最为壮观，是摄影爱好者的天堂' },
      { icon: '🌊', title: '松花江畔', desc: '沿江漫步，欣赏雾凇长廊的梦幻景色' }
    ],
    tips: [
      '最佳观赏时间为12月下旬至次年2月，清晨日出时分最美',
      '需提前一天查看天气预报，晴朗无风的天气雾凇最佳',
      '岛上住宿条件有限，建议提前预订',
      '携带专业摄影设备，注意相机保暖防冻'
    ]
  },
  3: {
    coverImage: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&q=80',
    fullDescription: '净月潭国家森林公园位于吉林省长春市东南部，距市中心仅18公里，是长春市的"都市绿肺"。公园内有亚洲最大的人工林海，森林覆盖率达96%。冬季的净月潭银装素裹，湖面结冰，可以进行各种冰上活动。这里还有专业的滑雪场，是长春市民冬季休闲的好去处。',
    tags: ['吉林', '森林公园', '滑雪', '冰雪运动'],
    highlights: [
      { icon: '🌲', title: '林海雪原', desc: '亚洲最大的人工林海，冬季白雪覆盖，景色壮观' },
      { icon: '⛷️', title: '滑雪天堂', desc: '专业滑雪场设施完善，适合各级别滑雪爱好者' },
      { icon: '🎿', title: '冰上活动', desc: '湖面结冰后可进行冰车、冰滑梯等娱乐项目' }
    ],
    tips: [
      '距离长春市区近，交通便利，适合一日游',
      '滑雪场设施完善，可租赁全套滑雪装备',
      '公园内有多条徒步路线，适合雪中漫步',
      '冬季门票优惠，性价比高'
    ]
  },
  4: {
    coverImage: 'https://images.unsplash.com/photo-1551582045-6ec9c11d8697?w=800&q=80',
    fullDescription: '北大湖滑雪场位于吉林省吉林市永吉县北大湖镇，距吉林市区53公里。这里是中国著名的滑雪胜地，曾举办过多项国际滑雪赛事。雪场拥有优质的粉雪，雪期长达150天，是专业滑雪爱好者的首选。北大湖三面环山，冬季平均气温-10℃，是理想的滑雪度假胜地。',
    tags: ['吉林', '专业滑雪', '国际赛事', '粉雪天堂'],
    highlights: [
      { icon: '🏂', title: '专业雪道', desc: '拥有多条国际标准雪道，曾举办亚冬会等国际赛事' },
      { icon: '❄️', title: '优质粉雪', desc: '雪质优良，雪期长达150天，是滑雪爱好者的天堂' },
      { icon: '🏔️', title: '山地美景', desc: '三面环山，景色优美，可俯瞰群山雪景' }
    ],
    tips: [
      '适合有一定滑雪基础的爱好者，初学者建议请教练',
      '雪场设施完善，有多家星级酒店可供住宿',
      '建议提前预订雪票和住宿，旺季人流量大',
      '携带护目镜和防晒霜，高山紫外线强'
    ]
  },
  5: {
    coverImage: 'https://images.unsplash.com/photo-1484820540004-14229fe36ca4?w=800&q=80',
    fullDescription: '查干湖位于吉林省松原市前郭尔罗斯蒙古族自治县，是中国十大淡水湖之一。查干湖冬捕是一项有着千年历史的传统渔猎活动，被列入国家级非物质文化遗产。每年冬季，渔民们在冰封的湖面上进行传统的冬捕作业，场面壮观。游客可以观看冬捕仪式，品尝新鲜的查干湖鱼，体验独特的渔猎文化。',
    tags: ['吉林', '冬捕文化', '非遗', '民俗体验'],
    highlights: [
      { icon: '🎣', title: '千年冬捕', desc: '传承千年的冬捕文化，被列入国家级非物质文化遗产' },
      { icon: '🐟', title: '查干湖鱼', desc: '品尝新鲜的查干湖胖头鱼，肉质鲜美' },
      { icon: '🎭', title: '民俗体验', desc: '观看传统冬捕仪式，体验蒙古族渔猎文化' }
    ],
    tips: [
      '冬捕季节为12月下旬至次年1月，需提前了解冬捕时间',
      '观看冬捕需早起，一般清晨开始作业',
      '湖面寒冷，需穿着厚实的保暖衣物',
      '可参加冰上娱乐项目，体验冰雪乐趣'
    ]
  },
  6: {
    coverImage: 'https://images.unsplash.com/photo-1605540436563-5bca919ae766?w=800&q=80',
    fullDescription: '万科松花湖度假区位于吉林省吉林市丰满区，是国际级滑雪度假区。度假区依托松花湖和大青山的自然资源，打造了集滑雪、住宿、餐饮、娱乐于一体的综合性度假胜地。这里拥有中国最长的雪道，雪质优良，设施完善，是家庭滑雪度假的理想选择。',
    tags: ['吉林', '度假胜地', '家庭滑雪', '一站式服务'],
    highlights: [
      { icon: '🏨', title: '度假村', desc: '高端滑雪度假设施，提供一站式服务，适合家庭度假' },
      { icon: '⛷️', title: '多样雪道', desc: '拥有多条不同难度的雪道，适合各级别滑雪者' },
      { icon: '♨️', title: '温泉放松', desc: '滑雪后可在温泉中心放松身心，享受舒适体验' }
    ],
    tips: [
      '适合家庭度假，设施完善，服务周到',
      '建议购买多日套票，性价比更高',
      '度假区内有多家餐厅，可品尝东北特色美食',
      '提前预订住宿和雪票，旺季一房难求'
    ]
  }
}

const isVisited = computed(() => scene.value && userStore.scenesVisited.includes(scene.value.id))

const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    router.push('/scenes')
  }
}

const handleImgError = (e) => {
  e.target.src = 'https://images.unsplash.com/photo-1551582045-6ec9c11d8697?w=800&q=80'
}

const showSpotToast = (spot) => {
  showToast({
    message: `${spot.title}：${spot.description}`,
    duration: 2500,
    position: 'bottom'
  })
}

const enterPanorama = () => {
  if (!scene.value?.panoramaImages || scene.value.panoramaImages.length === 0) {
    showToast({
      message: '该景点暂无全景照片',
      duration: 2000
    })
    return
  }

  // 立即打开全景查看器，无延迟
  showPanoramaViewer.value = true
}

const handlePanoramaClose = () => {
  // 移除退出提示，提升响应速度
}

onMounted(() => {
  const sceneId = Number(route.query.sceneId)
  if (sceneId) {
    const baseScene = scenesData.find(s => s.id === sceneId)
    if (baseScene) {
      const detail = sceneDetails[sceneId] || {}
      scene.value = { ...baseScene, ...detail }
      userStore.visitScene(sceneId)

      // 立即预加载全景图片，提升响应速度
      if (scene.value.panoramaImages && scene.value.panoramaImages.length > 0) {
        scene.value.panoramaImages.forEach(img => {
          const image = new Image()
          image.src = img.url
        })
      }
    }
  }
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

.scene-detail-view {
  min-height: 100vh;
  background: linear-gradient(to bottom, #0f2547 0%, #1e3c72 100%);
  color: white;
  padding-bottom: 40px;
}

.detail-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: rgba(15, 37, 71, 0.85);
  backdrop-filter: blur(10px);

  .nav-btn {
    color: white;
    cursor: pointer;
    padding: 4px;
  }

  .header-title {
    font-size: 1rem;
    font-weight: 600;
    color: white;
    flex: 1;
    text-align: center;
    padding: 0 8px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  gap: 16px;

  p { color: rgba(255,255,255,0.7); }
}

.scene-banner {
  padding-top: 48px;

  .scene-img-wrap {
    position: relative;
    height: 280px;
    overflow: hidden;

    .scene-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .banner-gradient {
      position: absolute;
      inset: 0;
      background: linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 50%);
    }

    .banner-info {
      position: absolute;
      bottom: 16px;
      left: 16px;
      right: 16px;

      h1 {
        font-size: 1.8rem;
        color: white;
        font-weight: 700;
        margin-bottom: 4px;
        text-shadow: 0 2px 8px rgba(0,0,0,0.5);
      }

      .location {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 0.9rem;
        color: rgba(255,255,255,0.85);
      }
    }
  }
}

.content-body {
  padding: 16px;
}

.tag-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;

  .tag {
    padding: 4px 10px;
    background: rgba(59, 130, 246, 0.25);
    border: 1px solid rgba(59, 130, 246, 0.4);
    border-radius: 20px;
    font-size: 0.8rem;
    color: #93C5FD;

    &.visited {
      background: rgba(16, 185, 129, 0.2);
      border-color: rgba(16, 185, 129, 0.4);
      color: #6EE7B7;
    }
  }
}

.section {
  margin-bottom: 24px;

  .section-title {
    font-size: 1.1rem;
    font-weight: 600;
    color: white;
    margin-bottom: 12px;
    padding-left: 10px;
    border-left: 3px solid #3B82F6;
  }
}

.intro-text {
  font-size: 0.95rem;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.8);
}

.highlights {
  display: flex;
  flex-direction: column;
  gap: 12px;

  .highlight-item {
    display: flex;
    gap: 12px;
    padding: 12px;
    background: rgba(255, 255, 255, 0.07);
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.1);

    .hl-icon {
      font-size: 1.8rem;
      flex-shrink: 0;
    }

    .hl-content {
      .hl-title {
        font-size: 0.95rem;
        font-weight: 600;
        color: white;
        margin-bottom: 4px;
      }

      .hl-desc {
        font-size: 0.85rem;
        color: rgba(255, 255, 255, 0.65);
        line-height: 1.5;
      }
    }
  }
}

.hotspot-list {
  display: flex;
  flex-direction: column;
  gap: 8px;

  .hotspot-card {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    background: rgba(255, 255, 255, 0.07);
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    cursor: pointer;
    transition: background 0.2s;

    &:active {
      background: rgba(255, 255, 255, 0.12);
    }

    .spot-info {
      flex: 1;

      .spot-title {
        font-size: 0.9rem;
        font-weight: 600;
        color: white;
        margin-bottom: 2px;
      }

      .spot-desc {
        font-size: 0.8rem;
        color: rgba(255, 255, 255, 0.6);
      }
    }
  }
}

.tips-list {
  display: flex;
  flex-direction: column;
  gap: 10px;

  .tip-item {
    display: flex;
    gap: 8px;
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.8);
    line-height: 1.5;

    .tip-dot {
      flex-shrink: 0;
    }
  }
}

.action-area {
  margin-top: 8px;
}
</style>
