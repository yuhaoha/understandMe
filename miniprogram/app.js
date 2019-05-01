//app.js
App({
  onLaunch: function () {
    //云开发
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'wp-test-32ff30',
        traceUser: true,
      })
    }

    this.globalData = {}

  }
})
