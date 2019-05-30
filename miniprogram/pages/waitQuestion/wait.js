// pages/wait/wait.js
const app = getApp()
//获取数据库引用
const db = wx.cloud.database({ env: 'wp-test-32ff3' });
//获取集合引用
const questionColl = db.collection('question');
//问卷集合的题目总数
var question_number;

Page({

  data: {

  },

  onLoad: function (res) {
    //获取题目总数量
    questionColl.count().then(res => {
      question_number = res.total
      wx.redirectTo({
        url: '/pages/question/question?question_number=' + question_number,
      });
    })
  },

  onShow: function () {
  },


})