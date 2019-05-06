// pages/reply/result/result.js

//回答问卷ID
var replyQnId;
//获取数据库引用
const db = wx.cloud.database({ env: 'wp-test-32ff30' });
// 答题集合
const replyColl = db.collection('reply_questionnaire');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    rate:0

  },

  // 查看出题者答案,跳到记录页面
  lookAnswer:function(e){

  },

  // 回到首页
  homePage: function (e) {
    wx.redirectTo({
      url: '/pages/entry/index',
    })
  },

  onLoad: function (res) {
    replyQnId = res.replyQnId;
    replyColl.doc(replyQnId).get()
      .then(res => {
        this.setData({
          rate:res.data.rate
        })
      })
  },
})