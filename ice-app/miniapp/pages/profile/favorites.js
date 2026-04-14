// 个人收藏页面逻辑
Page({
    data: {
        favoritesData: {
            items: [
                {
                    id: 1,
                    title: '雪山知识',
                    description: '雪山的形成与分类',
                    category: 'knowledge',
                    image: 'snow-mountain.jpg',
                    date: '2024-03-15'
                },
                {
                    id: 2,
                    title: '冰雪滑冰场',
                    description: '冬季滑冰运动指南',
                    category: 'scenery',
                    image: 'ice-skating.jpg',
                    date: '2024-03-14'
                },
                {
                    id: 3,
                    title: '知识问答挑战',
                    description: '冰雪知识竞赛题目',
                    category: 'game',
                    image: 'snow-game.jpg',
                    date: '2024-03-13'
                },
                {
                    id: 4,
                    title: '雪花形成原理',
                    description: '冰晶的六角形结构',
                    category: 'knowledge',
                    image: 'snow-science.jpg',
                    date: '2024-03-12'
                },
                {
                    id: 5,
                    title: '冬季森林景观',
                    description: '雪覆盖的森林美景',
                    category: 'scenery',
                    image: 'winter-forest.jpg',
                    date: '2024-03-11'
                },
                {
                    id: 6,
                    title: '雪景拼图游戏',
                    description: '冬季风景拼图挑战',
                    category: 'game',
                    image: 'snow-puzzle.jpg',
                    date: '2024-03-10'
                }
            ],
            currentCategory: 'all',
            isEditMode: false,
            categoryTabs: [
                { name: '全部', value: 'all', active: true },
                { name: '知识', value: 'knowledge', active: false },
                { name: '美景', value: 'scenery', active: false },
                { name: '游戏', value: 'game', active: false }
            ]
        }
    },

    onLoad: function() {
        this.initPage();
    },

    // 初始化页面
    initPage: function() {
        this.renderFavorites();
        this.animateElements();
    },

    // 渲染收藏列表
    renderFavorites: function() {
        const filteredItems = this.data.favoritesData.currentCategory === 'all'
            ? this.data.favoritesData.items
            : this.data.favoritesData.items.filter(item => item.category === this.data.favoritesData.currentCategory);

        // 添加分类信息
        const itemsWithCategoryInfo = filteredItems.map(item => ({
            ...item,
            categoryIcon: this.getCategoryIcon(item.category),
            categoryName: this.getCategoryName(item.category),
            categoryColor: this.getCategoryColor(item.category)
        }));

        this.setData({
            filteredFavorites: itemsWithCategoryInfo
        });
    },

    // 获取分类图标
    getCategoryIcon: function(category) {
        const icons = {
            knowledge: '📚',
            scenery: '🏔️',
            game: '🎮'
        };
        return icons[category] || '📁';
    },

    // 获取分类名称
    getCategoryName: function(category) {
        const names = {
            knowledge: '知识',
            scenery: '美景',
            game: '游戏'
        };
        return names[category] || '其他';
    },

    // 获取分类颜色
    getCategoryColor: function(category) {
        const colors = {
            knowledge: '#0277bd',
            scenery: '#2e7d32',
            game: '#d32f2f'
        };
        return colors[category] || '#757575';
    },

    // 切换分类
    switchCategory: function(e) {
        const category = e.currentTarget.dataset.category;

        // 更新标签状态
        const tabs = this.data.favoritesData.categoryTabs.map(tab => ({
            ...tab,
            active: tab.value === category
        }));

        this.setData({
            'favoritesData.currentCategory': category,
            'favoritesData.categoryTabs': tabs
        });

        this.renderFavorites();
    },

    // 查看收藏项
    viewFavorite: function(e) {
        const id = e.currentTarget.dataset.id;
        const item = this.data.favoritesData.items.find(item => item.id === id);

        if (item) {
            wx.showToast({
                title: `查看收藏: ${item.title}`,
                icon: 'success',
                duration: 1500
            });
            // 这里可以添加跳转到详细页面的逻辑
        }
    },

    // 删除收藏项
    deleteFavorite: function(e) {
        const id = e.currentTarget.dataset.id;

        wx.showModal({
            title: '确认删除',
            content: '确定要删除这个收藏吗？',
            success: (res) => {
                if (res.confirm) {
                    this.setData({
                        'favoritesData.items': this.data.favoritesData.items.filter(item => item.id !== id)
                    });
                    this.renderFavorites();
                }
            }
        });
    },

    // 显示编辑模式
    showEditMode: function() {
        this.setData({
            'favoritesData.isEditMode': !this.data.favoritesData.isEditMode
        });

        // 更新按钮文本
        this.setData({
            editButtonText: this.data.favoritesData.isEditMode ? '完成' : '编辑'
        });
    },

    // 返回上一页
    goBack: function() {
        wx.navigateBack();
    },

    // 导航到其他页面
    navigateTo: function(e) {
        const page = e.currentTarget.dataset.page;
        wx.navigateTo({
            url: `../${page}/${page}`
        });
    },

    // 元素动画效果
    animateElements: function() {
        const items = this.selectAllComponents('.favorite-item');
        items.forEach((item, index) => {
            setTimeout(() => {
                item.setData({
                    animation: {
                        opacity: 0,
                        transform: 'translateY(20px)'
                    }
                });

                setTimeout(() => {
                    item.setData({
                        animation: {
                            opacity: 1,
                            transform: 'translateY(0)'
                        }
                    });
                }, 100);
            }, index * 100);
        });
    }
});