var _app = getApp()

function httpRequest(p) {
  let parameter = {
    url: _app.globalData.ServiceUrl + '/' + p.url,
    data: {},
    method: 'POST',
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    }
  }
  parameter.data = p.data;
  if (p.method != undefined) {
    parameter.method = p.method;
  }
  if (p.header != undefined) {
    parameter.header = {
      'content-type': p.header
    };
  }
  return new Promise(function (resolve, reject) {
    wx.request({
      url: parameter.url,
      data: parameter.data,
      method: parameter.method,
      // 设置请求的 header
      header: parameter.header,
      success: function (res) {
        if (res.data.return_code == 0) {
          resolve(res)
        } else {
          _app.stop()
          reject(res)
        }
      },
      fail: function (res) {
        _app.stop()
        reject(res)
      }
    })
  })
}

function requestPayment(p) {
  let payData = {}
  try {
    payData = JSON.parse(p.data)
  } catch (e) {
    payData = p.data
  }
  return new Promise(function (resolve, reject) {
    wx.requestPayment({
      timeStamp: payData.timeStamp, //时间戳
      nonceStr: payData.nonceStr, //随机字符串，长度为32个字符以下。
      package: payData.package, //统一下单接口返回的 prepay_id 参数值，提交格式如：prepay_id=*
      signType: payData.signType, //'MD5',//签名算法，暂支持 MD5
      paySign: payData.paySign,
      success: function (res) {
        resolve(res)
        console.log('123')
      },
      fail: function (res) {
        _app.stop()
        reject(res)
        console.log('4576')
      }
    })
  })
}

function navigateBack() {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      wx.navigateBack(),
        resolve()
    }, 1500)
  })
}

function ServcerFail() {
  return new Promise(function (resolve, reject) {
    wx.showToast({
      title: '服务器异常',
      icon: 'none'
    })
    setTimeout(function () {
      setTimeout(function () {
        wx.hideLoading()
      }, 1200)
    }, 1500)
  })
}
module.exports = {
  requestPayment: requestPayment,
  httpRequest: httpRequest,
  ServcerFail: ServcerFail,
  navigateBack: navigateBack
}