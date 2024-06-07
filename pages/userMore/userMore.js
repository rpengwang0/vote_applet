// 引入SDK核心类
var tip = require("../../utils/tip.js")
var city = require("../../utils/city.js")
var _app = getApp()
var that
var list = []
Page({
  data: {
    gender: ['女', '男'],
    multiIndex: [0, 0],
    multiArray: city.getMultiArray(),
    objectMultiArray: city.getObjectMultiArray(),
    userInfo: {}
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this

    wx.showLoading({
      title: 'loading...',
    })
    var interval = setInterval(function () {
      if (_app.globalData.has) {
        clearInterval(interval)
        that.setData({
          userInfo: _app.globalData.userInfo
        })
        var a = that.data.multiArray[0].indexOf(that.data.userInfo.province)
        console.log(a)
        list = []
        var b = -1;
        var c;
        for (var i = 0; i < that.data.objectMultiArray.length; i++) {
          if (that.data.objectMultiArray[i].parid == that.data.objectMultiArray[a].regid) {
            b++;
            if (that.data.objectMultiArray[i].regname == that.data.userInfo.city) {
              c = b;
            }
            list.push(that.data.objectMultiArray[i].regname)
          }
        }
        that.setData({
          "multiArray[1]": list,
          "multiIndex[0]": a,
          "multiIndex[1]": c
        })
        console.log(_app.globalData.userInfo)
        wx.hideLoading()
      }
    }, 100)

  },
  genderTap: function (e) {
    wx.showActionSheet({
      itemList: that.data.gender,
      success: function (res) {
        that.httpRequet('gender', res.tapIndex, 0)
        console.log(res.tapIndex)
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },
  signatureTap: function (r) {
    wx.navigateTo({
      url: '/pages/userEdit/userEdit?types=2'
    })
  },
  httpRequet: function (fieldName, inputValue, n) {
    wx.showLoading({
      title: '保存中...',
    })
    wx.request({
      url: _app.globalData.ServiceUrl + "/Content/Account.ashx",
      data: {
        Function: '5',
        fieldName: fieldName,
        value: inputValue,
        uid: _app.globalData.userInfo.uid
      },
      method: 'POST',
      // 设置请求的 header
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data.return_code == 0) {
          if (n == 0) {
            that.setData({
              'userInfo.gender': inputValue
            })
            _app.globalData.userInfo.gender = inputValue
          } else if (n == 1) {
            that.setData({
              'userInfo.province': inputValue
            })
            _app.globalData.userInfo.province = inputValue
          } else if (n == 2) {
            that.setData({
              'userInfo.city': inputValue
            })
            _app.globalData.userInfo.city = inputValue
          } else if (n == 3) {
            that.setData({
              'userInfo.birthDate': inputValue
            })
            _app.globalData.userInfo.birthDate = inputValue
          }
        }
        wx.hideLoading()
      },
      fail: function (e) {
        wx.hideLoading()
        tip.showToast('保存失败！', 1)
        wx.navigateBack()
      }
    })
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    that.setData({
      "multiIndex[0]": e.detail.value[0],
      "multiIndex[1]": e.detail.value[1],
      "userInfo.province": that.data.multiArray[0][e.detail.value[0]],
      "userInfo.city": that.data.multiArray[1][e.detail.value[1]]
    })
    that.httpRequet('province', that.data.multiArray[0][e.detail.value[0]], 1)
    that.httpRequet('city', that.data.multiArray[1][e.detail.value[1]], 2)
  },
  bindMultiPickerColumnChange: function (e) {
    switch (e.detail.column) {
      case 0:
        list = []
        for (var i = 0; i < that.data.objectMultiArray.length; i++) {
          if (that.data.objectMultiArray[i].parid == that.data.objectMultiArray[e.detail.value].regid) {
            list.push(that.data.objectMultiArray[i].regname)
          }
        }
        that.setData({
          "multiArray[1]": list,
          "multiIndex[0]": e.detail.value,
          "multiIndex[1]": 0
        })
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    that.setData({
      userInfo: _app.globalData.userInfo
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
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)

    that.httpRequet('birthDate', e.detail.value, 3)
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