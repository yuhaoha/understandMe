// pages/test/test.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  onLoad: function (options) {

      

  },

  enterindex: function(options)
  {
    wx.navigateTo({
      url: '/pages/entry/index',
    })
  },

  get_data: function (options) {
    const db = wx.cloud.database({ env: 'wp-test-32ff3' });
    //获取集合引用
    const questionColl = db.collection('questionnaire');
    questionColl.add({
      //插入 data字段表示需新增的JSON数据
      data: {
        questions: 1,
        nickName: 2,
        avatarUrl: 3,
        time: 4
      }
    })
  }

})