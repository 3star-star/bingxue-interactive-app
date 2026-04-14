// 个人中心页面脚本
document.addEventListener('DOMContentLoaded', function() {
    // 初始化用户数据
    const userData = {
        learnedPoints: 15,
        totalPoints: 3280,
        achievements: 8,
        consecutiveDays: 5,
        achievementsList: [
            { name: '知识达人', icon: '🏆', desc: '完成10个知识点学习' },
            { name: '探索家', icon: '🗺️', desc: '访问3个全景景点' },
            { name: '学习先锋', icon: '📚', desc: '连续登录7天' },
            { name: '积分大师', icon: '⭐', desc: '累计获得2000积分' },
            { name: '答题高手', icon: '🎯', desc: '答对20道题目' },
            { name: '冰雪爱好者', icon: '🏔️', desc: '完成所有基础知识点' }
        ],
        favorites: [
            { title: '雪山知识', desc: '雪山的形成与分类', image: 'snow-mountain.jpg' },
            { title: '滑冰技巧', desc: '基础滑冰动作指导', image: 'ice-skating.jpg' },
            { title: '雪景摄影', desc: '冬季摄影技巧', image: 'snow-scene.jpg' }
        ]
    };

    // 更新统计数据
    function updateStats() {
        // 计算进度百分比
        const totalPoints = 20; // 总知识点数
        const progress = (userData.learnedPoints / totalPoints) * 100;

        document.querySelector('.stat-value').textContent = userData.learnedPoints;
        document.querySelector('.progress').style.width = `${progress}%`;

        document.querySelectorAll('.stat-card')[1].querySelector('.stat-value').textContent = userData.totalPoints;
        document.querySelectorAll('.stat-card')[1].querySelector('.progress').style.width = '65%';

        document.querySelectorAll('.stat-card')[2].querySelector('.stat-value').textContent = userData.achievements;
        document.querySelectorAll('.stat-card')[2].querySelector('.progress').style.width = '40%';

        document.querySelectorAll('.stat-card')[3].querySelector('.stat-value').textContent = userData.consecutiveDays;
        document.querySelectorAll('.stat-card')[3].querySelector('.progress').style.width = '50%';
    }

    // 渲染成就列表
    function renderAchievements() {
        const achievementsGrid = document.querySelector('.achievements-grid');
        achievementsGrid.innerHTML = '';

        userData.achievementsList.forEach(achievement => {
            const card = document.createElement('div');
            card.className = 'achievement-card';
            card.innerHTML = `
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-name">${achievement.name}</div>
                <div class="achievement-desc">${achievement.desc}</div>
            `;
            achievementsGrid.appendChild(card);
        });
    }

    // 渲染收藏列表
    function renderFavorites() {
        const favoritesGrid = document.querySelector('.favorites-grid');
        favoritesGrid.innerHTML = '';

        userData.favorites.forEach(favorite => {
            const item = document.createElement('div');
            item.className = 'favorite-item';
            item.innerHTML = `
                <img src="../../assets/${favorite.image}" alt="${favorite.title}">
                <div class="favorite-info">
                    <h4>${favorite.title}</h4>
                    <p>${favorite.desc}</p>
                </div>
            `;
            favoritesGrid.appendChild(item);
        });
    }

    // 初始化页面
    function init() {
        updateStats();
        renderAchievements();
        renderFavorites();

        // 添加动画效果
        animateElements();
    }

    // 元素动画效果
    function animateElements() {
        const cards = document.querySelectorAll('.stat-card, .achievement-card, .favorite-item');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                card.style.transition = 'all 0.5s ease';

                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 100);
            }, index * 100);
        });
    }

    // 模拟数据更新（实际应用中从API获取）
    function simulateDataUpdate() {
        // 模拟每日登录奖励
        const lastLogin = localStorage.getItem('lastLogin');
        const today = new Date().toDateString();

        if (lastLogin !== today) {
            userData.totalPoints += 50;
            userData.consecutiveDays++;
            localStorage.setItem('lastLogin', today);
            updateStats();
        }
    }

    // 事件监听器
    document.addEventListener('click', function(e) {
        if (e.target.closest('.favorite-item')) {
            const favorite = e.target.closest('.favorite-item');
            const title = favorite.querySelector('h4').textContent;
            console.log(`查看收藏: ${title}`);
            // 这里可以添加跳转到详细页面的逻辑
        }
    });

    // 初始化
    init();
    simulateDataUpdate();
});