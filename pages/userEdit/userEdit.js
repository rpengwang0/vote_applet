// 引入SDK核心类
var check = require("../../utils/check.js")
var tip = require("../../utils/tip.js")
var gets = require("../../utils/get.js")
var qqmapsdk;
var _app = getApp()
var that
Page({
  data: {
    inputValue: '',
    types: '1',
    maxlength:12,
    uid: '',
    tip:'',
    fieldName: '',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(res) {
    that = this
    that.setData({
      types: res.types
    })
    if (that.data.types == 1) {
      wx.setNavigationBarTitle({
        title: '更改名字',
      })
      that.setData({
        inputValue: _app.globalData.userInfo.nickName,
        uid: _app.globalData.userInfo.uid,
        maxlength:12,
        tip:'快起一个好听的名字吧',
        fieldName: 'nickName'
      })
    } else if (that.data.types == 2) {
      wx.setNavigationBarTitle({
        title: '更改签名',
      })
      that.setData({
        inputValue: _app.globalData.userInfo.signature,
        uid: _app.globalData.userInfo.uid,
        maxlength: 30,
        tip: '好签名可以让你的朋友更容易记住你',
        fieldName: 'signature'
      })
    } else if (that.data.types == 3) {
      wx.setNavigationBarTitle({
        title: '认证姓名',
      })
      that.setData({
        inputValue: _app.globalData.userInfo.realName,
        uid: _app.globalData.userInfo.uid,
        maxlength: 6,
        tip: '请输入您的真实姓名，我们将进行验证',
        fieldName: 'realName'
      })
    } else if (that.data.types == 4) {
      wx.setNavigationBarTitle({
        title: '认证微信号',
      })
      that.setData({
        inputValue: _app.globalData.userInfo.wechatNumber,
        uid: _app.globalData.userInfo.uid,
        maxlength: 12,
        tip: '请输入您的真实微信号，我们将进行验证',
        fieldName: 'wechatNumber'
      })
    } else if (that.data.types == 5) {
      wx.setNavigationBarTitle({
        title: '认证身份证号',
      })
      that.setData({
        inputValue: _app.globalData.userInfo.idNumber,
        uid: _app.globalData.userInfo.uid,
        maxlength: 18,
        tip: '请输入您的真实身份证号，我们将进行验证',
        fieldName: 'idNumber'
      })
    }
  },
  success: function() {
    wx.showLoading({
      title: '保存中...',
    })
    wx.request({
      url: _app.globalData.ServiceUrl + "/Content/Account.ashx",
      data: {
        Function: '5',
        fieldName: that.data.fieldName,
        value: that.data.inputValue,
        uid: that.data.uid
      },
      method: 'POST',
      // 设置请求的 header
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data.return_code == 0) {
          if (that.data.types == 1) {
            _app.globalData.userInfo.nickName = that.data.inputValue
          } else if (that.data.types == 2) {
            _app.globalData.userInfo.signature = that.data.inputValue
          } else if (that.data.types == 3) {
            _app.globalData.userInfo.realName = that.data.inputValue
          } else if (that.data.types == 4) {
            _app.globalData.userInfo.wechatNumber = that.data.inputValue
          } else if (that.data.types == 5) {
            _app.globalData.userInfo.idNumber = that.data.inputValue
          }
          wx.navigateBack()
        }
      },
      fail: function(e) {
        wx.hideLoading()
        tip.showToast('保存失败！', 1)
        wx.navigateBack()
      }
    })
  },
  inputValue: function(e) {
    var that = this
    var value = e.detail.value
    that.setData({
      'inputValue': value
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },
  goService: function() {
    wx.navigateTo({
      url: '../service/service?state=' + 2
    })
  },
  bindDateChange_1: function() {

  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})