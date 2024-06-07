//logs.js
var urls = require("../../utils/api.js");
Page({
  data: {
    userInfo: '',
    loading: false,
    code: ''
  },
  onLoad: function(e) {
    var that = this;
  },
  /**
   * 获取用户信息接口后的处理逻辑
   */
  getUserInfo: function(e) {
    var that = this;
    //最新的授权
    if (e.detail.userInfo) {
      var userInfo = e.detail.userInfo;
      // that.setData({
      //   loading: true
      // })
      wx.login({
        success: function(res) {
          var code = res.code;
          wx.request({
            url: urls.LoginUrl + "/ticket/wechat/wechatMinLogin",
            method: 'POST',
            data: {
              code: code,
              country: userInfo.country,
              avatarUrl: userInfo.avatarUrl,
              province: userInfo.province,
              city: userInfo.city,
              avatarUrl: userInfo.avatarUrl,
              gender: userInfo.gender,
              nickName: userInfo.nickName,
              iv: e.detail.iv,
              encryptedData: e.detail.encryptedData
            },
            success: function(res) {
              if (res.data.code == 1) {
                wx.showToast({
                  title: '授权成功',
                  icon: 'success',
                  duration: 2000
                });
                wx.setStorageSync('user', true);
                wx.setStorageSync('userInfo', userInfo);
                wx.setStorageSync('uid', res.data.data.uid);
                wx.navigateBack()
                // if (that.data.trip_flag==1){
                //   
                // }else{
                //   wx.reLaunch({
                //     url: "../index/index"
                //   })
                // }
               
                // that.setData({
                //   loading: false
                // })

              } else if (res.data.code == 0) {
                wx.showModal({
                  content: "请重新授权",
                  showCancel: false,
                  confirmText: '知道了',
                  success: function(res) {
                    wx.reLaunch({
                      url: "../activityFront/activityFront"
                    })
                  }
                })
                
              } else {
                wx.reLaunch({
                  url: "../activityFront/activityFront"
                })
              }
              // that.setData({
              //   loading: false
              // })
            }
          })
        }
      })
    } else {
      wx.showModal({
        content: "您已拒绝授权，将会影响您的投票",
        showCancel: false,
        confirmText: '知道了',
        success: function(res) {
          wx.reLaunch({
            url: "../activityFront/activityFront"
          })
        }
      })
    }


  },

  onShow: function() {

  }

})