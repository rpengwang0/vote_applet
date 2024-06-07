var that;
var _app = getApp();
var urls = require("../../utils/api.js");
// var Wxmlify = require('../../wxmlify/wxmlify')
Page({
  data: {
    tipInfo: '',
    activity_id:''
  },
  onLoad: function(e) {
    this.detailInfo();
  },

  detailInfo:function(){
    var that = this;
    wx.request({
      url: urls.LoginUrl + "/ticket/activity_api/getActivityDetail",
      method: 'POST',
      // 设置请求的 header
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: { activity_id: _app.globalData.activityId },
      success:function(res){
        console.log(res);
        var html = res.data.data;
        var wxmlify = new Wxmlify(html, that, {
          // new 一个 wxmlify 实例就好了
          preserveStyles: ['fontSize', 'backgroundColor', 'color'],
          dataKey: 'nodes',//解析后数据在页面data中的key类型：string
          disableImagePreivew: false//禁用图片点击预览默认：false
        });
        
        if(res.data.code==1){
          that.setData({
            tipInfo:res.data.data
          })
          console.log(that.data.tipInfo);
        }
      }
    })
  }

})