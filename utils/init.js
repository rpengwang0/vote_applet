var _app = getApp()
function Init(that){
  that.setData({
    ServiceUrl: _app.globalData.ServiceUrl
  })
}
function InitSowingImg(that, value) {
  wx.request({
    url: _app.globalData.ServiceUrl + "/Content/Base.ashx",
    data: {
      Function: '1',
      currentCode: value, //当前页面代码 首页：0 活动页1 商城页2
    },
    method: 'POST',
    // 设置请求的 header
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    success: function(res) {
      if (res.data.return_code == 0) {
        that.setData({
          prictureUrl: _app.globalData.prictureUrl,
          imgUrls: res.data.data
        })
      }else{
        wx.showToast({
          title: '轮播图初始化失败',
          icon: 'none'
        })
      }
    },
    fail: function(e) {
      wx.showToast({
        title: '轮播图初始化失败',
        icon: 'none'
      })
    }
  })
}
function InitNotice(that, value) {
  wx.request({
    url: "https://xcx.haborv.com/Content/Notice.ashx",
    data: {
      Function: '1',
      currentCode: value, //当前页面代码 首页：0 活动页1 商城页2
    },
    method: 'POST',
    // 设置请求的 header
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {
      if (res.data.return_code == 0) {
        that.setData({
          notice: res.data.data
        })
      }
    },
    fail: function (e) {
      wx.showToast({
        title: '通知消息初始化失败',
        icon: 'none'
      })
    }
  })
}
module.exports = {
  InitSowingImg: InitSowingImg,
  InitNotice: InitNotice,
  Init:Init
}