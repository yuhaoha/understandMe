// miniprogram/pages/soulMatch/soulMatch.js

//获取数据库引用
const db = wx.cloud.database({ env: 'wp-test-32ff30' });
//获取集合引用男性出题者题目
const question_naires = db.collection('soul_questionnaire');
//获取女性出题人题目
const female_question_naires = db.collection('female_soul_questionnaire');
var question_naire_temp;
//选择的问卷id
var choose_id;
var chosen_question;
var gender = '';
//获取题库数目
var question_naires_count;


Page({

  /**
   * 页面的初始数据
   */
  data: {
    clickID:-1,
  },
//刷新题目列表
  change_soul: function () {
    var that = this
    // count 随机获取数据库查询开始点
    if(gender == '1'){
      var count = (Math.round(Math.random() * (question_naires_count - 6)))
      question_naires.skip(count).limit(5).get({
        success: function (res) {
          that.setData({ question_naire: res.data })
        },
        fail: function (res) {
          //console.log(res.data)
        }
      })
    }
    else{
      var count = (Math.round(Math.random() * (question_naires_count - 6)))
      female_question_naires.skip(count).limit(5).get({
        success: function (res) {
          that.setData({ question_naire: res.data })
        },
        fail: function (res) {
          //console.log(res.data)
        }
      })
    }
  },
  
  // 选择问卷
  choose_question:function(e){
    choose_id = e.currentTarget.dataset.id
    this.setData({
      clickID:e.currentTarget.id
    })
  }, 

  // 开始答题匹配
  answer_question:function(){
    if(gender == '0'){
      female_question_naires.doc(choose_id).get({
        success(res) {
          console.log(res.data)
          //将对象转为string
          var submit_people_questionnaire = JSON.stringify(res.data)
          wx.navigateTo({
            url: '../soulReply/content/content?submit_people_questionnaire=' + submit_people_questionnaire,
          })
        }
      })
    }
    else{
      question_naires.doc(choose_id).get({
        success(res) {
          console.log(res.data)
          //将对象转为string
          var submit_people_questionnaire = JSON.stringify(res.data)
          wx.navigateTo({
            url: '../soulReply/content/content?submit_people_questionnaire=' + submit_people_questionnaire,
          })
        }
      })
    }
  }, 

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (res) {
    var that = this
    // 先取出集合记录总数
    gender = res.gender
    if (gender == '1') {
      var count = (Math.round(Math.random() * 5))
      question_naires.count().then(res => {
        question_naires_count = res.total
      }) 
      // 获取问卷
      question_naires.skip(count).limit(5).get({
        success: function (res) {
          that.setData({ question_naire: res.data })
          //console.log(res.data)
        },
        fail: function (res) {
          //console.log(res.data)
        }
      })
    }
    else {
      var count = (Math.round(Math.random() * 5))
      female_question_naires.count().then(res => {
        question_naires_count = res.total
      })
      //console.log(count)
      // 获取问卷
      female_question_naires.skip(count).limit(5).get({
        success: function (res) {
          that.setData({ question_naire: res.data })
          //console.log(res.data)
        },
        fail: function (res) {
          //console.log(res.data)
        }
      })
    }
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