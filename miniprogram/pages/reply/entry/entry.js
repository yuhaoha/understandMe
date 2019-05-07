// pages/reply/entry/entry.js
const app = getApp()
// 传来的问卷Id
var questionnaireId;
//获取数据库引用
const db = wx.cloud.database({ env: 'wp-test-32ff30' });
// 答题集合
const replyColl = db.collection('reply_questionnaire');
// 出题集合
const qnColl = db.collection('questionnaire');

Page({

  data: {
    openid:'',
    avatarUrl: 'https://7770-wp-test-32ff30-1259082207.tcb.qcloud.la/image/questionandshare/user-unlogin.png?sign=fa83cd1525c7b0ad18c93e95b53e148a&t=1556781942',
    nickName: '',
    raiseNickName:'',
    raiseAvatarUrl: 'https://7770-wp-test-32ff30-1259082207.tcb.qcloud.la/image/questionandshare/user-unlogin.png?sign=fa83cd1525c7b0ad18c93e95b53e148a&t=1556781942'
  },

  // 开始答题
  replyQuestion:function(e)
  {
    var nickName = this.data.nickName;
    var avatarUrl = this.data.avatarUrl;
    var openid = this.data.openid;
    wx.redirectTo({
      url: '/pages/reply/content/content?questionnaireId=' + questionnaireId + '&nickName=' + nickName + '&avatarUrl=' + avatarUrl+ '&openid=' + openid,
    })
  },

  // 回到首页
  homePage:function(e)
  {
    wx.redirectTo({
      url: '/pages/entry/index',
    })
  },


  onLoad: function (res1) {
    // 获取问卷ID
    questionnaireId = res1.questionnaireId;
    console.log('分享的问卷ID：' + questionnaireId);
    // 获取用户头像，昵称
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                nickName: res.userInfo.nickName,
              })
              console.log(res.userInfo)
            }
          })
        }
      }
    })
  },

  onShow:function(){
    // 获取用户openid
    var openid;
    wx.cloud.callFunction({
      name: 'getOpenid',
      complete: res => {
        console.log('云函数获取到的openid: ', res.result.openId)
        // 获取openid
        openid = res.result.openId;
        console.log(openid);

        // 如果点开自己出的题，跳到主页(后面改成我的记录页面)
        qnColl.doc('9c4488c75cd04f800d464cdc76ce5092').get()
          .then(res => {
            // 出题人的id
            var raiseId = res.data._openid;
            // 设置出题人昵称、头像传到前端
            this.setData({
              raiseAvatarUrl:res.data.avatarUrl,
              raiseNickName:res.data.nickName
            })
            console.log('*******当前openid:'+openid);
            // 写反的！！为了调试，到时候改一下
            if (openid == raiseId) {
              console.log('出题人和答题人相同哦')
              wx.redirectTo({
                url: '/pages/entry/index',
              })
            }

            //答别人的问卷，在答题数据库中查询是否答过题
            else {
              console.log('出题人和答题人不同');
              replyColl.where({
                _openid: openid,
                questionnaireId: questionnaireId
              })
                .get().then((res2) => {
                  // res2.data是查询到的记录数组
                  console.log('查询答题表');
                  var length = res2.data.length;
                  console.log('问卷' + questionnaireId + '答过的次数：' + length);
                  // 该用户答过此题，去答题成功页面，带有回答问卷id参数
                  if (length > 0) {
                    // 回答问卷的ID
                    var replyQnId = res2.data[0]._id;
                    wx.redirectTo({
                      url: '/pages/reply/result/result?replyQnId=' + replyQnId,
                    });
                  }
                });
            }
          });

      }
    })
  },

})