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
    rate:0,
    raiseNickName:'',
    raiseAvatarUrl:'https://7770-wp-test-32ff30-1259082207.tcb.qcloud.la/image/questionandshare/user-unlogin.png?sign=fa83cd1525c7b0ad18c93e95b53e148a&t=1556781942'
  },

  // 查看出题者答案,跳到记录页面
  lookAnswer:function(e){
    wx.navigateTo({
      url: '/pages/reply/answer/answer?replyQnId=' + replyQnId,
    })
  },

  // 跳转到主页
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
          rate:res.data.rate,
          raiseAvatarUrl:res.data.raiseAvatarUrl,
          raiseNickName:res.data.raiseNickName
        })
      })
  },
})