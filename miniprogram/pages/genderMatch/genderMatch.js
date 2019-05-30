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
    wx.navigateTo({
      url: '../soulMatch/soulMatch?gender=' + '1',
    })
  },

  femaleMatch: function () {
    wx.navigateTo({
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
              wx.navigateTo({
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
