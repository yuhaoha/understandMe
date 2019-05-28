//index.js

Page({
  data: {
    avatarUrl: 'https://7770-wp-test-32ff30-1259082207.tcb.qcloud.la/image/questionandshare/user-unlogin.png?sign=fa83cd1525c7b0ad18c93e95b53e148a&t=1556781942',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: ''
  },
  
  maleMatch: function () {
    wx.redirectTo({
      url: '../soulMatch/soulMatch?gender=' + '1',
    })
  },

  femaleMatch: function () {
    wx.redirectTo({
      url: '../soulMatch/soulMatch?gender=' + '0',
    })
  },

  submit_question: function () {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              wx.redirectTo({
                url: '../soulQuestion/soul_question?username=' + res.userInfo.nickName + '&gender=' + res.userInfo.gender + '&avatarUrl=' + res.userInfo.avatarUrl
              })
            }
          })
        }
      }
    })

  },

  
  onLoad: function () {

    // 获取用户信息
  }


})
