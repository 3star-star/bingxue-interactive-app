<template>
  <div class="collection-view">
    <!-- 页面头部 -->
    <div class="collection-header">
      <h2>我的收藏</h2>
      <p>管理您收藏的冰雪知识和美景</p>
    </div>

    <!-- 收藏分类标签 -->
    <div class="collection-tabs">
      <van-tabs v-model:active="activeTab">
        <van-tab title="知识点" name="knowledge" />
        <van-tab title="景点" name="scenes" />
        <van-tab title="成就" name="achievements" />
      </van-tabs>
    </div>

    <!-- 知识点收藏 -->
    <div v-if="activeTab === 'knowledge'" class="collection-content">
      <div v-if="collectedKnowledge.length > 0" class="collection-grid">
        <div v-for="item in collectedKnowledge"
             :key="item.id"
             class="collection-item"
             @click="viewKnowledge(item)">
          <div class="item-header">
            <span class="category-tag"
                  :style="{ backgroundColor: getCategoryColor(item.category) }">
              {{ getCategoryName(item.category) }}
            </span>
            <van-icon name="bookmark" size="20" color="#FFD700" />
          </div>
          <div class="item-content">
            <h4>{{ item.title }}</h4>
            <p>{{ item.description }}</p>
          </div>
          <div class="item-footer">
            <van-button size="small" type="danger" @click.stop="removeFromCollection('knowledge', item.id)">
              移除
            </van-button>
          </div>
        </div>
      </div>
      <div v-else class="empty-state">
        <van-icon name="bookmark" size="48" color="#999" />
        <p>暂无收藏的知识点</p>
        <van-button type="primary" @click="goToKnowledge">去探索</van-button>
      </div>
    </div>

    <!-- 景点收藏 -->
    <div v-if="activeTab === 'scenes'" class="collection-content">
      <div v-if="collectedScenes.length > 0" class="collection-grid">
        <div v-for="item in collectedScenes"
             :key="item.id"
             class="collection-item"
             @click="viewScene(item)">
          <div class="item-header">
            <van-icon name="location" size="20" color="#10B981" />
          </div>
          <div class="item-content">
            <h4>{{ item.name }}</h4>
            <p>{{ item.location }}</p>
          </div>
          <div class="item-footer">
            <van-button size="small" type="danger" @click.stop="removeFromCollection('scenes', item.id)">
              移除
            </van-button>
          </div>
        </div>
      </div>
      <div v-else class="empty-state">
        <van-icon name="location" size="48" color="#999" />
        <p>暂无收藏的景点</p>
        <van-button type="primary" @click="goToScenes">去探索</van-button>
      </div>
    </div>

    <!-- 成就收藏 -->
    <div v-if="activeTab === 'achievements'" class="collection-content">
      <div v-if="collectedAchievements.length > 0" class="collection-grid">
        <div v-for="item in collectedAchievements"
             :key="item.id"
             class="collection-item">
          <div class="item-header">
            <van-icon :name="getBadgeIcon(item.id)" size="20" color="#FFD700" />
          </div>
          <div class="item-content">
            <h4>{{ item.title }}</h4>
            <p>{{ formatDate(item.unlockedAt) }}</p>
          </div>
          <div class="item-footer">
            <van-button size="small" type="warning" @click="shareAchievement(item)">
              分享
            </van-button>
          </div>
        </div>
      </div>
      <div v-else class="empty-state">
        <van-icon name="trophy" size="48" color="#999" />
        <p>暂无成就可展示</p>
        <van-button type="primary" @click="goToGames">去挑战</van-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { showToast } from 'vant'

const router = useRouter()
const userStore = useUserStore()

// 状态
const activeTab = ref('knowledge')

// 计算属性
const collectedKnowledge = computed(() => {
  const allKnowledge = userStore.knowledgeProgress
  return Object.entries(allKnowledge)
    .filter(([id, progress]) => progress >= 100)
    .map(([id, progress]) => {
      // 这里需要从知识库中获取详细信息
      const knowledge = knowledgeData.find(k => k.id === parseInt(id))
      return knowledge ? { ...knowledge, progress } : null
    })
    .filter(Boolean)
})

