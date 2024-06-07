var tip = require("../../utils/tip.js"),
  checkNetWork = require("../../utils/CheckNetWork.js"),
  check = require("../../utils/check.js"),
  urls = require("../../utils/api.js"),
  _app = getApp(),
  that,
  yh = require("../../utils/yh.js");
const ctx = wx.createCanvasContext('shareCanvas')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ani: false, //阴影层是否展示
    auth: false, //阴影层是否展示
    activityId:'',
    //选手资料
    playerInfo: [],
    //选手id
    playerId: 1,
    imagePath: "",
    imageEwm: "../../images/login.jpg",
    maskHidden: false,
    canvasWidth:0,
    canvasHeight:0,
    canvasLeft:0,
    windowWidth:0,
    windowHeight:0,
    totalHeight:0,
    canvasScale: 1.0,
      zan_num: 0,
      history: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(e) {
    that = this 
    
    this.x = -100;
    //加载选手信息
    that.setData({
      playerId: e.player_id
    })
    if(e.back) {
        that.setData({
            back:e.back
        });
    }
    //生成二维码必须在之后
    that.Imgewm();
    that.getPlayerInfo();
   
    wx: wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowWidth: res.windowWidth,
          windowHeight: res.windowHeight
        })
      }
    })
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },
  
  //获取选手资料
  getPlayerInfo: function () {
    wx.request({
      url: _app.globalData.ServiceUrl + "activity_api/getPlayerInfo",
      data: {
        player_id: that.data.playerId,
      },
      method: 'POST',
      // 设置请求的 header
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data.code == 1) {
          //赋值数据
          that.setData({
            'playerInfo': res.data.data
          })
          //设置全局的活动id
          wx.setStorageSync("activityId", res.data.data.activity_id);

          that.setData({
            activityId: res.data.data.activity_id
          })

          //获取活动信息
          that.activityInfo(res.data.data.activity_id);
        }

        wx.hideLoading()
      },
      fail: function (e) {
        wx.hideLoading()
        tip.showToast('保存失败！', 1)
        wx.navigateBack()
      }
    })
  },
  onShareTimeline: function () {
    var that = this;
    var _title = wx.getStorageSync("title");
    var title = "我是" + that.data.playerInfo.player_num + "号" + that.data.playerInfo.player_name + ',在参加' + _title + '，请多多支持！';
    let app = getApp();
    let urlWithArgs = app.getFullUrl();


    return {
        title: title,      
        imageUrl: that.data.playerInfo.player_head_img,
        query: 'player_id='+that.data.playerInfo.player_id // 分享路径
    }
  },
  previewImage: function (e) {
    var that = this;
    wx.previewImage({
      current: that.data.playerInfo.player_person_img, // 当前显示图片的http链接
      urls: [that.data.playerInfo.player_person_img] // 需要预览的图片http链接列表
    })
  },
  giftTap: function () {
    wx.navigateTo({
      url: '/pages/gift/gift',
    })
  },
  goActivityIndex: function() {
    let pages = getCurrentPages(); //当前页面
    if (pages.length == 1) {
      wx.redirectTo({
        url: '/pages/vote/vote',
      })
    } else {
      wx.navigateBack()
    }
  },

  //跳转投票
  toupiaoTap:function(e){
      let that = this;
    // 送礼物页面
    wx.navigateTo({
      url: '/pages/gift/gift?pId=' + that.data.playerId + '&zan_num=' + that.data.zan_num
    });
  },
  authUserInfo_show: function () {
    that.setData({
      auth: true,
      ani: true
    })
  },
  authUserInfo_hide: function () {
    that.setData({
      ani: false
    })
  },
  bindGetUserInfo: function (e) {
    if (that.data.authLoading) {
      return
    }
    that.setData({
      authLoading: true
    })
    if (e.detail.userInfo) {
      let userInfo = JSON.stringify(e.detail.userInfo)
      console.log(e.detail.userInfo)
    } else {
      that.setData({
        authLoading: false
      })
      console.log('用户点击了拒绝授权')
    }
  },

  clickSave:function(){
     var that = this;
    //that.createNewImg();
  },

  getImage: function (url) {
    return new Promise((resolve, reject) => {
      wx.getImageInfo({
        src: url,
        success: function (res) {
          resolve(res)
        },
        fail: function () {
          reject("")
        }
      })
    })
  },
  getImageAll: function (image_src) {
    let that = this;
    var all = [];
    image_src.map(function (item) {
      all.push(that.getImage(item))
    })
    return Promise.all(all)
  },
  
  //将canvas转换为图片保存到本地，然后将图片路径传给image图片的src
  createNewImg: function () {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    var path = that.data.playerInfo.player_head_img;
    var qr = that.data.imageEwm;
    path=path.replace("http://", "https://");
    this.getImageAll([path,qr]).then((res) => {
      let bg = res[0];
        console.log('sdfsd',bg);
      let qrcode = res[1];
      this.setData({
        canvasWidth: bg.width + 'px',
        canvasHeight: bg.height + 'px',
        canvasLeft: `-${bg.width + 100}px`,
      })
      var context = wx.createCanvasContext('mycanvas');  

      context.setFillStyle("#ffffff")
      context.fillRect(0, 0, that.data.windowWidth, that.data.windowHeight - 100)
      context.drawImage(bg.path, 0, 100, (that.data.windowWidth), (that.data.windowHeight - 250)); 
      var conw = bg.width*0.8,conh=bg.height*0.8;
      //context.drawImage(bg.path, 200, 100,conw,conh );
      // 在刚刚裁剪的园上画图
      context.drawImage(qrcode.path, that.data.windowWidth - 102, that.data.windowHeight - 230, 82, 90); // 二维码

      var title = wx.getStorageSync("title");
      var name = that.data.playerInfo.player_name;
      var text = "我是" + that.data.playerInfo.player_num + "号"+ that.data.playerInfo.player_name + ',在参加' + title + '，请多多支持！';
      //绘制名字
      context.setFontSize(20);
      context.setFillStyle('#000');
      context.setTextAlign('center');
      context.fillText(name, parseInt(that.data.windowWidth / 2), 35);
      context.stroke();
      //绘制文字
      context.setFontSize(14);
      context.setFillStyle('#999');
      context.setTextAlign("left"),
      context.fillText(text.substr(0, 25), 40, 64, bg.width-80),
      context.fillText(text.substr(25, 20), 40, 86, bg.width - 80), 
      context.stroke();
      //绘制图片名字
      context.setFontSize(18);
      context.setFillStyle('#ffffff');
      context.setTextAlign('left');
      for (var u = 0; u < name.length; u++){
        context.fillText(name.substr(u, 1), 50, 20 * (u + 1) + 140, 18);
      }
      //绘制二维码名字
      context.stroke();
      context.setFontSize(11),
      context.setFillStyle("#999999"),
      context.setTextAlign("right"),
        context.fillText("请识别二维码", that.data.windowWidth - 30, that.data.windowHeight - 120), 
      context.stroke();

      context.draw();
      setTimeout(function () {
        wx.hideLoading()
        that.save()
      },2000)
      
    })
  },
  //保存
  save: function () {
    wx.canvasToTempFilePath({//canvas 生成图片 生成临时路径
      canvasId: 'mycanvas',
      success: function (res) {
        var tempFilePath = res.tempFilePath;
        that.setData({
          imagePath: tempFilePath,
          canvasHidden: true
        });
       
      }
    })
  },


  //点击保存到相册
  baocun: function () {
    var that = this
    wx.saveImageToPhotosAlbum({
      filePath: that.data.imagePath,
      success(res) {
        wx.showModal({
          content: '图片已保存到相册，赶紧晒一下吧~',
          showCancel: false,
          confirmText: '好的',
          confirmColor: '#333',
          success: function (res) {
            if (res.confirm) {
              /* 该隐藏的隐藏 */
              that.setData({
                maskHidden: false
              })
            }
          }, fail: function (res) {
            console.log(11111)
          }
        })
      },
      fail:function(err){
        if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
          console.log("当初用户拒绝，再次发起授权")
          wx.openSetting({
            success(settingdata) {
              console.log(settingdata)
              if (settingdata.authSetting['scope.writePhotosAlbum']) {
                wx.showToast({
                  title: '请再次点击保存图片按钮',
                  duration:2000
                })
              } else {
                console.log('获取权限失败，给出不给权限就无法正常使用的提示')
                wx.showToast({
                  title: '获取权限失败',
                  duration: 2000
                })
              }
            }
          })
        }
      }
    })
  },
  //点击生成
  formSubmit: function (e) {
    
    
    //验证授权
    wx.getSetting({
      success(res) {
        console.log(res.authSetting['scope.writePhotosAlbum']);
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              that.setData({
                maskHidden: false
              });
              wx.showToast({
                title: '图片生成中...',
                icon: 'loading',
                duration: 1000
              });
              setTimeout(function () {
                wx.hideToast()
                that.createNewImg();
                that.setData({
                  maskHidden: true
                });
              }, 1000)
            }
          })
        }else{
          that.setData({
            maskHidden: false
          });
          wx.showToast({
            title: '图片生成中...',
            icon: 'loading',
            duration: 1000
          });
          setTimeout(function () {
            wx.hideToast()
            that.createNewImg();
            that.setData({
              maskHidden: true
            });
          }, 1000)
        }
      }
    })
    
  },

 
