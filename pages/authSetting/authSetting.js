var ServiceUrl = wx.getStorageSync("ServiceUrl")
var _app = getApp()
Page({
  data: {

  },
  onLoad: function () {
    var that = this
  },
  onShow: function () {
    var that = this;
  },
  about: function () {
    wx.navigateTo({
      url: '../about/about',
    })
  },
  userInfo: function () {
    wx.navigateTo({
      url: '/pages/userDetail/userDetail',
    })
  },
  setAddress: function () {

  },
  qiehuan: function () {
    wx.navigateTo({
      url: '../Register/Register',
    })
  },
  onShareAppMessage: function () {
    var that = this
    // 用户点击右上角分享
    return {
      title: '活动邀请函',
      desc: '邀请大家来哈卜房车一起嗨~', // 分享描述
      path: 'pages/index/index' // 分享路径
    }
  }
})