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

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const scene = ref(null)

// 每个场景的详细信息（扩展 scenesData 中没有的字段）
const sceneDetails = {
  1: {
    coverImage: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&q=80',
    fullDescription: '阿尔卑斯山脉横跨欧洲中南部，是欧洲最高、最宏伟的山脉。冬季白雪皑皑，山峰峻拔，是全球顶级的滑雪圣地。每年吸引数百万游客前来感受这里独特的冰雪文化和壮阔的自然景观。少女峰、马特洪峰等标志性山峰令无数登山爱好者魂牵梦绕。',
    tags: ['欧洲', '滑雪胜地', '世界遗产', '冬季旅游'],
    highlights: [
      { icon: '⛷️', title: '顶级滑雪', desc: '拥有数百条世界级滑雪道，每年举办众多国际赛事' },
      { icon: '🏔️', title: '少女峰', desc: '海拔4158米，欧洲最高铁路站所在地，有"欧洲之巅"之称' },
      { icon: '🏘️', title: '特色小镇', desc: '因特拉肯、策马特等美丽山城，充满瑞士田园风情' }
    ],
    tips: [
      '最佳游览时间为12月至3月，雪质最佳',
      '提前预订缆车和滑雪道，旺季人流量大',
      '高海拔地区注意防晒，紫外线强烈',
      '携带保暖装备，山顶温度可低至-20°C'
    ]
  },
  2: {
    coverImage: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=800&q=80',
    fullDescription: '北海道是日本最北端的大岛，冬季积雪深厚，雪质细腻干爽，是世界知名的粉雪胜地。小樽运河在雪中倒映着旧仓库的灯光，富良野的薰衣草田在冬日变成银装素裹的雪原。北海道的冬季料理，如毛蟹、海胆、拉面，更是令人难以忘怀。',
    tags: ['日本', '粉雪天堂', '温泉', '美食之旅'],
    highlights: [
      { icon: '❄️', title: '粉雪之乡', desc: '北海道粉雪含水量极低，被滑雪爱好者称为"梦幻之雪"' },
      { icon: '🏮', title: '小樽运河', desc: '夜晚的运河灯光倒映在雪地上，如梦似幻的冬日夜景' },
      { icon: '♨️', title: '温泉体验', desc: '登别、洞爷湖等地有丰富的温泉资源，雪中泡汤别有风味' }
    ],
    tips: [
      '1月至2月是雪量最充足的时期',
      '提前预购JR PASS，可大幅节省交通费用',
      '札幌雪祭（2月上旬）期间酒店需提前数月预订',
      '北海道冬季道路结冰，自驾需使用雪地轮胎'
    ]
  },
  3: {
    coverImage: 'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=800&q=80',
    fullDescription: '南极洲是地球上最神秘、最纯净的大陆，覆盖着平均2000米厚的冰盖，储存了全球约70%的淡水。这里是帝企鹅的家园，是极地探险家的终极目标。蔚蓝的冰山漂浮在南极海域，极昼与极夜交替，极光在夜空中舞动，一切都那么原始而震撼。',
    tags: ['极地探险', '企鹅王国', '纯净自然', '科考圣地'],
    highlights: [
      { icon: '🐧', title: '帝企鹅', desc: '世界上最大的企鹅，在南极严寒中孕育生命，场面令人动容' },
      { icon: '🧊', title: '巨型冰山', desc: '南极冰山晶莹剔透，有时呈现独特的蓝色，是自然界的奇观' },
      { icon: '🌌', title: '极光奇景', desc: '南极极光（南极光）色彩绚丽，是地球上最壮观的自然现象之一' }
    ],
    tips: [
      '游览南极需通过专业极地探险公司，行程提前1-2年预订',
      '11月至3月为南半球夏季，是最佳访问时期',
      '严格遵守南极条约，不得带走任何物品',
      '晕船者需提前服药，德雷克海峡以波涛汹涌著称'
    ]
  },
  4: {
    coverImage: 'https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=800&q=80',
    fullDescription: '喜马拉雅山脉是世界上最高大的山脉，拥有14座海拔超过8000米的山峰，包括世界最高峰珠穆朗玛峰（8848.86米）。这里不仅是登山者的圣地，也是藏传佛教文化的重要发源地。雄伟的雪山、神秘的寺庙、淳朴的藏族风情构成了独特的高原文明。',
    tags: ['世界屋脊', '登山圣地', '藏族文化', '高原壮景'],
    highlights: [
      { icon: '🏔️', title: '珠穆朗玛峰', desc: '海拔8848.86米，地球最高点，是无数登山者一生的梦想' },
      { icon: '🕌', title: '藏传佛教', desc: '色拉寺、扎什伦布寺等寺庙点缀在雪山之间，庄严神圣' },
      { icon: '🌊', title: '冰塔林', desc: '珠峰脚下的冰塔林是极为罕见的地貌奇观，如冰雪雕塑群' }
    ],
    tips: [
      '进入西藏需持有边境通行证（边防证）',
      '高原反应需提前3天适应，不要剧烈运动',
      '最佳登山季节为4-5月和9-10月，避开季风期',
      '昼夜温差极大，即使夏季也需携带厚实保暖衣物'
    ]
  },
  5: {
    coverImage: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&q=80',
    fullDescription: '北极是地球最北端的地区，以北冰洋为中心，被欧洲、亚洲和北美洲环绕。这里是北极熊、北极狐、驯鹿的家园。每年夏季的极昼和冬季的极夜，以及绚丽的北极光，都是大自然馈赠给人类的最神奇礼物。受全球变暖影响，北极冰川正在加速消退。',
    tags: ['极地体验', '北极光', '北极熊', '气候前线'],
    highlights: [
      { icon: '🌌', title: '北极光', desc: '9月至3月是观赏极光的最佳时期，五彩极光舞动夜空，如梦如幻' },
      { icon: '🐻‍❄️', title: '北极熊', desc: '北极熊是北极的象征，在冰面上捕猎的姿态令人震撼' },
      { icon: '⚓', title: '斯瓦尔巴', desc: '挪威斯瓦尔巴群岛是最易到达的北极目的地，常有北极熊出没' }
    ],
    tips: [
      '11月至2月是观看极光的最佳时节，需远离光污染',
      '前往北极需专业向导陪同，野外有北极熊危险',
      '北极冬季气温可达-40°C，装备务必专业齐全',
      '斯瓦尔巴群岛对游客开放且无需签证，是到达北极的便捷途径'
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
  showToast('即将进入全景体验...')
  setTimeout(() => {
    router.push('/scenes')
  }, 800)
}

onMounted(() => {
  const sceneId = Number(route.query.sceneId)
  if (sceneId) {
    const baseScene = scenesData.find(s => s.id === sceneId)
    if (baseScene) {
      const detail = sceneDetails[sceneId] || {}
      scene.value = { ...baseScene, ...detail }
      userStore.visitScene(sceneId)
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
