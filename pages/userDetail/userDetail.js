// 引入SDK核心类
var check = require("../../utils/check.js")
var tip = require("../../utils/tip.js")
var gets = require("../../utils/get.js")
var qqmapsdk;
var _app = getApp()
var that
Page({
  data: {
    userInfo: {},
    da: gets.gerTimestamp(new Date()),
    ServiceUrl: '',
    has: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },
  UpdateImg: function () {
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        var file = res.tempFilePaths
        wx.showLoading({
          title: '保存中...',
        })
        wx.uploadFile({
          url: _app.globalData.ServiceUrl + "/Content/Account.ashx",
          filePath: file[0],
          name: 'file',
          // 设置请求的 header
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          formData: {
            Function: '5',
            fieldName: 'avatarUrl',
            value: 'avatarUrl',
            uid: that.data.userInfo.uid
          },
          success: function (res) {
            var data = JSON.parse(res.data)
            if (data.return_code == 0) {
              that.setData({
                'userInfo.avatarUrl': _app.globalData.ServiceUrl + data.return_value + '?' + gets.gerTimestamp(new Date())
              })
              _app.globalData.userInfo.avatarUrl = _app.globalData.ServiceUrl + data.return_value + '?' + gets.gerTimestamp(new Date())
              wx.hideLoading()
            }
          }
        })
      }
    })
  },
  userMore: function () {
    wx.navigateTo({
      url: '/pages/userMore/userMore',
    })
  },
  userEdit: function (res) {
    var r = res.currentTarget.dataset
    console.log(r)
    wx.navigateTo({
      url: '/pages/userEdit/userEdit?types=1'
    })
  },
  userRenZheng: function () {
    wx.navigateTo({
      url: '/pages/userRenZheng/userRenZheng'
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },
  goService: function () {
    wx.navigateTo({
      url: '../service/service?state=' + 2
    })
  },
  bindDateChange_1: function () {

  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})