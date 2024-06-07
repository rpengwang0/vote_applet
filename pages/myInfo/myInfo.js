var tip = require("../../utils/tip.js"),
  checkNetWork = require("../../utils/CheckNetWork.js"),
  check = require("../../utils/check.js"),
  yh = require("../../utils/yh.js"),
  _app = getApp(),
  gets = require("../../utils/get.js"),
  that;
Page({
  data: {
    has: false,
    ani: false,
    auth: false,
    userInfo: {},
    authLoading: false, //是否正在访问授权接口
    accountAuth: false
  },
  onLoad: function() {
    that = this;
    
  },
  onShow: function() {
    that.userInfo();
  },
  //判断是否登录
  login:function(){
    wx.navigateTo({
      url: '../login/login',
    })
  },
  userInfo:function(){
    var that = this;
    var user = wx.getStorageSync('userInfo');
    if (wx.getStorageSync('user')){
      that.setData({
        accountAuth:true,
        userInfo: user
      })
    }else{
      that.setData({
        accountAuth: false
      })
    }
  },
  bindGetUserInfo: function(e) {
    if (that.data.authLoading) {
      return
    }
    that.setData({
      authLoading: true
    })
    if (e.detail.userInfo) {
      let userInfo = JSON.stringify(e.detail.userInfo)
      console.log(e.detail.userInfo)
      wx.showLoading({
        title: 'loading...',
      })
      
    } else {
      that.setData({
        authLoading: false
      })
      console.log('用户点击了拒绝授权')
    }
  },
  userNews: function() {
    wx.navigateTo({
      url: '/pages/userNews/userNews',
    })
  },
  myVoteRecord: function() {
    wx.navigateTo({
      url: '/pages/myVoteRecord/myVoteRecord',
    })
  },
  myMiaoShaRecord: function () {
    wx.navigateTo({
      url: '/pages/myMiaoShaRecord/myMiaoShaRecord',
    })
  },
  collectionTap: function() {
    wx.navigateTo({
      url: '/pages/userCollection/userCollection',
    })
  },
  userDetail: function() {
    that.authUserInfo_show()
    return
    if (!check.CheckLogin()) {
      setTimeout(function() {
        wx.navigateTo({
          url: '/pages/Register/Register',
        })
      }, 1500)
      return;
    }
    if (!check.CheckAuth()) {
      setTimeout(function() {
        wx.navigateTo({
          url: '/pages/auth/auth',
        })
      }, 1500)
      return;
    }
    wx.navigateTo({
      url: '/pages/userDetail/userDetail',
    })
  },
  collectionTap: function() {
    wx.navigateTo({
      url: '/pages/userCollection/userCollection',
    })
  },
  releaseTap: function() {
    if (_app.globalData.accountAuth == 2) {
      that.setData({
        auth: true,
        ani: true
      })
      return
    }
    if (_app.globalData.sponsorId == 0 || _app.globalData.sponsorId == '') {
      wx.showModal({
        title: '提示',
        content: '尊敬的用户您好，您当前暂无主办方权限，发布活动自动开通，是否立即去发布？',
        success: function(e) {
          if (e.confirm) {
            wx.navigateTo({
              url: '/pages/voteType/voteType',
            })
          }
        }
      })
      return
    }
    wx.navigateTo({
      url: '/pages/activityRelease/activityRelease',
    })
  },
  wentiTap: function() {
    wx.navigateTo({
      url: '/pages/commonProblem/commonProblem',
    })
  },
  kfTap: function() {
    wx.navigateTo({
      url: '/pages/kefu/kefu',
    })
  },
  courseEnlist: function() {
    wx.showModal({
      title: '提示',
      content: '尊敬的用户您好，您当前未有任何参赛记录~',
      showCancel: false
    })
    return
    wx.navigateTo({
      url: '/pages/courseEnlist/courseEnlist',
    })
  },
  kefuTap: function() {
    wx.navigateTo({
      url: '/pages/kefu/kefu',
    })
  },
  aboutTap: function() {
    wx.navigateTo({
      url: '/pages/about/about',
    })
  },
  userApply: function() {
    wx.navigateTo({
      url: '/pages/userApply/userApply',
    })
  },
  checkDS: function() {},
  authUserInfo_show: function() {
    that.setData({
      auth: true,
      ani: true
    })
  },
  authUserInfo_hide: function() {
    that.setData({
      ani: false
    })
  },

})