// 设置页面脚本
document.addEventListener('DOMContentLoaded', function() {
    // 初始化设置数据
    const settingsData = {
        account: {
            username: '冰雪探索者',
            email: 'user@iceapp.com',
            phone: '138****8888'
        },
        notifications: {
            dailyReminder: true,
            newKnowledge: true,
            gameActivities: false,
            systemMessages: true
        },
        audio: {
            backgroundMusic: true,
            soundEffects: 70,
            backgroundVolume: 50
        },
        privacy: {
            publicProgress: true,
            showAchievements: true,
            locationAccess: false
        },
        other: {
            cacheSize: '128 MB',
            version: 'v1.0.0'
        }
    };

    // 初始化页面
    function init() {
        renderSettings();
        setupEventListeners();
        animateElements();
    }

    // 渲染设置项
    function renderSettings() {
        // 账户设置
        document.querySelectorAll('.setting-item').forEach(item => {
            const label = item.querySelector('.setting-label').textContent;
            if (label === '用户名') {
                item.querySelector('.setting-value').textContent = settingsData.account.username;
            } else if (label === '邮箱') {
                item.querySelector('.setting-value').textContent = settingsData.account.email;
            } else if (label === '手机号') {
                item.querySelector('.setting-value').textContent = settingsData.account.phone;
            }
        });

        // 通知设置
        document.querySelectorAll('.toggle-item').forEach(item => {
            const label = item.querySelector('.setting-label').textContent;
            const checkbox = item.querySelector('input[type="checkbox"]');

            if (label === '每日登录提醒') {
                checkbox.checked = settingsData.notifications.dailyReminder;
            } else if (label === '新知识更新通知') {
                checkbox.checked = settingsData.notifications.newKnowledge;
            } else if (label === '游戏活动提醒') {
                checkbox.checked = settingsData.notifications.gameActivities;
            } else if (label === '系统消息') {
                checkbox.checked = settingsData.notifications.systemMessages;
            }
        });

        // 音效设置
        document.querySelectorAll('.volume-slider input').forEach((slider, index) => {
            if (index === 0) {
                slider.value = settingsData.audio.soundEffects;
            } else if (index === 1) {
                slider.value = settingsData.audio.backgroundVolume;
            }
        });

        // 隐私设置
        document.querySelectorAll('.toggle-item').forEach(item => {
            const label = item.querySelector('.setting-label').textContent;
            const checkbox = item.querySelector('input[type="checkbox"]');

            if (label === '公开学习进度') {
                checkbox.checked = settingsData.privacy.publicProgress;
            } else if (label === '显示成就徽章') {
                checkbox.checked = settingsData.privacy.showAchievements;
            } else if (label === '允许位置访问') {
                checkbox.checked = settingsData.privacy.locationAccess;
            }
        });

        // 其他设置
        document.querySelectorAll('.setting-item').forEach(item => {
            const label = item.querySelector('.setting-label').textContent;
            if (label === '清除缓存') {
                item.querySelector('.setting-value').textContent = settingsData.other.cacheSize;
            } else if (label === '版本信息') {
                item.querySelector('.setting-value').textContent = settingsData.other.version;
            }
        });
    }

    // 设置事件监听器
    function setupEventListeners() {
        // 切换开关事件
        document.querySelectorAll('.toggle-switch input').forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                const label = this.closest('.toggle-item').querySelector('.setting-label').textContent;

                if (label === '每日登录提醒') {
                    settingsData.notifications.dailyReminder = this.checked;
                } else if (label === '新知识更新通知') {
                    settingsData.notifications.newKnowledge = this.checked;
                } else if (label === '游戏活动提醒') {
                    settingsData.notifications.gameActivities = this.checked;
                } else if (label === '系统消息') {
                    settingsData.notifications.systemMessages = this.checked;
                } else if (label === '背景音乐') {
                    settingsData.audio.backgroundMusic = this.checked;
                } else if (label === '公开学习进度') {
                    settingsData.privacy.publicProgress = this.checked;
                } else if (label === '显示成就徽章') {
                    settingsData.privacy.showAchievements = this.checked;
                } else if (label === '允许位置访问') {
                    settingsData.privacy.locationAccess = this.checked;
                }
            });
        });

        // 音量滑块事件
        document.querySelectorAll('.volume-slider input').forEach((slider, index) => {
            slider.addEventListener('input', function() {
                if (index === 0) {
                    settingsData.audio.soundEffects = this.value;
                } else if (index === 1) {
                    settingsData.audio.backgroundVolume = this.value;
                }
            });
        });

        // 编辑按钮事件
        document.querySelectorAll('.edit-button').forEach(button => {
            button.addEventListener('click', function() {
                const settingName = this.closest('.setting-item').querySelector('.setting-label').textContent;
                editSetting(settingName);
            });
        });

        // 清除缓存按钮事件
        document.querySelector('.action-button[onclick="clearCache()"]').addEventListener('click', clearCache);

        // 关于我们按钮事件
        document.querySelector('.action-button[onclick="showAbout()"]').addEventListener('click', showAbout);
    }

    // 编辑设置
    function editSetting(settingName) {
        let newValue;
        let inputType = 'text';

        if (settingName === '用户名' || settingName === '邮箱' || settingName === '手机号') {
            newValue = prompt(`请输入新的${settingName}:`, settingsData.account[settingName.toLowerCase().replace(' ', '')]);
            if (newValue && newValue.trim()) {
                if (settingName === '用户名') {
                    settingsData.account.username = newValue.trim();
                } else if (settingName === '邮箱') {
                    settingsData.account.email = newValue.trim();
                } else if (settingName === '手机号') {
                    settingsData.account.phone = newValue.trim();
                }
                renderSettings();
                showNotification(`已更新${settingName}`);
            }
        }
    }

    // 清除缓存
    function clearCache() {
        if (confirm('确定要清除缓存吗？这将释放存储空间。')) {
            // 模拟清除缓存
            settingsData.other.cacheSize = '0 MB';
            renderSettings();
            showNotification('缓存已清除');
        }
    }

    // 显示关于我们
    function showAbout() {
        alert('冰雪世界 v1.0.0\n\n创新应用比赛参赛作品\n\n© 2024 冰雪世界团队');
    }

    // 显示通知
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.background = '#0277bd';
        notification.style.color = 'white';
        notification.style.padding = '1rem 1.5rem';
        notification.style.borderRadius = '8px';
        notification.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        notification.style.zIndex = '1000';
        notification.style.animation = 'slideIn 0.3s ease';

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // 返回上一页
    function goBack() {
        window.history.back();
    }

    // 元素动画效果
    function animateElements() {
        const items = document.querySelectorAll('.setting-item');
        items.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '0';
                item.style.transform = 'translateX(-20px)';
                item.style.transition = 'all 0.5s ease';

                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateX(0)';
                }, 100);
            }, index * 100);
        });
    }

    // 添加CSS动画
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // 初始化
    init();
});