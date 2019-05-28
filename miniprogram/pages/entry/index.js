//index.js
const app = getApp()

Page({
  data: {
    avatarUrl: 'https://7770-wp-test-32ff30-1259082207.tcb.qcloud.la/image/questionandshare/user-unlogin.png?sign=fa83cd1525c7b0ad18c93e95b53e148a&t=1556781942',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: ''
  },
  
  enterQuestion: function () {
    wx.redirectTo({
      url: '../question/question',
    })
  },

  soulMatch: function () {
    wx.navigateTo({
      url: '../soulMatch/soulMatch',
    })
  },

  myrecord: function () {
    wx.navigateTo({
      url: '../myrecord/myrecord',
    })
  },

  showAbout: function () {
    wx.showModal({
      title: '关于我们',
      content: "我们是南开软件的学生，这是一款我们制作的测试好友默契度并且可以匹配到与你相似的人的小程序。玩法很简单，先出题然后转发给好友答题或者点击灵魂匹配搜索和你相似的人就可以啦！开始出题吧！",
      showCancel: false
    })
  },

  onLoad: function () {

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
              //console.log(res.userInfo)
            }
          })
        }
      }
    })
  },

  onGetUserInfo: function (e) {
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },

})
