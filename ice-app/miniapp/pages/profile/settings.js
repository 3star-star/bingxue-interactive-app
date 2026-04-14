// 设置页面逻辑
Page({
    data: {
        settingsData: {
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
        }
    },

    onLoad: function() {
        this.initPage();
    },

    // 初始化页面
    initPage: function() {
        this.renderSettings();
        this.animateElements();
    },

    // 渲染设置项
    renderSettings: function() {
        this.setData({
            settingsData: this.data.settingsData
        });
    },

    // 切换设置
    toggleSetting: function(e) {
        const settingName = e.currentTarget.dataset.setting;
        const value = e.detail.value;

        if (settingName === 'dailyReminder') {
            this.setData({
                'settingsData.notifications.dailyReminder': value
            });
        } else if (settingName === 'newKnowledge') {
            this.setData({
                'settingsData.notifications.newKnowledge': value
            });
        } else if (settingName === 'gameActivities') {
            this.setData({
                'settingsData.notifications.gameActivities': value
            });
        } else if (settingName === 'systemMessages') {
            this.setData({
                'settingsData.notifications.systemMessages': value
            });
        } else if (settingName === 'backgroundMusic') {
            this.setData({
                'settingsData.audio.backgroundMusic': value
            });
        } else if (settingName === 'publicProgress') {
            this.setData({
                'settingsData.privacy.publicProgress': value
            });
        } else if (settingName === 'showAchievements') {
            this.setData({
                'settingsData.privacy.showAchievements': value
            });
        } else if (settingName === 'locationAccess') {
            this.setData({
                'settingsData.privacy.locationAccess': value
            });
        }
    },

    // 更新音量
    updateVolume: function(e) {
        const settingName = e.currentTarget.dataset.setting;
        const value = e.detail.value;

        if (settingName === 'soundEffects') {
            this.setData({
                'settingsData.audio.soundEffects': value
            });
        } else if (settingName === 'backgroundVolume') {
            this.setData({
                'settingsData.audio.backgroundVolume': value
            });
        }
    },

    // 编辑设置
    editSetting: function(e) {
        const settingName = e.currentTarget.dataset.setting;
        const settingValue = this.data.settingsData.account[settingName];

        wx.showModal({
            title: '编辑设置',
            content: `请输入新的${settingName === 'username' ? '用户名' : settingName === 'email' ? '邮箱' : '手机号'}`,
            editable: true,
            placeholderText: settingValue,
            success: (res) => {
                if (res.confirm && res.content) {
                    const newValue = res.content.trim();
                    if (newValue) {
                        this.setData({
                            [`settingsData.account.${settingName}`]: newValue
                        });
                        this.showNotification(`已更新${settingName === 'username' ? '用户名' : settingName === 'email' ? '邮箱' : '手机号'}`);
                    }
                }
            }
        });
    },

    // 清除缓存
    clearCache: function() {
        wx.showModal({
            title: '确认清除',
            content: '确定要清除缓存吗？这将释放存储空间。',
            success: (res) => {
                if (res.confirm) {
                    this.setData({
                        'settingsData.other.cacheSize': '0 MB'
                    });
                    this.showNotification('缓存已清除');
                }
            }
        });
    },

    // 显示关于我们
    showAbout: function() {
        wx.showModal({
            title: '关于我们',
            content: '冰雪世界 v1.0.0\n\n创新应用比赛参赛作品\n\n© 2024 冰雪世界团队',
            showCancel: false
        });
    },

    // 显示通知
    showNotification: function(message) {
        wx.showToast({
            title: message,
            icon: 'success',
            duration: 2000
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
        const items = this.selectAllComponents('.setting-item');
        items.forEach((item, index) => {
            setTimeout(() => {
                item.setData({
                    animation: {
                        opacity: 0,
                        transform: 'translateX(-20px)'
                    }
                });

                setTimeout(() => {
                    item.setData({
                        animation: {
                            opacity: 1,
                            transform: 'translateX(0)'
                        }
                    });
                }, 100);
            }, index * 100);
        });
    }
});