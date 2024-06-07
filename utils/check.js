var _app = getApp()
//检查网络状态
function IsNullOrWhiteSpace(value) {
  if (value == undefined || value == null) {
    return true
  }
  value = value.replace(' ', '')
  if (value == '' || value == 'undefined') {
    return true
  } else {
    return false
  }
}
const CheckPhone = phoneMobile => {
  var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
  if (phoneMobile.length === 0) {
    wx.showToast({
      title: '请输入正确的手机号码！',
      icon: 'none',
      duration: 1500
    });
    return false;
  } else if (phoneMobile.length != 11) {
    wx.showToast({
      title: '请输入正确的手机号码！',
      icon: 'none',
      duration: 1500
    });
    return false;
  } else if (!myreg.test(phoneMobile)) {
    wx.showToast({
      title: '请输入正确的手机号码！',
      icon: 'none',
      duration: 1500
    });
    return false;
  }
  return true;
}

function CheckLogin() {
  // if (_app.globalData.auth == 2) {
  //   wx.showToast({
  //     title: '您还未授权，请先授权',
  //     icon: 'none'
  //   })
  //   return false
  // } 
  if (_app.globalData.accountNumber == '') {
    wx.showToast({
      title: '您还未登录，请先登录',
      icon: 'none'
    })
    return false
  }
  return true
}

function CheckAuth() {
  if (_app.globalData.auth == 2) {
    wx.showToast({
      title: '您还未授权，请先授权',
      icon: 'none'
    })
    return false
  }
  return true
}
module.exports = {
  CheckAuth: CheckAuth,
  CheckLogin: CheckLogin,
  IsNullOrWhiteSpace: IsNullOrWhiteSpace,
  CheckPhone: CheckPhone
}