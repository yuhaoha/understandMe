// pages/reply/answer/answer.js

var app = getApp()
// 答题问卷id
var replyQnId;
//获取数据库引用
const db = wx.cloud.database({ env: 'wp-test-32ff30' });
//获得集合引用
const answer = db.collection('reply_questionnaire');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    winWidth: 0,
    winHeight: 0,
    currentTab: 0,
    currentSelect: 1,
    items: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取传来的答卷id
    replyQnId = options.replyQnId;
    answer.doc(replyQnId).get().then((res) => {
      this.setData({
        items: res.data.questions,
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