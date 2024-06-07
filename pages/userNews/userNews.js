var tip = require("../../utils/tip.js")
var _app = getApp()
var that
Page({
  data: {
    Tab: 1,
    bool: false,
    activityArray: [],
    ServiceUrl: '',
    prictureUrl: '',
    pageNumber: 1, //当前页
    pageSize: 100, //每页显示数据
    loading: false, //是否显示正在努力为你加载更多动画
    lastPage: false, //是否是最后一页
    goodsList: [],
    activityList: [],
    forumCollectionList: [],
  }, // 0：待支付  1待审核  2已通过  3待评价  4已拒绝  5已结束
  onLoad: function(res) {
    that = this
    
  },
  swichNav: function(res) {
    let a = res.currentTarget.dataset.current
    if (res.currentTarget.dataset.current == that.data.Tab) {
      return;
    } else {
      if (a == 1) {
        if (that.data.goodsList.length > 0) {
          that.setData({
            Tab: res.currentTarget.dataset.current,
          })
          return
        }
      }
      if (a == 2) {
        if (that.data.activityList.length > 0) {
          that.setData({
            Tab: res.currentTarget.dataset.current,
          })
          return
        }
      }
      if (a == 3) {
        if (that.data.forumCollectionList.length > 0) {
          that.setData({
            Tab: res.currentTarget.dataset.current,
          })
          return
        }
      }
      that.setData({
        Tab: res.currentTarget.dataset.current,
        pageNumber: 1
      })
      that.loadData()
    }
  },
  loadData: function() {
    
  }
})