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

})