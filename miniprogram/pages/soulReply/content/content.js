// pages/reply/content/content.js
var questionnaireId; //可从分享页面获得
//当前题号
var current_number = 1;
var max_number = 1;
//获取数据库引用
const db = wx.cloud.database({ env: 'wp-test-32ff30' });
//获取集合引用
const qnColl = db.collection('soul_questionnaire');
//存储答题结果的对象数组
var questions = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}];

//匹配的问卷数据
var submit_people_questionnaire;
//匹配问卷人的头像
var head_photo;
//匹配问卷人的昵称
var nickname;
// 匹配问卷人的微信
var wx_number;
//答题正确率
var rate = 0;

//将选择过的答案颜色设置为蓝色
function changeColor(that) {
  // 如果是新题的话，i=null,不会改变颜色
  var i = questions[current_number - 1].myChoice;
  if (i == 0) {
    that.setData({
      colorA: '#7B68EE',
    })
  }
  else if (i == 1) {
    that.setData({
      colorB: '#7B68EE'
    })
  }
  else if (i == 2) {
    that.setData({
      colorC: '#7B68EE'
    })
  }
  else if (i == 3) {
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
  }
  else if (answerLength == 3) {
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
  const qnReplyColl = db.collection('reply_soul_questionnaire');
  //获取时间
  var time = new Date();
  // 计算答题正确率
  for (var i = 0; i < 10; i++) {
    if (questions[i]['choice'] == questions[i]['myChoice']) {
      rate = rate + 10;
    }
  }
  qnReplyColl.add({
    //插入 data字段表示需新增的JSON数据
    data: {
      questions: questions,
      //将出题人的问题ID,出题人头像，出题人名字，出题人微信加入答题题库记录
      questionnaireId: questionnaireId,
      head_photo: head_photo,
      nickname: nickname,
      wx_number: wx_number,
      rate: rate,
      time:time,
    }
  })
    .then(res => {
      // 跳转到答题结果页面，传递答题问卷ID作为参数
      var replyQnId = res._id;
      wx.redirectTo({
        url: '/pages/soulReply/result/result?replyQnId=' + replyQnId + '&nickname=' + nickname + '&head_photo=' + head_photo + '&wx_number=' + wx_number
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
    question: {
    },
    // 是否有C,D选项
    visiableC: true,
    visiableD: true
  },

  // 选择A
  chooseA: function (e) {
    // 存储上一题的选项
    questions[current_number - 1].myChoice = 0;
    displayNewPage(this);
  },

  // 选择B
  chooseB: function (e) {
    // 存储上一题的选项
    questions[current_number - 1].myChoice = 1;
    displayNewPage(this);
  },

  // 选择C
  chooseC: function (e) {
    // 存储上一题的选项
    questions[current_number - 1].myChoice = 2;
    displayNewPage(this);
  },

  // 选择D
  chooseD: function (e) {
    // 存储上一题的选项
    questions[current_number - 1].myChoice = 3;
    displayNewPage(this);
  },

  // 点击上一题按钮
  previousQuestion: function (e) {
    if(current_number == 1){
      return
    }
    current_number--;
    setNewData(this);
  },

  // 加载页面
  onLoad: function (res) {
    // 接收soulMatch界面传来的问卷
    submit_people_questionnaire = JSON.parse(res.submit_people_questionnaire);
    head_photo = submit_people_questionnaire.avatar_url
    nickname = submit_people_questionnaire.username
    wx_number = submit_people_questionnaire.weixin
    // 获取问卷id
    questionnaireId = submit_people_questionnaire._id;
    qnColl.doc(questionnaireId).get()
      .then(res => {
        // 存在记录数组中
        questions = res.data.questions;
        for (var i = 0; i < 10; i++) {
          questions[i]['myChoice'] = null;
        }
        setNewData(this);
      });
  },

  onUnload: function () {
    current_number = 1;
    max_number = 1;
    questions = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}];
  },

})