var that,
  yh = require("../../utils/yh.js"),
  tip = require("../../utils/tip.js"),
  _app = getApp();
Page({
  data: {
    Tab: 1,
    pageNumber: 1, //当前页  因为页面刚加载时已经有1页数据，所以从2开始
    pageSize: 10, //每页显示数据
    loading: false, //是否显示正在努力为你加载更多动画
    hasNextPage: false,
    recordArray: []
  },
  onLoad: function() {
    that = this
    
  },
  swichNav: function(res) {
    if (res.currentTarget.dataset.current == that.data.Tab) {
      return;
    } else {
      that.setData({
        Tab: res.currentTarget.dataset.current,
        pageNumber: 1, //修改查询的东西了
        recordArray: [], 
        // loading: true
      }, function () {
        //执行查询接口
      })
    }
  },
  onReachBottom: function() {
    if (that.data.loading) {
      return
    }
    if (!that.data.HasNextPage) {
      wx.showToast({
        title: '已经到最底部了~',
        icon: 'none'
      })
      return
    }
    that.setData({
      loading: true
    })
  },
})