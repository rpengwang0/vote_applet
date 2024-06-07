var urls = require("../../utils/api.js"),
Wxmlify = require('../../wxmlify/wxmlify'),
  _app = getApp();

Page({
  data: {
    prizeInfo:''
  },
  onLoad: function(res) {
    var that = this;
    that.prizeInfo();
  },
  prizeInfo:function(){
    var that = this;
    wx.request({
      url: urls.LoginUrl + "/ticket/activity_api/getActivityCompany",
      method: 'POST',
      // 设置请求的 header
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: { activity_id: _app.globalData.activityId },
      success:function(res){
        var html = res.data.data;
        var wxmlify = new Wxmlify(html, that, {
          // new 一个 wxmlify 实例就好了
          preserveStyles: ['fontSize', 'backgroundColor', 'color'],
          dataKey: 'nodes',//解析后数据在页面data中的key类型：string
          disableImagePreivew: false//禁用图片点击预览默认：false
        });
        that.setData({
          prizeInfo:res.data.data
        })
      }
    })
  }
})