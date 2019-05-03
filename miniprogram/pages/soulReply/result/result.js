// pages/reply/result/result.js

//回答问卷ID
var replyQnId;
//获取数据库引用
const db = wx.cloud.database({ env: 'wp-test-32ff30' });
// 答题集合
const replyColl = db.collection('reply_soul_questionnaire');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    rate:0,
    nickname:'',
    head_photo:''
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
    replyQnId = res.replyQnId;
    this.setData({
      head_photo:res.head_photo,
      nickname:res.nickname
    })
    replyColl.doc(replyQnId).get()
      .then(res => {
        var questions = res.data.questions;
        // 相同率
        var rate=0;
        for(var i =0;i<10;i++)
        {
          if(questions[i]['choice']==questions[i]['myChoice'])
          {
            rate = rate + 10;
          }
        }
        console.log('rate:'+rate);
        this.setData({
          rate:rate
        })
      })
  },
})