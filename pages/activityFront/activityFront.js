var _app = getApp(),
    tip = require("../../utils/tip.js"),
    yh = require("../../utils/yh.js"),
    init = require("../../utils/init.js"),
    urls = require("../../utils/api.js"),
    list = [],
    that;
Page({
    data: {
        ani: false, //阴影层是否展示
        auth: false, //阴影层是否展示
        guanggao: true,

        imgUrls: ['https://tp2.guomei.work/banner/3.jpg', 'https://tp2.guomei.work/banner/2.jpg', 'https://tp2.guomei.work/banner/userbg.jpg'],
        ServiceUrl: 'https://tp2.guomei.work/ticket/',

        wh: 100,
        ht: 40,
        userInfo: {},
        toView: 'a1',
        accountAuth: false,
        typeArray: ['', '活动评选', '图文投票', '文字投票'],

        forumPostList: [],
        activityArray: [],
        authLoading: false, //是否正在访问授权接口
        pageNumber: 1, //当前页
        pageSize: 6, //每页显示数据
        loading: false, //是否显示正在努力为你加载更多动画
        HasNextPage: false, //是否是最后一页
        loginFlag: false,//是否显示头像
        activityList: [] //活动列表
    },
    onLoad: function () {
        that = this
        that.activityList();
        var user = wx.getStorageSync('userInfo');
        if (wx.getStorageSync('user')) {
            that.setData({
                loginFlag: true,
                userInfo: user
            })
        } else {
            that.setData({
                loginFlag: false
            })
        }
    },
    onShow: function () {
          
    },
    //活动列表
    activityList: function () {
        
        var that = this;
        wx.request({
            url: urls.LoginUrl + "/ticket/activity_api/getActivityList",
            method: 'POST',
            data: {tp:2},
            success: function (res) {
                if (res.data.code == 1) {
                    that.setData({
                        activityList: res.data.data
                    })
                }
            }
        })
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
    goMeDetail: function () {
        wx.switchTab({
            url: '/pages/myInfo/myInfo',
        })
    },
    detailTap: function (e) {
          
          
          
        let activityId = e.currentTarget.dataset.activityid;
        var group_id = e.currentTarget.dataset.group;
        wx.setStorageSync("title", e.currentTarget.dataset.title);
        wx.setStorageSync("activityId", activityId);
        let url = group_id > 0
            ? '/pages/vote/vote?activityId=' + activityId + '&has_group=' + group_id
            : '/pages/group/index?activityId=' + activityId + '&has_group=0'

        wx.navigateTo({
            url: url
        })
    },
    voteTypeTap: function () {
        if (_app.globalData.accountAuth == 2) {
            that.setData({
                auth: true,
                ani: true
            })
            return
        }
        wx.navigateTo({
            url: '/pages/voteType/voteType',
        })
    },
    getIndexActivity: function () {

    },
    activitySearch: function () {
        wx.showModal({
            title: '提示',
            content: '尊敬的用户您好，所有的活动都已经展示出来了~',
            showCancel: false
        })
        return
        wx.navigateTo({
            url: '/pages/activitySearch/activitySearch',
        })
    },
    onReachBottom: function () {
        if (that.data.loading) {
            return
        }
        if (!that.data.HasNextPage) {
            wx.showToast({
                title: '已经到最底部了~',
                icon: 'none'
            })
            return
        } else {
            that.setData({
                loading: true
            })
        }
        that.getIndexActivity()
    },
    onShareAppMessage: function () {
        return {
            title: '您的好友邀请您一起来参加活动',
            path: 'pages/activityFront/activityFront'
        }
    }
})