// pages/reply/result/result.js

//回答问卷ID
var replyQnId;
//获取数据库引用
const db = wx.cloud.database({ env: 'wp-test-32ff30' });
// 答题集合
const replyColl = db.collection('reply_soul_questionnaire');
// 对应的出题集合
const submitColl = db.collection('soul_questionnaire');
// 出题人微信号

Page({

  /**
   * 页面的初始数据
   */
  data: {
    rate:0,
    nickname:'',
    head_photo:'',
    wx_number:0
  },

  // 查看出题者答案,跳到记录页面
  lookAnswer:function(e){

  },

  // 回到首页
  homePage: function (e) {
    wx.redirectTo({
      url: '/pages/soulMatch/soulMatch',
    })
  },

  onLoad: function (res) {
    var that = this
    replyQnId = res.replyQnId;
    this.setData({
      head_photo:res.head_photo,
      nickname:res.nickname,
      wx_number:res.wx_number
    })
    replyColl.doc(replyQnId).get()
      .then(res => {
        var questions = res.data.questions;
        // 相同率
        var rate= res.data.rate
        this.setData({
          rate:rate
        })
      })
  },
})