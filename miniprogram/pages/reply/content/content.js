// pages/reply/content/content.js
var questionnaireId; //可从分享页面获得
var nickName; //用户名
var avatarUrl; //用户头像 
var raiseOpenid; //出题者openid
var raiseNickName; //出题者昵称
var raiseAvatarUrl; //出题者头像
//当前题号
var current_number = 1;
var max_number = 1;
//获取数据库引用
const db = wx.cloud.database({
  env: 'wp-test-32ff3'
});
//获取集合引用
const qnColl = db.collection('questionnaire');
//存储答题结果的对象数组
var questions = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}];

// 日期格式化
Date.prototype.Format = function(fmt) { //author: meizz 
  var o = {
    "M+": this.getMonth() + 1, //月份 
    "d+": this.getDate(), //日 
    "h+": this.getHours(), //小时 
    "m+": this.getMinutes(), //分 
    "s+": this.getSeconds(), //秒 
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
    "S": this.getMilliseconds() //毫秒 
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

//将选择过的答案颜色设置为蓝色
function changeColor(that) {
  // 如果是新题的话，i=null,不会改变颜色
  var i = questions[current_number - 1].myChoice;
  if (i == 0) {
    that.setData({
      colorA: '#7B68EE',
    })
  } else if (i == 1) {
    that.setData({
      colorB: '#7B68EE'
    })
  } else if (i == 2) {
    that.setData({
      colorC: '#7B68EE'
    })
  } else if (i == 3) {
    that.setData({
      colorD: '#7B68EE'
    })
  }
}

// 根据答案长度，设置C D选项是否显示
function changeVisible(that) {
  var answerLength = questions[current_number - 1].answer.length;
  if (answerLength == 2) {
    that.setData({
      visiableC: false,
      visiableD: false
    })
  } else if (answerLength == 3) {
    that.setData({
      visiableD: false
    })
  }
}

//选择某个选项后，切换到新的页面
function displayNewPage(that) {
  // 展示新的一题
  if (current_number == max_number) {
    current_number++;
    max_number++;
    // 已经完成10个题，将问卷存入数据库，跳到分享界面
    if (current_number == 11) {
      console.log(questions);
      addQuestionnaire();
      return;
    }
    setNewData(that);
  }
  // current_number<max_number，说明用户点击了上一题按钮，展示已浏览的题
  else {
    current_number++;
    setNewData(that);
  }
}

// 改变页面内容
function setNewData(that) {
  that.setData({
    // 传给前端
    number: current_number,
    question: questions[current_number - 1],
    colorA: '#000000',
    colorB: '#000000',
    colorC: '#000000',
    colorD: '#000000',
    visiableC: true,
    visiableD: true
  });
  changeColor(that);
  changeVisible(that);
}

// 答完问卷将结果添加到问卷表
function addQuestionnaire() {
  const qnReplyColl = db.collection('reply_questionnaire');
  var rate = 0;
  // 获取当前时间
  var time = new Date().Format("yyyy-MM-dd hh:mm");
  for (var i = 0; i < 10; i++) {
    if (questions[i]['choice'] == questions[i]['myChoice']) {
      rate = rate + 10;
    }
  }
  qnReplyColl.add({
      //插入 data字段表示需新增的JSON数据
      data: {
        questions: questions,
        questionnaireId: questionnaireId,
        raiseOpenid: raiseOpenid,
        raiseAvatarUrl: raiseAvatarUrl,
        raiseNickName: raiseNickName,
        replyNickName: nickName,
        replyAvatarUrl: avatarUrl,
        rate: rate,
        time: time
      }
    })
    .then(res => {
      // 跳转到答题结果页面，传递答题问卷ID作为参数
      var replyQnId = res._id;
      console.log('答题问卷ID：' + replyQnId);
      wx.redirectTo({
        url: '/pages/reply/result/result?replyQnId=' + replyQnId,
      });
    })
    .catch(console.error);
}

Page({
  data: {
    colorA: '#000000',
    colorB: '#000000',
    colorC: '#000000',
    colorD: '#000000',
    // 题号
    number: 1,
    // 当前问题，包含title(string) answer(array)
    question: {},
    // 是否有C,D选项
    visiableC: true,
    visiableD: true
  },

  // 选择A
  chooseA: function(e) {
    // 存储上一题的选项
    questions[current_number - 1].myChoice = 0;
    displayNewPage(this);
  },

  // 选择B
  chooseB: function(e) {
    // 存储上一题的选项
    questions[current_number - 1].myChoice = 1;
    displayNewPage(this);
  },

  // 选择C
  chooseC: function(e) {
    // 存储上一题的选项
    questions[current_number - 1].myChoice = 2;
    displayNewPage(this);
  },

  // 选择D
  chooseD: function(e) {
    // 存储上一题的选项
    questions[current_number - 1].myChoice = 3;
    displayNewPage(this);
  },

  // 点击上一题按钮
  previousQuestion: function(e) {
    if(current_number>1)
      current_number--;
    setNewData(this);
  },

  // 加载页面
  onLoad: function(res) {
    // 接收分享界面传来的问卷Id
    questionnaireId = res.questionnaireId;
    nickName = res.nickName;
    avatarUrl = res.avatarUrl;
    console.log('昵称：' + nickName + ' 头像：' + avatarUrl);
  },

  onShow:function(){
    qnColl.doc(questionnaireId).get()
      .then(res => {
        // 记录出题者的openid
        raiseOpenid = res.data._openid;
        raiseAvatarUrl = res.data.avatarUrl;
        raiseNickName = res.data.nickName;
        // 存在记录数组中
        questions = res.data.questions;
        for (var i = 0; i < 10; i++) {
          questions[i]['myChoice'] = null;
        }
        setNewData(this);
      });
  },

  onUnload: function() {
    raiseOpenid = ""; //出题者openid
    raiseNickName = ""; //出题者昵称
    raiseAvatarUrl = ""; //出题者头像
    //当前题号
    current_number = 1;
    max_number = 1;
    questions = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}];
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