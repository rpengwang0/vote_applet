var tip = require("../../utils/tip.js"),
  gets = require("../../utils/get.js"),
  yh = require("../../utils/yh.js"),
  _app = getApp(),
  that;
Page({
  data: {
    userInfo: {},
    ServiceUrl: '',
    sponsorArray: [],
    pageNumber: 1, //当前页
    pageSize: 10, //每页显示数据
    loading: true, //是否显示正在努力为你加载更多动画
    HasNextPage: false, //是否是最后一页
  },
  onLoad: function () {
    that = this
    var interval = setInterval(function () {
      if (_app.globalData.has) {
        clearInterval(interval)
        that.setData({
          ServiceUrl: _app.globalData.ServiceUrl,
          accountAuth: _app.globalData.accountAuth == 1
        })
        that.getCollectionSponsor() //获取用户关注的主办方
      }
    }, 100)
  },
  getCollectionSponsor: function () {
    yh.httpRequest({
      url: 'Account.ashx',
      data: {
        Function: '5',
        pageNumber: that.data.pageNumber,
        pageSize: that.data.pageSize,
        openId:_app.globalData.openId
      }
    }).then(res => {
      let data = res.data
      console.log(data)
      that.setData({
        HasNextPage: data.HasNextPage,
        pageNumber: that.data.pageNumber + 1,
        sponsorArray: that.data.sponsorArray.length == 0 ? data.sponsorArray : that.data.sponsorArray.concat(data.sponsorArray)
      }, function () {
        that.setData({
          loading: false
        })
      })
    }).catch(error => {
      tip.showToast('初始化失败')
    })
  },
  goDetail:function(e){
    console.log(that.data.sponsorArray[e.currentTarget.dataset.index].collectionID)
  },
  goPost: function () {
    wx.switchTab({
      url: '/pages/activityFront/activityFront',
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
    that.getCollectionSponsor()
  }
})