const collectedScenes = computed(() => {
  return userStore.scenesVisited.map(sceneId => {
    return scenesData.find(scene => scene.id === sceneId)
  }).filter(Boolean)
})

const collectedAchievements = computed(() => {
  return userStore.unlockedBadges
})

// 方法
const getCategoryColor = (categoryName) => {
  const category = knowledgeCategories.find(c => c.name === categoryName)
  return category ? category.color : '#999999'
}

const getCategoryName = (categoryId) => {
  const category = knowledgeCategories.find(c => c.id === categoryId)
  return category ? category.name : '其他'
}

const getBadgeIcon = (badgeId) => {
  const icons = {
    level_up: 'gem',
    knowledge_explorer: 'book',
    scene_visitor: 'location',
    game_master: 'trophy',
    knowledge_start: 'lightbulb',
    knowledge_intermediate: 'book-open',
    knowledge_expert: 'award',
    scene_explorer: 'compass',
    scene_master: 'star',
    login_3: 'clock',
    login_7: 'calendar',
    login_30: 'medal',
    quiz_expert: 'question-circle'
  }
  return icons[badgeId] || 'star'
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
}

const viewKnowledge = (knowledge) => {
  router.push(`/knowledge/${knowledge.id}`)
}

const viewScene = (scene) => {
  router.push(`/scenes/${scene.id}`)
}

const removeFromCollection = (type, id) => {
  if (confirm('确定要移除收藏吗？')) {
    if (type === 'knowledge') {
      // 重置知识点进度
      userStore.knowledgeProgress[id] = 0
    } else if (type === 'scenes') {
      // 从访问记录中移除
      const index = userStore.scenesVisited.indexOf(id)
      if (index > -1) {
        userStore.scenesVisited.splice(index, 1)
      }
    }
    showToast('已移除收藏')
  }
}

const shareAchievement = (achievement) => {
  showToast(`分享成就：${achievement.title}`)
}

const goToKnowledge = () => {
  router.push('/knowledge')
}

const goToScenes = () => {
  router.push('/scenes')
}

const goToGames = () => {
  router.push('/games')
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

.collection-view {
  min-height: 100vh;
  padding: $spacing-xl 0;
  background: linear-gradient(to bottom, #1e3c72 0%, #2a5298 100%);
}

.collection-header {
  text-align: center;
  padding: 0 $spacing-xl $spacing-lg;
  margin-bottom: $spacing-lg;

  h2 {
    font-size: 2rem;
    color: white;
    margin-bottom: $spacing-sm;
  }

  p {
    font-size: 1.1rem;
    color: $text-secondary;
  }
}

.collection-tabs {
  margin: 0 $spacing-xl $spacing-lg;
}

.collection-content {
  padding: 0 $spacing-xl;
}

.collection-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: $spacing-lg;
}

.collection-item {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: $radius-lg;
  padding: $spacing-lg;
  transition: all $transition-normal;
  border: 1px solid rgba(255, 255, 255, 0.2);
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.15);
  }

  .item-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $spacing-md;

    .category-tag {
      padding: $spacing-xs $spacing-sm;
      border-radius: $radius-sm;
      font-size: 0.875rem;
      color: white;
    }
  }

  .item-content {
    margin-bottom: $spacing-md;

    h4 {
      font-size: 1.25rem;
      color: white;
      margin-bottom: $spacing-sm;
    }

    p {
      font-size: 0.95rem;
      color: $text-secondary;
      line-height: 1.5;
    }
  }

  .item-footer {
    display: flex;
    justify-content: flex-end;
  }
}

.empty-state {
  text-align: center;
  padding: $spacing-xl;
  color: rgba(255, 255, 255, 0.6);

  .van-icon {
    font-size: 4rem;
    margin-bottom: $spacing-lg;
  }

  p {
    font-size: 1.1rem;
    margin-bottom: $spacing-lg;
  }
}

@media (max-width: $mobile) {
  .collection-grid {
    grid-template-columns: 1fr;
  }
}
</style>