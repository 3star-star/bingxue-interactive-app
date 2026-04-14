// 个人收藏页面脚本
document.addEventListener('DOMContentLoaded', function() {
    // 初始化收藏数据
    const favoritesData = {
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
        isEditMode: false
    };

    // 渲染收藏列表
    function renderFavorites() {
        const grid = document.querySelector('.favorites-grid');
        grid.innerHTML = '';

        const filteredItems = favoritesData.currentCategory === 'all'
            ? favoritesData.items
            : favoritesData.items.filter(item => item.category === favoritesData.currentCategory);

        filteredItems.forEach(item => {
            const favoriteItem = createFavoriteElement(item);
            grid.appendChild(favoriteItem);
        });

        // 添加动画效果
        animateElements();
    }

    // 创建收藏项元素
    function createFavoriteElement(item) {
        const div = document.createElement('div');
        div.className = 'favorite-item';
        div.dataset.category = item.category;
        div.dataset.id = item.id;

        const categoryIcon = getCategoryIcon(item.category);
        const categoryColor = getCategoryColor(item.category);

        div.innerHTML = `
            <div class="favorite-card">
                <div class="favorite-image">
                    <img src="../../assets/${item.image}" alt="${item.title}">
                </div>
                <div class="favorite-info">
                    <h3>${item.title}</h3>
                    <p>${item.description}</p>
                    <div class="favorite-meta">
                        <span class="meta-item" style="background: ${categoryColor}; color: white;">${categoryIcon} ${getCategoryName(item.category)}</span>
                        <span class="meta-item">⭐ 收藏于 ${item.date}</span>
                    </div>
                </div>
                <div class="favorite-actions">
                    <button class="action-button view-button" onclick="viewFavorite(${item.id})">查看</button>
                    <button class="action-button delete-button" onclick="deleteFavorite(${item.id})">删除</button>
                </div>
            </div>
        `;

        return div;
    }

    // 获取分类图标
    function getCategoryIcon(category) {
        const icons = {
            knowledge: '📚',
            scenery: '🏔️',
            game: '🎮'
        };
        return icons[category] || '📁';
    }

    // 获取分类名称
    function getCategoryName(category) {
        const names = {
            knowledge: '知识',
            scenery: '美景',
            game: '游戏'
        };
        return names[category] || '其他';
    }

    // 获取分类颜色
    function getCategoryColor(category) {
        const colors = {
            knowledge: '#0277bd',
            scenery: '#2e7d32',
            game: '#d32f2f'
        };
        return colors[category] || '#757575';
    }

    // 切换分类
    function switchCategory(category) {
        favoritesData.currentCategory = category;

        // 更新标签状态
        document.querySelectorAll('.tab-button').forEach(button => {
            button.classList.remove('active');
            if (button.dataset.category === category) {
                button.classList.add('active');
            }
        });

        renderFavorites();
    }

    // 查看收藏项
    function viewFavorite(id) {
        const item = favoritesData.items.find(item => item.id === id);
        if (item) {
            console.log(`查看收藏: ${item.title}`);
            // 这里可以添加跳转到详细页面的逻辑
            alert(`查看收藏: ${item.title}`);
        }
    }

    // 删除收藏项
    function deleteFavorite(id) {
        if (confirm('确定要删除这个收藏吗？')) {
            favoritesData.items = favoritesData.items.filter(item => item.id !== id);
            renderFavorites();
        }
    }

    // 显示编辑模式
    function showEditMode() {
        favoritesData.isEditMode = !favoritesData.isEditMode;
        const actionButton = document.querySelector('.action-button');
        actionButton.textContent = favoritesData.isEditMode ? '完成' : '编辑';

        // 在编辑模式下显示删除按钮
        document.querySelectorAll('.delete-button').forEach(button => {
            button.style.display = favoritesData.isEditMode ? 'block' : 'none';
        });
    }

    // 返回上一页
    function goBack() {
        window.history.back();
    }

    // 添加动画效果
    function animateElements() {
        const items = document.querySelectorAll('.favorite-item');
        items.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                item.style.transition = 'all 0.5s ease';

                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, 100);
            }, index * 100);
        });
    }

    // 事件监听器
    document.addEventListener('click', function(e) {
        if (e.target.closest('.tab-button')) {
            const button = e.target.closest('.tab-button');
            switchCategory(button.dataset.category);
        }
    });

    // 初始化页面
    renderFavorites();
});