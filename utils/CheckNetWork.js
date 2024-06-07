//检查网络状态
function checkNetWorkStatu() {
  var statu = true
  wx.getNetworkType({
    success: function (res) {
      var networkType = res.networkType // 返回网络类型2g，3g，4g，wifi, none, unknown
      if (networkType == "none") {
        //没有网络连接
        wx.showModal({
          title: '提示',
          content: '没有网络连接,请检查您的网络设置',
          showCancel: false,
          // success: function(res) {
          //   if (res.confirm) {
          //     //返回res.confirm为true时，表示用户点击确定按钮
          //   }
          // }
        })
        statu = false
      } else if (networkType == "unknown") {
        //未知的网络类型
        wx.showModal({
          title: '提示',
          content: '未知的网络类型,请检查您的网络设置',
          showCancel: false,
          // success: function(res) {
          //   if (res.confirm) {
          //     //返回res.confirm为true时，表示用户点击确定按钮
          //
          //   }
          // }
        })
        statu = false
      }
    }
  })
  return statu
}
const CheckToken = sf=> {
  var token = wx.getStorageSync('token') || ''
  var AccountNumber = wx.getStorageSync('AccountNumber') || ''
  if (token.length == 0 || AccountNumber.length == 0) {
    if (sf == false) {
      wx.showModal({
        title: '提示',
        content: '尊敬的用户您好，检测到您尚未登录，需要立刻去登录！',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../Register/Register'
            })
          }
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '尊敬的用户您好，检测到您尚未登录，是否立刻去登录？',
        showCancel: sf,
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../Register/Register'
            })
          }
        }
      })
    }
    return false
  } else {
    return true
  }
}
function CheckLocation() {
  var latitude = wx.getStorageSync("latitude")
  var longitude = wx.getStorageSync("longitude")
  if (latitude == '' || longitude == '') {
    return false
  } else {
    return true
  }
}
module.exports = {
  checkNetWorkStatu: checkNetWorkStatu,
  CheckLocation: CheckLocation,//看下定位的经纬度还有吗
  CheckToken: CheckToken//检测下登录状态
} 