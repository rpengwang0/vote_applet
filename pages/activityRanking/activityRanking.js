var tip = require("../../utils/tip.js")
var _app = getApp()
var that,
  yh = require("../../utils/yh.js")
Page({
  data: {
    rankingArray: {}, //活动信息
    ServiceUrl: '',
    userList: [],
    //选手排名列表
    playerArray: [],
  },
  onLoad: function (e) {
    that = this
   
    that.getActivityRanking()
   
  },
  getActivityRanking: function () {
    wx.request({
      url: _app.globalData.ServiceUrl + "activity_api/getActivityPlayerList",
      data: {
        activity_id: _app.globalData.activityId,
        order: 1,
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
            'playerArray': res.data.data
          })
        }

        wx.hideLoading()
      },
      fail: function (e) {
        wx.hideLoading()
        tip.showToast('获取失败！', 1)
        wx.navigateBack()
      }
    })
  }
})