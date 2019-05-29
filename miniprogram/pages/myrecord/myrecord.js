// pages/myrecord/myrecord.js
//index.js
var app = getApp()
//为获取openid做准备
var openid;  
//获取数据库引用
const db = wx.cloud.database({ env: 'wp-test-32ff30' }); 
//获得集合引用
const answer = db.collection('reply_questionnaire');
const soul_answer = db.collection('reply_soul_questionnaire');
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
    items:[], 
    items2:[],
    items3:[]
  },
  //将_id数据传到do_answer页面
  do_answer: function (e) {
    var index = parseInt(e.currentTarget.dataset.index);
    console.log(index);
    wx.navigateTo({
      url: '../answer/do_answer/do_answer?_id=' + this.data.items[index]._id,
    })
  },
  //将_id数据传到my_answer页面
  my_answer: function (e1) {
    var index = parseInt(e1.currentTarget.dataset.index);
    console.log(index);
    wx.navigateTo({
      url: '../answer/my_answer/my_answer?_id='+this.data.items2[index]._id
    })
    console.log(this.data.items2[index]._id);
  },
  //将_id数据传到soul_answer页面
  soul_answer:function(e2){
    var index = parseInt(e2.currentTarget.dataset.index);
    console.log(index);
    wx.navigateTo({
      url: '../answer/soul_answer/soul_answer?_id='+this.data.items3[index]._id,
    })
    console.log(this.data.items3[index]._id);
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
        //出题记录的数据读取
        answer.where({
          raiseOpenid: openid,
        })
          .orderBy('time', 'desc')
          .get().then((res2) => {
            // res2.data是查询到的记录数组
            var length = res2.data.length;
            console.log(res2.data);
            this.setData({
                   items: res2.data
            })
          });
          //做题记录的数据读取
        answer.where({
          _openid: openid,
        })
          .orderBy('time', 'desc')
          .get().then((res3) => {
            // res2.data是查询到的记录数组
            var length = res3.data.length;
            console.log(res3.data);
            this.setData({
              items2: res3.data
            })
          });
          //灵魂匹配的数据读取
        soul_answer.where({
          _openid: openid,
        })
          .orderBy('time','desc')
          .get().then((res4) => {
            // res2.data是查询到的记录数组
            var length = res4.data.length;
            console.log(res4.data);
            this.setData({
              items3: res4.data
            })
          });
      }})
  }
})