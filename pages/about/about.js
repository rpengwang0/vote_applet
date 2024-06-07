var ServiceUrl = wx.getStorageSync("ServiceUrl")
var _app = getApp()
Page({
  data: {
    setting: {}
  },
  onLoad: function (options) {
    // 生命周期函数--监听页面加载

  },
  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成

  },
  onShow: function () {
  },
  callPhone: function () {
    var that = this;
    wx.makePhoneCall({//客服电话
      phoneNumber: '10086',
      success: function () {
        console.log('成功')
      }, fail: function () {
        console.log('失败')
      }, complete: function () {
        console.log("请求complete啊")
      }
    })
  },
  websit: function () {
    var that = this
    wx.navigateTo({//使用说明
      url: '../website/website?website=http://www.itechclub.cn'
    })
  },
  onHide: function () {
    // 生命周期函数--监听页面隐藏

  },
  onUnload: function () {
    // 生命周期函数--监听页面卸载

  },
  onPullDownRefresh: function () {
    // 页面相关事件处理函数--监听用户下拉动作

  },
  onReachBottom: function () {
    // 页面上拉触底事件的处理函数

  },
  onShareAppMessage: function () {
    // 用户点击右上角分享
    return {
      title: '关于我们',
      desc: '你想了解更多关于我们的信息吗~', // 分享描述
      path: 'pages/about/about' // 分享路径
    }
  }
})