var tip = require("../../utils/tip.js");
var urls = require("../../utils/api.js");
var Wxmlify = require('../../wxmlify/wxmlify');
var _app = getApp()
var that,
    yh = require("../../utils/yh.js");
var videoContext;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        ani: false, //阴影层是否展示
        auth: false, //阴影层是否展示
        authLoading: true, //是否正在访问授权接口
        playerArray: [],
        reasonList: [],
        pageNumber: 1, //当前页
        pageSize: 10, //每页显示数据
        loading: false, //是否显示正在努力为你加载更多动画
        HasNextPage: false, //是否是最后一页
        overTime: '0天0时0分0秒', //距结束还剩
        imgUrls: [],
        wh: 100,
        ht: 56,
        activityInfo: '', //活动信息
        countDown: true,
        ticketFlag: true,
        endTime: '', //活动结束时间
        endTime_t: '',
        day: '',
        hou: '',
        min: '',
        sec: '',
        nodes: '', //大赛详情
        deviceHeight: '',
        loadMoreData: '加载更多...',
        currentTab: 1,
        searchValue: '',
        value: '',
        nomore: false,
        activityId: '',
        videoBg: '',
        videoUrl: '',
        group_id: '', //分组id
        videoImg: false, //video封面图
        voteFlag: false, //显示轮播图还是video
        regionShow: false, //地区排名是否显示
        playStart: 0, //视频播放位置
        valueShow: '',
        delet: true, //搜索框的删除按钮默认隐藏,
        marginTop: '0rpx',
        group_name: '',
        has_group: 0,
        pull_refresh: false,
        ticket_num: 0,
        player_num: 0
    },
    onReady: function () {

    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (e) {
        that = this
        that.setData({
            activityId: e.activityId
        })
        if (e.group_id) {
            that.setData({
                group_id: e.group_id
            });
        }
        if (e.has_group) {
            that.setData({
                has_group: e.has_group
            });
        }
        if (e.group_name) {
            that.setData({
                group_name: e.group_name
            });
        }
        if (e.ticket_num) {
            that.setData({
                ticket_num: e.ticket_num
            });
        }
        if (e.player_num) {
            that.setData({
                player_num: e.player_num
            });
        }
        if (e.group_id == 1) {
            that.setData({
                regionShow: true
            })
        } else {
            that.setData({
                regionShow: false
            })
        }
        //设置活动id
        _app.globalData.activityId = e.activityId
        wx.getSystemInfo({
            success: function (res) {
                // 如果是安卓机
                that.setData({
                    isAndroid: wx.getSystemInfoSync().system.search('Android') >= 0
                });
                // that.setData({
                //   deviceHeight: parseInt(res.windowHeight),
                // })
            }
        })
        //获取选手列表
        if (e.has_group > 0 && !e.group_id) {
            that.groupList();
        } else {
            that.getPlayerList();
        }

        that.activityInfo(e.activityId);
        that.activityBanner(e.activityId);
    },
    bindplay: function () {
        this.setData({
            videoImg: true
        })
        videoContext.play()
    },
    //video图片

    //获取选手列表的函数
    getPlayerList: function () {
        wx.request({
            url: _app.globalData.ServiceUrl + "activity_api/getActivityPlayerList",
            data: {
                activity_id: _app.globalData.activityId,
                order: 1,
                page: that.data.pageNumber,
                group_id: that.data.group_id ? that.data.group_id : '',
                where_str: that.data.value ? that.data.value : ''
            },
            method: 'POST',
            // 设置请求的 header
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                if (res.data.code == 1) {
                    if (that.data.pull_refresh) {
                        wx.stopPullDownRefresh();
                        that.setData({
                            loading: false
                        });
                    }
                    //赋值数据
                    if (res.data.data.length == 0) {
                        that.setData({
                            nomore: true, ////如果返回的数据为空，那么就没有下一页了
                            loadMoreData: "已经到最后了",
                        })
                        return;
                    }
                    var arr = that.data.playerArray;
                    if (that.data.pull_refresh) {
                        that.setData({
                            'playerArray': arr,
                            pull_refresh: false
                        })
                    } else {
                        Array.prototype.push.apply(arr, res.data.data)
                        that.setData({
                            'playerArray': arr
                        })
                    }
                }

                wx.hideLoading()
            },
            fail: function (e) {
                wx.hideLoading()
                tip.showToast('读取信息失败！', 1)
                wx.navigateBack()
            }
        })

    },
    onReachBottom: function (e) {
        this.setData({
            searchLoading: false //显示加载更多
        })
        //滚动加载
        if (!this.data.nomore) {
            this.setData({
                pageNumber: this.data.pageNumber + 1
            })
            this.getPlayerList();
        }
    },
    //搜索
    search: function (e) {
        var that = this;
        this.setData({
            playerArray: [],
            pageNumber: 1,
            nomore: false,
            value: that.data.searchValue,
            valueShow: that.data.searchValue,
        })
        this.getPlayerList();
    },
    search_clear: function (e) {
        this.setData({
            searchValue: e.detail.value
        })
        if (e.detail.value != "") {
            this.setData({
                delet: false, //删除按钮显示
            })
        } else {
            this.setData({
                delet: true, //删除按钮隐藏
            })
        }
    },
    //清除搜索框并刷新数据
    deletValue: function () {
        this.setData({
            delet: true,
            playerArray: [],
            pageNumber: 1,
            nomore: false,
            value: '',
            valueShow: '',
        })
        this.getPlayerList();
    },
    authUserInfo_show: function () {
        that.setData({
            auth: true,
            ani: true
        })
    },
    authUserInfo_hide: function () {
        that.setData({
            ani: false
        })
    },

    previewImage: function () {
        wx.previewImage({
            current: 'https://beiyong3.eqlsoft.cn/Upload/ActivityCMS/201911302149043811.jpg', // 当前显示图片的http链接
            urls: ['https://beiyong3.eqlsoft.cn/Upload/ActivityCMS/201911302149043811.jpg'] // 需要预览的图片http链接列表
        })
    },
    searchTap: function () {
        wx.navigateTo({
            url: '/pages/enlistSearch/enlistSearch',
        })
    },
    signUp: function () {
        if (true) {
            wx.showModal({
                title: '提示',
                content: '尊敬的用户您好，当前活动暂未开放报名，感谢您的参与',
                showCancel: false
            })
            return
        }
        wx.navigateTo({
            url: '/pages/activityEnlist/activityEnlist',
        })
    },
    gotoGroup: function (e) {
        let that = this;
        let group_id = e.currentTarget.dataset.group_id;
        let group_name = e.currentTarget.dataset.group_name;
        let player_num = e.currentTarget.dataset.player_num;
        let ticket_num = e.currentTarget.dataset.ticket_num;
        // that.setData({
        //     group_id: group_id,
        //     group_name: group_name,
        //     player_num: player_num,
        //     ticket_num: ticket_num
        // });
        let url = '../group/index?group_id=' + group_id + '&group_name=' + group_name + '&player_num=' + player_num + '&ticket_num=' + ticket_num + '&has_group=1&activityId=' + that.data.activityId;
        wx.navigateTo({
            url: url,
        });
    },
    jieshaoTap: function () {
        wx.navigateTo({
            url: '../activityDetail/activityDetail?activityId=' + that.data.activityId,
        })
    },
    onShareAppMessage: function () {
        var that = this;
        var title = wx.getStorageSync("title");
        let url = 'pages/vote/vote?activityId=' + that.data.activityId;
        if (that.data.player_num > 0) {
            url += '&player_num=' + that.data.player_num
        }
        if (that.data.has_group) {
            url += '&has_group=1'
        }
        if (that.data.group_id > 0) {
            url += '&group_id=' + that.data.group_id
        }
        if (that.data.ticket_num > 0) {
            url += '&ticket_num=' + that.data.ticket_num
        }
        if (that.data.group_name > 0) {
            url += '&group_name=' + that.data.group_name
        }

        return {
            title: that.data.activityInfo.activity_title,
            desc: '', // 分享描述
            imageUrl: that.data.activityInfo.share_img,
            path: url // 分享路径
        }
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */

    onPullDownRefresh: function () {
        let that = this;
        if (that.data.loading) {
            return;
        }
        that.setData({
            loading: true,
        });
        wx.startPullDownRefresh({
            success: function () {
                that.getPlayerList();
                that.setData({
                    pull_refresh: true
                });
            }
        })
    },

    goToIntroduce(e) {
        // 选手详情页面
        // if (this.data.countDown){
        let app = getApp();
        let urlWithArgs = app.getFullUrl();
        // 选手详情页面
        // if (this.data.countDown){
        wx.navigateTo({
            url: '/pages/introduce/introduce?player_id=' + e.currentTarget.dataset.pid + '&back=' + encodeURIComponent(urlWithArgs)
        });

        // wx.navigateTo({
        //     url: '/pages/introduce/introduce?player_id=' + e.currentTarget.dataset.pid
        // });
        // }else{
        //   wx.showToast({
        //     title: this.data.ticketFlag ? '活动已结束' :'活动未开始',
        //     icon:'none',
        //     duration:2000
        //   })
        // }
    },
    goToGfit(e) {
        let that = this;
        // 送礼物页面
        // if (this.data.countDown) {
        wx.navigateTo({
            url: '/pages/gift/gift?pId=' + e.currentTarget.dataset.pid + '&is_voice=' + that.data.activityInfo.is_voice + '&zan_num=' + that.data.activityInfo.person_day_user_num
        });
        // } else {
        //   wx.showToast({
        //     title: this.data.ticketFlag ? '活动已结束' : '活动未开始',
        //     icon: 'none',
        //     duration: 2000
        //   })
        // }
    },
    goToRanking() {
        // 人气排行版
        wx.navigateTo({
            url: '/pages/activityRanking/activityRanking'
        });
    },
    //奖项设置
    prizeTab() {
        wx.navigateTo({
            url: '../activityEnlist/activityEnlist'
        });
    },
    //获取活动信息
    activityInfo: function (activity_id) {
        var that = this;
        wx.request({
            url: urls.LoginUrl + "/ticket/activity_api/getActivityInfo",
            method: 'POST',
            // 设置请求的 header
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
                activity_id: activity_id
            },
            success: function (res) {
                if (res.data.code == 1) {
                    wx.setNavigationBarTitle({
                        title: res.data.data.activity_title
                    })
                    that.setData({
                        activityInfo: res.data.data,
                        endTime: res.data.data.ticket_start_time,
                        endTime_t: res.data.data.ticket_end_time
                    })
                    //设置全局缓存 2行 王志鹏 修改 2019-12-14
                    wx.setStorageSync("title", res.data.data.activity_title);
                    wx.setStorageSync("activityId", activity_id);
                    that.countDown();
                } else {
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none',
                        duration: 2000
                    });
                }
            }
        })
    },
    //获取活动banner
    activityBanner: function (activity_id) {
        var that = this;
        wx.request({
            url: urls.LoginUrl + "/ticket/activity_api/getActivityBannerList",
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
                activity_id: activity_id
            },
            success: function (res) {
                if (res.data.code == 1) {
                    let imgs = [];
                    let _data = res.data.data;
                    if (_data.length > 0) {
                        _data.forEach((v, i) => {
                            if (v.type == 1) {
                                imgs.push(v.thumb_img);
                            }
                        });
                        if (imgs.length > 0) {
                            that.setData({
                                imgUrls: imgs
                            });
                        }
                        _data.forEach((v, i) => {
                            if (v.type == 2) {
                                that.setData({
                                    videoUrl: v.video_url,
                                    videoBg: v.banner_img
                                });
                            }
                        });

                        if (that.data.videoUrl) {
                            let px = imgs.length == 0 ? '28rpx' : '450rpx';
                            that.setData({
                                marginTop: px
                            });
                        }
                    }
                } else {
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none',
                        duration: 2000
                    });
                }
            }
        })
    },
    //tab
    clickTab: function (e) {
        var that = this;
        var current = e.currentTarget.dataset.current;
        that.setData({
            delet: true
        })
        if (that.data.currentTab == current) {
            return false
        } else {
            that.setData({
                currentTab: current
            })
        }
        if (current == 0) {
            that.detailInfo();
        } else if (current == 2 || current == 1) {
            that.setData({
                playerArray: [],
                pageNumber: 1,
                nomore: false,
                value: '',
                valueShow: '',
            })
            that.getPlayerList();
        } else if (current == 3) {
            that.prizeInfo();
        } else if (current == 4) {
            that.groupList();
        }
    },
    //获取排名
    getPlayerLists: function () {
        wx.request({
            url: _app.globalData.ServiceUrl + "activity_api/getActivityPlayerList",
            data: {
                activity_id: _app.globalData.activityId,
                order: 1,
                page: that.data.pageNumber,
                group_id: '',
                where_str: ''
            },
            method: 'POST',
            // 设置请求的 header
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                if (res.data.code == 1) {
                    //赋值数据
                    that.setData({
                        'playerArrays': res.data.data,
                        loading: false
                    })
                }
                wx.hideLoading();
            },
            fail: function (e) {
                wx.hideLoading()
                tip.showToast('读取信息失败！', 1)
                wx.navigateBack()
            }
        })

    },
    //大赛详情
    detailInfo: function () {
        var that = this;
        wx.request({
            url: urls.LoginUrl + "/ticket/activity_api/getActivityDetail",
            method: 'POST',
            // 设置请求的 header
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
                activity_id: _app.globalData.activityId
            },
            success: function (res) {
                var html = res.data.data;
                var wxmlify = new Wxmlify(html, that, {
                    // new 一个 wxmlify 实例就好了
                    preserveStyles: ['fontSize', 'backgroundColor', 'color'],
                    dataKey: 'nodes', //解析后数据在页面data中的key类型：string
                    disableImagePreivew: false //禁用图片点击预览默认：false
                });

            }
        })
    },
    //奖项设置
    prizeInfo: function () {
        var that = this;
        wx.request({
            url: urls.LoginUrl + "/ticket/activity_api/getActivityCompany",
            method: 'POST',
            // 设置请求的 header
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
                activity_id: _app.globalData.activityId
            },
            success: function (res) {
                var html = res.data.data;
                var wxmlify = new Wxmlify(html, that, {
                    // new 一个 wxmlify 实例就好了
                    preserveStyles: ['fontSize', 'backgroundColor', 'color'],
                    dataKey: 'nodes', //解析后数据在页面data中的key类型：string
                    disableImagePreivew: false //禁用图片点击预览默认：false
                });
            }
        })
    },
    //地区排名
    groupList: function () {
        var that = this;
        wx.request({
            url: urls.LoginUrl + "/ticket/activity_api/getActivityGroup",
            method: 'POST',
            // 设置请求的 header
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
                activity_id: _app.globalData.activityId,
            },
            success: function (res) {
                if (res.data.code == 1) {
                    for (var i = 0; i < res.data.data.length; i++) {
                        res.data.data[i].open = false;
                    }
                    that.setData({
                        reasonList: res.data.data
                    })

                }
            }
        })
    },
    /**
     * 点击展开收缩
     */
    openList: function (e) {
        var that = this;
        var index = e.currentTarget.dataset.index;
        var group_id = e.currentTarget.dataset.group;
        var list = that.data.reasonList;
        list[index].open = !list[index].open;
        that.setData({
            reasonList: list,
            group_id: group_id,
            playerArray: [],
            pageNumber: 1,
            nomore: false,
        })
        that.getPlayerList();
    },
    //倒计时
    countDown: function () {
        var that = this;
        var nowTime = new Date().getTime(); //现在时间（时间戳）
        var endTime = (that.data.endTime) * 1000; //开始时间（时间戳）
        var endTimes = (that.data.endTime_t) * 1000; //结束时间（时间戳）
        var time = (endTimes - nowTime) / 1000;

        // 获取天、时、分、秒
        let day = parseInt(time / (60 * 60 * 24));
        let hou = parseInt(time % (60 * 60 * 24) / 3600);
        let min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
        let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60);
        //console.log(day + "," + hou + "," + min + "," + sec)
        day = that.timeFormin(day),
            hou = that.timeFormin(hou),
            min = that.timeFormin(min),
            sec = that.timeFormin(sec)
        that.setData({
            day: that.timeFormat(day),
            hou: that.timeFormat(hou),
            min: that.timeFormat(min),
            sec: that.timeFormat(sec)
        })
        // 每1000ms刷新一次
        if (nowTime < endTime) {
            that.setData({
                ticketFlag: false,
                countDown: false
            })
        } else if (nowTime > endTimes) {
            that.setData({
                ticketFlag: true,
                countDown: false
            })
        } else {
            that.setData({
                countDown: true
            })
            setTimeout(this.countDown, 1000);
        }
        // if (time > 0) {
        //   that.setData({
        //     countDown: true
        //   })
        //   setTimeout(this.countDown, 1000);
        // } else {
        //   that.setData({
        //     countDown: false
        //   })
        // }
    },
    //小于10的格式化函数（2变成02）
    timeFormat(param) {
        return param < 10 ? '0' + param : param;
    },
    //小于0的格式化函数（不会出现负数）
    timeFormin(param) {
        return param < 0 ? 0 : param;
    },
    onShow: function () {
        var num = 706;
        var that = this;
        that.setData({
            videoImg: false,
            playStart:0
        });
        // videoContext = wx.createVideoContext('myVideo')
        // videoContext.pause()
        wx: wx.getSystemInfo({
            success: function (res) {
                var version = Number(res.version.replace(/[.]/g, ""));
                if (version > num) {
                    wx.hideHomeButton({
                        success: function () {
                            console.log("首页图标我隐藏拉");
                        }
                    })
                }
            }
        })
    },

})