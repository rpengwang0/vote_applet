var ToastIcon = ['success', 'loading', 'none']
//微信小程序showToast接口
function showToast(title, icon) {

  return new Promise(function (resolve, reject) {
    if (icon == undefined || (icon != 0 && icon != 1 && icon != 2))
      icon = 2
    wx.showToast({
      title: title,
      icon: ToastIcon[icon]
    })
    resolve()
  })
}
module.exports = {
  showToast: showToast
} 