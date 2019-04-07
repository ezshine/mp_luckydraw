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
		showDetail:false,
		detailIndex:0,
	},
	btnLoadMore: function () {
		if (this.data.canloadmore) {
			this.data.page += 1;
			this.updateJoins(this.data.page);
		}
	},
	inputExpressNo:function(e){
		var that=this;

		var list=that.data.list;
		var item = list[that.data.detailIndex];
		item.expressno=e.detail.value
		that.setData({
			list: list
		});
	},
	inputExpressRemark:function(e){
		var that = this;

		var list = that.data.list;
		var item = list[that.data.detailIndex];
		item.expressremark = e.detail.value
		that.setData({
			list: list
		});
	},
	btnBack:function(){
		var that=this;
		that.setData({
			showDetail:false
		});
	},
	btnCopyAddress:function(){
		var that=this;

		var item = that.data.list[that.data.detailIndex];

		var copyinfo = item.expressaddress.provinceName + item.expressaddress.cityName + item.expressaddress.countyName + item.expressaddress.detailInfo + "，收件人：" + item.expressaddress.userName + "，电话：" + item.expressaddress.telNumber;
		wx.setClipboardData({
			data: copyinfo,
		});
		wx.showToast({
			title: '已复制到剪贴板',
		})
	},
	btnSaveExpressInfo:function(){
		var that=this;
		var item = that.data.list[that.data.detailIndex];

		wx.showModal({
			title: '',
			content: '保存后会给中奖者发送快递信息，确认保存吗？',
			success:function(res){
				if(res.confirm){
					readySave();
				}
			}
		})

		function readySave(){
				wx.request({
					url: app.ServerUrl() + '/api/postexpressno.php',
					method: 'POST',
					header: {
						'Cookie': 'PHPSESSID=' + app.globalData.sessionid
					},
					data: {
						id: item.id,
						expressno: item.expressno,
						expressremark: item.expressremark
					},
					success: function (res) {
						wx.hideLoading();
						if (parseInt(res.data.err) == 0) {
							wx.showToast({
								title: res.data.msg,
							})
							that.setData({
								showDetail: false
							});
						} else {
							wx.showModal({
								title: '',
								content: res.data.msg,
								showCancel: false
							})
						}
					}
				});
		}
	},
	sendGetAwardNotice:function(openid){
		var that=this;
		wx.request({
			url: app.ServerUrl() + '/api/sendgetawardnotice.php',
			method: 'POST',
			header: {
				'Cookie': 'PHPSESSID=' + app.globalData.sessionid
			},
			data: {
				id: that.data.id,
				openid: openid
			},
			success: function (res) {
				wx.showToast({
					title:res.data.msg
				})
			}
		});
	},
	btnShowAddress:function(e){
		var that=this;
		var item = that.data.list[e.currentTarget.dataset.index];
		if (item.expressaddress){
			this.setData({
				showDetail: true,
				detailIndex: e.currentTarget.dataset.index
			});
		}else{
			wx.showModal({
				title: '',
				content: '是否给该用户发送中奖通知？',
				success:function(res){
					if(res.confirm){
						that.sendGetAwardNotice(item.ownerid);
					}
				}
			})
		}
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
		this.updateJoins(0, this.data.type, this.data.inputVal);
	},
	clearInput: function () {
		this.setData({
			inputVal: ""
		});
		this.updateJoins(0, this.data.type, this.data.inputVal);
	},
	inputTyping: function (e) {
		if (util.trimStr(e.detail.value) != "") {
			this.setData({
				inputVal: util.trimStr(e.detail.value)
			});
			this.updateJoins(0, this.data.type, util.trimStr(e.detail.value));
		} else {
			this.clearInput();
		}
	},
	updateJoins: function (page = 0, type = 0, kw = "") {
		var that = this;
		wx.request({
			url: app.ServerUrl() + '/api/getluckydrawjoins.php',
			method: 'GET',
			header: {
				'Cookie': 'PHPSESSID=' + app.globalData.sessionid
			},
			data: {
				id: that.data.id,
				keyword: that.data.inputVal,
				type: 2,
				page: page
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
			id: options.id
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