//二维码
Imgewm:function(){
  var that = this;
  wx.request({
    url: urls.LoginUrl + "/ticket/wechat/getPlayerQrCode",
    method: 'POST',
    // 设置请求的 header
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    data: {
        player_id: that.data.playerId,
        home_url: that.data.back ? that.data.back : ''
    },
    success:function(res){
       if(res.data.code==1){
         that.setData({
           imageEwm: res.data.data.img_url
         })
       }
    }
  })
},
    homeback: function () {
        let url = this.data.back ? decodeURIComponent(this.data.back) : '/pages/activityFront/activityFront';
        wx.redirectTo({
            url: url,
        })
    },

    onShareAppMessage: function () {
        var that = this;
        var _title = wx.getStorageSync("title");
        var title = "我是" + that.data.playerInfo.player_num + "号" + that.data.playerInfo.player_name + ',在参加' + _title + '，请多多支持！';
        let app = getApp();
        let urlWithArgs = app.getFullUrl();
        console.log(urlWithArgs);
        return {
            title: title,
            desc: '快来支持我吧!', // 分享描述
            imageUrl: that.data.playerInfo.player_head_img,
            path: urlWithArgs // 分享路径
        }
    },

  //获取活动信息
  activityInfo: function (activity_id) {
    var that = this;
    wx.request({
      url: urls.LoginUrl + "/ticket/activity_api/getActivityInfo",
      method: 'POST',
      // 设置请求的 header
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: { activity_id: activity_id },
      success: function (res) {
        if (res.data.code == 1) {

          //设置全局缓存 2行 王志鹏 修改 2019-12-14
          wx.setStorageSync("title", res.data.data.activity_title);
          wx.setStorageSync("activityId", activity_id);
          wx.setStorageSync("topMax", res.data.data.person_day_user_num);
          that.setData({
            zan_num: res.data.data.person_day_user_num
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          });
        }
      }
    })
  },
//关闭
  close:function(){
    var that = this;
    that.setData({
      maskHidden: false
    })
  },
  share:function(){
    var that = this;
    that.qrImg();
  },
 qrImg:function(){
   var that = this;
   wx.request({
     url: urls.LoginUrl + "/ticket/wechat/getInviteImg",
     method: 'POST',
     // 设置请求的 header
     header: {
       'content-type': 'application/x-www-form-urlencoded'
     },
     data: {
       player_id: that.data.playerId,
       activity_id: _app.globalData.activityId,
     },
     success: function (res) {
       if (res.data.code == 1) {
         that.setData({
           imagePath: res.data.data.img_url,
           maskHidden: true
         })
       }
     }
   })
 }
})