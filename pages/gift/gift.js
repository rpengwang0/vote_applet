var _app = getApp(),
    that,
    yh = require("../../utils/yh.js"),
    urls = require("../../utils/api.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        ani: false, //阴影层是否展示
        auth: false, //阴影层是否展示
        authLoading: false, //是否正在访问授权接口
        playerInfo: [],
        playerId: 1, 
        giftList: [{
            giftId: 1,
            gift_name: '点赞',
            gift_img: 'https://tp.guomei.work/giftimg/dianzan.jpg',
            giftPrice: 1,
            gift_ticket_num: 1
        }], 
        giftListData: [],
        gift_id: '',//礼物id
        gift_blind: 0,//盲盒
        
        num: 10,
        //num: 1,
        index: 0,
        currentIndex: 0,
        price: 0, //价格
        priceAll: 0,
        is_voice: false,
        zan_num:0,
        gifShow:false, //中奖弹框
        gifArry:[]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (e) {
        that = this;
        console.log(e);
        that.setData({
            playerId: e.pId,
            // num: wx.getStorageSync('topMax') || 1,
        });
        
        if (e.zan_num) {
            let key = 'giftList[0].gift_ticket_num'
            that.setData({
                // zan_num: e.zan_num,
                // [key]: e.zan_num
            });
        }
        that.getPlayerInfo()
        //获取礼物列表
        that.getGiftList();
    },
    getGiftList: function () {
        let that = this;
        wx.request({
            url: _app.globalData.ServiceUrl + "activity_api/getGiftList",
            data: {
                activity_id: wx.getStorageSync("activityId"),
            },
            method: 'POST',
            // 设置请求的 header
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                if (res.data.code == 1) {
                    var index = 0;
                    for (var i = 0; i < res.data.data.length; i++) {
                        res.data.data[i].index = i + 1
                    }
                    var obj = {
                        activity_id: 1,
                        gift_img: "https://tp.guomei.work/giftimg/dianzan.jpg",
                        gift_name: "点赞",
                        gift_price: 0,
                        // gift_ticket_num: that.data.zan_num,
                        gift_ticket_num: 1,
                        id: 1
                    }
                    res.data.data.unshift(obj);
                    //赋值数据
                    that.setData({
                        'giftList': res.data.data
                    })
                }
                wx.hideLoading()
            }
        })
    },
    //获取选手资料
    getPlayerInfo: function () {
        wx.request({
            url: _app.globalData.ServiceUrl + "activity_api/getPlayerInfo",
            data: {
                activity_id: wx.getStorageSync("activityId"),
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
    //为选手投票
    toPay: function (e) {
        var that = this;
        wx.showLoading({
            title: '加载中',
        })
        // 查看是否授权
        if (wx.getStorageSync('user')) {
            //如果免费的礼物
            if (that.data.currentIndex == 0) {
                //数据处理
                var pdata = _app.globalData.activityId+'|'+wx.getStorageSync("uid")+'|'+that.data.playerId+'|'+that.data.num;
                
                const Encrypt  = require('../../utils/jsencrypt.min.js');
                let cryptFirst = new Encrypt.JSEncrypt();

                cryptFirst.setPrivateKey('MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAqxUGcj8TZ+827OdLxGc56MwTALFi3XR4x0eY9Qx/gSzjqSmvLmWuwtT7YaA3RQ6xihSfqAVzGXnc+nk7YI9tcfBG6PSr5qmGpqcNCtwx28t60qVa6L/uuhe/jtcSH+iqmq9t4vx2UXTxvoFnyS+Sx11QOe7KgaCRzWhM98/Iase0GZaZHCNDUGUTmJP2nOuM+8rvTkR9fV5mrj8/K+1qLPpYftbkLZ+g3fsoxiUN0fV/jDhXulH3wgZ40T6VPw3HR1i99cLyGtrim8SGxcnlplHTGz9+TxyG5FdNtDuRTQ0RaeTUv0KdGeMNxLwMo3wrW6DzcuuCcnP/0Yh05oQrMQIDAQAB');
                var esign = cryptFirst.encrypt(pdata);
                wx.request({
                    url: urls.LoginUrl + "/ticket/activity_api/clickPlayerTicket",
                    method: 'POST',
                    // 设置请求的 header
                    header: {
                        'content-type': 'application/x-www-form-urlencoded',
                        'actoken': wx.getStorageSync("uid"),
                    },
                    data: {
                        activity_id: _app.globalData.activityId,
                        uid: wx.getStorageSync("uid"),
                        player_id: that.data.playerId,
                        num: that.data.num,
                        esign:esign,
                    },
                    success: function (res) {
                        if (res.data.code == 1) {
                            wx.hideLoading()
                            wx.showModal({
                                content: res.data.msg,
                                showCancel: false,
                                confirmText: '知道了',
                                confirmColor: '#ccab69',
                                success: function (res) {
                                    that.getPlayerInfo();
                                }
                            })
                            that.setData({

                                currentIndex: 0,
                                price: 0,
                                priceAll: 0,
                            })
                        } else {
                            wx.hideLoading()
                            wx.showModal({
                                content: res.data.msg,
                                showCancel: false,
                                confirmText: '知道了',
                                success: function (res) {
                                    that.getPlayerInfo();
                                }
                            })

                        }
                    }
                })
            } else {
                wx.request({
                    url: urls.LoginUrl + "/ticket/order/createOrder",
                    method: 'POST',
                    // 设置请求的 header
                    header: {
                        'content-type': 'application/x-www-form-urlencoded'
                    },
                    data: {
                        activity_id: _app.globalData.activityId,
                        gift_id: that.data.gift_id,
                        uid: wx.getStorageSync("uid"),
                        player_id: that.data.playerId,
                        num: that.data.num
                    },
                    success: function (res) {
                        if (res.data.code == 1) {
                            that.wechatpay(res.data.data.order_id);
                        } else {
                            wx.showModal({
                                content: res.data.msg,
                                showCancel: false,
                                confirmText: '知道了',
                                success: function (res) {
                                    console.log('知道了');
                                }
                            })
                            wx.hideLoading()
                        }
                    }
                })
            }
        } else {
            wx.hideLoading()
            wx.navigateTo({
                url: '../login/login',
            })
        }
    },
    //微信支付
    wechatpay: function (order_id) {
        var that = this;
        wx.request({
            url: urls.LoginUrl + "/ticket/order/createMiniWeChatPay2",
            method: 'POST',
            // 设置请求的 header
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: { order_id: order_id },
            success: function (res) {
                if (res.data.code == 1) {
                    wx.requestPayment({
                        'appId': res.data.data.appId,
                        'nonceStr': res.data.data.nonceStr,
                        'package': res.data.data.package,
                        'timeStamp': res.data.data.timeStamp,
                        'signType': 'MD5',
                        'paySign': res.data.data.paySign,
                        'success': function (data) {
                            wx.showToast({
                                title: "支付成功",
                                icon: 'none',
                                duration: 3000
                            })
                            wx.hideLoading();
                            that.setData({
                                num: 10,
                                currentIndex: 0,
                                price: 0,
                                priceAll: 0,
                            });
                            //如果是盲盒给抽奖
                            if(that.data.gift_blind == 1){
                                wx.request({
                                    url: urls.LoginUrl + "/ticket/order/getOrderDraw",
                                    method: 'POST',
                                    // 设置请求的 header
                                    header: {
                                        'content-type': 'application/x-www-form-urlencoded'
                                    },
                                    data: {
                                        order_sn: order_id,
                                        
                                    },
                                    success: function (res) {
                                        console.log(res)
                                        if (res.data.code == 1) {
                                            //展示抽奖结果
                                            wx.showModal({
                                                content: res.data,
                                                showCancel: false,
                                                confirmText: '知道了',
                                                success: function (res) {
                                                    console.log('知道了');
                                                }
                                            })
                                            that.setData({
                                                gifShow:true,
                                                gifArry:res.data.data
                                            })
                                            wx.hideLoading()
                                        } else {
                                            wx.showModal({
                                                content: '开奖成功，票已加',
                                                showCancel: false,
                                                confirmText: '知道了',
                                                success: function (res) {
                                                    console.log('知道了');
                                                }
                                            })
                                            wx.hideLoading()
                                        }
                                    }
                                })
                            }
                            that.getPlayerInfo();
                        
                        },
                        'fail': function (res) {
                            wx.showToast({
                                icon: "none",
                                title: '微信支付失败'
                            })
                            wx.hideLoading()
                        }
                    })
                }
            }
        })
    },
    closeGif:function(){
        that.setData({
            gifShow:false
        })
    },
    giftService: function () {
        wx.showModal({
            title: '提示',
            content: ' 1、赠送礼物是个人自愿行为。\r\n    2、为了防止恶意刷票，每个选手单日最高可获得1000票免费票。\r\n             3、承办方东方华服有最终解释权。\r\n      4、非法手段投票系统会做拉黑处理，并取消参赛资格！',
            showCancel: false
        })
    },
    /* 加数 */
    addCount: function (e) {
        var num = this.data.num;
        // 总数量+1  
        //免费礼物
        if(that.data.currentIndex==0&&num>=10){
            return false;
        }
        if (num < 1000) {
            this.data.num++;
        }
        // 将数值与状态写回  
        this.setData({
            num: this.data.num,
            priceAll: Number(this.data.num) * this.data.price
        });
    },
    /* 减数 */
    delCount: function (e) {
        var num = this.data.num;
        if (num > 1) {
            this.data.num--;
        }
        // 将数值与状态写回  
        this.setData({
            num: this.data.num,
            priceAll: Number(this.data.num) * this.data.price
        });
    },
    //选中礼物
    giftTab: function (e) {
        var that = this;
        var index = e.currentTarget.dataset.index;
        if (index == 0) {
            that.setData({
                // num: wx.getStorageSync('topMax') || 1,
                num: 10,
                currentIndex: index,
                price: that.data.giftList[index].gift_price,
                priceAll: that.data.giftList[index].gift_price,
                gift_id: that.data.giftList[index].id
            })
        } else {
            that.setData({
                num: 1,
                currentIndex: index,
                price: that.data.giftList[index].gift_price,
                priceAll: that.data.giftList[index].gift_price,
                gift_id: that.data.giftList[index].id,
                gift_blind:that.data.giftList[index].is_acciden
            });
            
        }
    },


})