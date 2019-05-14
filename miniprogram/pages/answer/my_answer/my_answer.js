// pages/answer/my_answer/my_answer.js
var app = getApp()
var id;
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
    id=options._id;
    console.log(id);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    answer.doc(id).get().then((res) => {
      console.log(res.data.questions);
      this.setData({
        items: res.data.questions,
      })
    })
  },
})