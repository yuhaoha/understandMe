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

  onShareAppMessage: function (res) {
    if (res.from == 'button') {
      console.log('点击分享按钮触发');
    }
    return {
      // 转发时显示的标题
      title: '有人@我 你懂我吗？',
      // 点击的人显示的页面及参数
      path: '/pages/entry/index',
      // 转发时显示的图片
      imageUrl: 'https://7770-wp-test-32ff30-1259082207.tcb.qcloud.la/image/share/share_background.jpg?sign=63963cb62989260ccf3625135dddac23&t=1559199977',
      success: function (res) {
        // 分享成功
        console.log('分享成功')
        console.log(res.shareTickets[0])
        wx.getShareInfo({
          shareTicket: res.shareTickets[0],
          success: function (res) { console.log(res) },
          fail: function (res) { console.log(res) },
          complete: function (res) { console.log(res) }
        })
      },
      fail: function (res) {
        // 分享失败
        console.log('分享失败')
        console.log(res)
      }
    }
  }
  
})