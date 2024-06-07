//app.js
App({
  onLaunch: function(e) {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        let that = this
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          
        } else {
          wx.redirectTo({
            url: '/pages/errorInfo/errorInfo',
          })
        }
      },
      fail: function(e) {
        wx.redirectTo({
          url: '/pages/errorInfo/errorInfo',
        })
      }
    })
    // 获取用户信息
    wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框

          }
        }
      }),
      wx.getSystemInfo({
        success: function(res) {
          var kScreenW = res.windowWidth / 375
          var kScreenH = res.windowHeight / 603
          wx.setStorageSync('windowWidth', res.windowWidth)
          wx.setStorageSync('windowHeight', res.windowHeight)
          wx.setStorageSync('kScreenW', kScreenW)
          wx.setStorageSync('kScreenH', kScreenH)
        }
      })
  },
  stop: function() {
    wx.hideNavigationBarLoading(); //隐藏导航条加载动画。
    wx.hideLoading()
    wx.stopPullDownRefresh(); //停止当前页面下拉刷新。
  },
  globalData: {
    has: false, //是否初始化完成
    //活动id
    activityId:1,
    accountAuth: 1, //是否授权 1已授权 2未授权 192.168.0.105
    ServiceUrl:'https://tp2.guomei.work/ticket/',
    //   ServiceUrl: 'http://dfmy.cn/ticket/',
    scene: '',
    openId: '', //该用户openId
    userInfo: {}
  },
  getFullUrl: function(){
      const pages = getCurrentPages()
      const currentPage = pages[pages.length - 1]
      const url = currentPage.route
      const options = currentPage.options
      let urlWithArgs = `/${url}?`
      for (let key in options) {
          const value = options[key]
          urlWithArgs += `${key}=${value}&`
      }
      return urlWithArgs = urlWithArgs.substring(0, urlWithArgs.length - 1);
  }
})