// pages/myrecord/myrecord.js
//index.js
var app = getApp()
//为获取openid做准备
var openid;  
//获取数据库引用
const db = wx.cloud.database({ env: 'wp-test-32ff30' }); 
//获得集合引用
const answer = db.collection('reply_questionnaire');
//获取应用实例  

Page({
  data: {
    /** 
        * 页面配置 
        */
    winWidth: 0,
    winHeight: 0,
    currentTab: 0,
    currentSelect: 1,
    items:[] 
  },
  answer: function () {
    wx.redirectTo({
      url: '../answer/answer',
    })
  },
  onLoad: function () {
    var that = this;

    /** 
     * 获取系统信息 
     */
    wx.getSystemInfo({

      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }

    });
  },
  /** 
     * 滑动切换tab 
     */
  bindChange: function (e) {

    var that = this;
    that.setData({ currentTab: e.detail.current });

  },
  /** 
   * 点击tab切换 
   */
  swichNav: function (e) {

    var that = this;

    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },


  onShow:function(){
    wx.pageScrollTo({
      scrollTop: 100,
      duration: 300
    })
    wx.cloud.callFunction({
      name: 'getOpenid',
      complete: res => {
        // 获取openid
        openid = res.result.openId;
        console.log('****' + openid);
        answer.where({
          _openid: openid,
        })
          .get().then((res2) => {
            // res2.data是查询到的记录数组
            var length = res2.data.length;
            console.log(res2.data);
            this.setData({
                   items: res2.data
            })
          });
      }})
  },


})