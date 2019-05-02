// miniprogram/pages/soulMatch/soulMatch.js
//获取数据库引用
const db = wx.cloud.database({ env: 'wp-test-32ff30' });
//获取集合引用
const question_naires = db.collection('soul_questionnaire');
var question_naire_temp

Page({

  /**
   * 页面的初始数据
   */
  data: {
    question_naire: [{_openid:1234234}]
  },
//出题进入出题页面
  submit_question: function () {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              wx.navigateTo({
                url: '../soulQuestion/soul_question?username=' + res.userInfo.nickName + '&gender=' + res.userInfo.gender + '&avatarUrl=' + res.userInfo.avatarUrl
              })
            }
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (res) {
    var that = this
    question_naires.get({
      success: function(res){
        const number= res.data.length
        that.setData({question_naire:res.data})
      },
      fail:function(res){
        console.log(res.data)
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})