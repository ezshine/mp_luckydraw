// pages/my/userotherinfo.js
const app=getApp();
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
		optiondetail: [],
		tempKey:"",
		tempValue:"",
  },
	keyInput:function(e){
		this.setData({
			tempKey: e.detail.value.toUpperCase()
		});
	},
	valueInput: function (e) {
		this.setData({
			tempValue: e.detail.value
		});
	},
	btnSave:function(){
		var that = this;

		this.btnAddOption();

		wx.request({
			url: app.ServerUrl() + '/api/updateotiondetail.php',
			method: 'POST',
			header: {
				'Cookie': 'PHPSESSID=' + app.globalData.sessionid
			},
			data: that.data.optiondetail,
			success: function (res) {
				if (parseInt(res.data.err) == 0) {
					app.globalData.userInfo.optiondetail = that.data.optiondetail;
					wx.navigateBack({
						
					})
				} else {
					wx.showModal({
						title: '',
						content: res.data.msg
					})
				}
			}
		})
	},
	btnRemove:function(e){
		var that=this;
		var index = e.currentTarget.id;

		that.data.optiondetail.splice(index, 1);

		that.setData({
			optiondetail: that.data.optiondetail
		});
	},
	btnAddOption:function(e){
		if (util.trimStr(this.data.tempKey) != "" && util.trimStr(this.data.tempValue) != ""){
			this.data.optiondetail.push({ key: util.trimStr(this.data.tempKey).toUpperCase(), value: util.trimStr(this.data.tempValue)});
			this.setData({
				optiondetail: this.data.optiondetail,
				tempKey:"",
				tempValue:""
			});

		}
	},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
		this.setData({
			optiondetail: app.globalData.userInfo.optiondetail ? app.globalData.userInfo.optiondetail:[]
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
		return app.getMainAppShare();
  }
})