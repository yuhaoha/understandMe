// pages/reply/entry/entry.js
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
    openid:''
  },

  // 开始答题
  replyQuestion:function(e)
  {
    wx.redirectTo({
      url: '/pages/reply/content/content?questionnaireId=' + questionnaireId,
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
        qnColl.doc(questionnaireId).get()
          .then(res => {
            // 出题人的id
            var raiseId = res.data._openid;
            // 写反的！！为了调试，到时候改一下
            if (openid != raiseId) {
              console.log('出题人和答题人相同哦')
              // wx.redirectTo({
              //   url: '/pages/entry/index',
              // })
            }

            //答别人的问卷，在答题数据库中查询是否答过题
            else {
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