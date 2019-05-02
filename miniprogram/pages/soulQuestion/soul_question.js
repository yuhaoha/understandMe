// pages/question/question.js
//浏览过的题目编号数组，包括做过的和换掉的，目的是换一题可以遇到没做过的题
var visitedArr = new Array();
var visitedIndex = 0;
//当前题号
var current_number = 1; 
var max_number = 1;
var wx_number = 0;
//获取数据库引用
const db = wx.cloud.database({ env: 'wp-test-32ff30' });
//获取集合引用
const questionColl = db.collection('question');
//存储答题结果的对象数组
var questions = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}];
var username = ''
var gender = ''
var avatar_url = ''

// 随机获取某个题目id
function getId()
{
  var randomId = (Math.round(Math.random() * (15 - 1)) + 1).toString();
  //已经浏览过此记录
  while(visitedArr.indexOf(randomId)>-1)
  {
    randomId = (Math.round(Math.random() * (15 - 1)) + 1).toString();
  }
  visitedArr[visitedIndex] = randomId;
  visitedIndex++;
  return randomId;
}

//将选择过的答案颜色设置为蓝色
function changeColor(that) {
  // 如果是新题的话，i=null,不会改变颜色
  var i = questions[current_number - 1].choice;
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
  else if(i == 3){
    that.setData({
      colorD: '#7B68EE'
    })
  }
}

// 根据答案长度，设置C D选项是否显示
function changeVisible(that)
{
  var answerLength = questions[current_number - 1].answer.length;
  if(answerLength==2)
  {
    that.setData({
      visiableC:false,
      visiableD:false
    })
  }
  else if(answerLength==3)
  {
    that.setData({
      visiableD:false
    })
  }
}

//选择某个选项后，切换到新的页面
function displayNewPage(that)
{
  // 展示新的一题
  if (current_number == max_number) {
    current_number++;
    max_number++;
    // 已经完成10个题，将问卷存入数据库，跳到分享界面
    // 随机获取1-15之间的记录
    var id = getId();
    questionColl.doc(id).get()
      .then(res => {
        // 存在记录数组中
        questions[current_number - 1] = {
          number: current_number,
          title: res.data.title,
          answer: res.data.answer
        };
        setNewData(that);
      });
  }

  // current_number<max_number，说明用户点击了上一题按钮，展示已浏览的题
  else {
    current_number++;
    setNewData(that);
  }
}

// 改变页面内容
function setNewData(that)
{
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
  const questionnaireColl = db.collection('soul_questionnaire');
  questionnaireColl.add({
    data: {
      questions: questions,
      weixin: wx_number,
      username:username,
      gender:gender,
      avatar_url:avatar_url
    }
  })
    .then(res => {
      //console.log(res._id)
    })
    .catch(console.error); 
  
}

Page({
  data: {
    colorA:'#000000',
    colorB:'#000000',
    colorC:'#000000',
    colorD:'#000000',
    // 题号
    number: 1,
    // 当前问题，包含title(string) answer(array)
    question:{
    },
    // 是否有C,D选项
    visiableC:true,
    visiableD:true
  },
  bindKeyInput(e) {
    wx_number = e.detail.value;
  },
  //灵魂匹配出题提交按钮
  submit_button:function(){
    addQuestionnaire();
    visitedArr = [];
    visitedIndex = 0;
      //当前题号
    current_number = 1;
    max_number = 1;
    questions = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}];
      // 跳转到匹配页面
    wx.redirectTo({
      url: '../soulMatch/soulMatch',
    });
    return;
  },
  //灵魂匹配出题取消
  cancel_button:function(){
    visitedArr = [];
    visitedIndex = 0;
    //当前题号
    current_number = 1;
    max_number = 1;
    questions = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}];
    wx.redirectTo({
      url: '../soulMatch/soulMatch',
    })
  },

  // 选择A
  chooseA:function(e)
  {
    // 存储上一题的选项
    questions[current_number-1].choice = 0;
    displayNewPage(this);
  },

  // 选择B
  chooseB: function (e) {
    // 存储上一题的选项
    questions[current_number - 1].choice = 1;
    displayNewPage(this);
  },

  // 选择C
  chooseC: function (e) {
    // 存储上一题的选项
    questions[current_number - 1].choice = 2;
    displayNewPage(this);
  },

  // 选择D
  chooseD: function (e) {
    // 存储上一题的选项
    questions[current_number - 1].choice = 3;
    displayNewPage(this);
  },

  // 点击上一题按钮
  previousQuestion: function (e) {
    current_number--;
    setNewData(this);
  },

  //点击换一题按钮，换一道新的题目
  changeQuestion:function(e){
    var id = getId();
    questionColl.doc(id).get()
      .then(res => {
        // 存在记录数组中
        questions[current_number - 1] = {
          number: current_number,
          title: res.data.title,
          answer: res.data.answer
        };
        setNewData(this);
      });
  },


  /**
   * 生命周期函数--监听页面加载
   */

  // 加载页面
  onLoad: function (res) {
    username = res.username
    gender = res.gender
    avatar_url = res.avatarUrl
    var id = getId();
    questionColl.doc(id).get()
      .then(res => {
        // 存在记录数组中
        questions[current_number - 1] = {
          number: current_number,
          title: res.data.title,
          answer: res.data.answer
        };
        setNewData(this);
      });
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