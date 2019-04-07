// pages/luckydraw/alljoiner.js
const app = getApp();
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
		list: [],
		page: 0,
		canloadmore: false,
		inputShowed: false,
		inputVal: "",
		searchResult: [],
		type:0
  },
	showMsgTips:function(e){
		wx.showModal({
			title: '',
			content: e.currentTarget.dataset.msgtips,
			showCancel:false
		})
	},
	btnLoadMore: function () {
		if (this.data.canloadmore) {
			this.data.page += 1;
			this.updateJoins(this.data.page);
		}
	},
	btnChangeTab:function(e){
		this.setData({
			type:e.currentTarget.dataset.type
		});
		this.updateJoins();
	},
	showInput: function () {
		this.setData({
			inputShowed: true
		});
	},
	hideInput: function () {
		this.setData({
			inputVal: "",
			inputShowed: false
		});
		this.updateJoins(0,this.data.inputVal);
	},
	clearInput: function () {
		this.setData({
			inputVal: ""
		});
		this.updateJoins(0,this.data.inputVal);
	},
	inputTyping: function (e) {
		if (util.trimStr(e.detail.value) != "") {
			this.setData({
				inputVal: util.trimStr(e.detail.value)
			});
			this.updateJoins(0,util.trimStr(e.detail.value));
		} else {
			this.clearInput();
		}
	},
	updateJoins:function(page=0,kw=""){
		var that = this;
		wx.request({
			url: app.ServerUrl() + '/api/getluckydrawjoins.php',
			method: 'GET',
			header: {
				'Cookie': 'PHPSESSID=' + app.globalData.sessionid
			},
			data:{
				id: that.data.id,
				keyword: that.data.inputVal,
				type:that.data.type,
				page:page
			},
			success: function (res) {
				if (parseInt(res.data.err) == 0) {
					var newlist = res.data.result;

					var list = [];
					if (page <= 0) {
						list = newlist;
					} else {
						list = that.data.list.concat(newlist);
					}

					that.setData({
						list: list,
						page: page,
						canloadmore: newlist.length >= 10
					});
				}
			}
		});
	},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
		this.setData({
			id:options.id,
			type: options.type ? options.type:0
		});
		this.updateJoins();
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