// pages/my/wallet.js
const app=getApp();
var timer;
const audioGetCoin = wx.createInnerAudioContext();
Page({

  /**
   * 页面的初始数据
   */
  data: {
		result:null,
		list: [],
		canloadmore: false,
		page: 0
  },
	bindGetUserInfo: function (e) {
		var that = this;
		wx.getUserInfo({
			success: function (res) {
				app.login(function () {
					that.setData({ userInfo: app.globalData.userInfo });
					that.updateWallet();
					that.updateHistory();
				});
			}
		})
	},
	btnLoadMore: function () {
		if (this.data.canloadmore) {
			this.data.page += 1;
			this.updateHistory(this.data.page);
		}
	},
	btnEarnCoin:function(e){
		var that=this;
		if(that.data.result.canearncoin){
			var that = this;
			console.log('submit form id', e.detail.formId);
			app.postFormId(e.detail.formId);

			audioGetCoin.src = app.ServerUrl()+'/images/9654.mp3';
			audioGetCoin.play();

			wx.request({
				url: app.ServerUrl() + '/api/earncoin.php',
				method: 'GET',
				header: {
					'Cookie': 'PHPSESSID=' + app.globalData.sessionid
				},
				success: function (res) {
					if (parseInt(res.data.err) == 0) {

						var result=that.data.result;

						result.totalcoin = parseInt(result.totalcoin)+1;
						app.globalData.userInfo.coin = result.totalcoin;

						result.canearncoin=false;

						that.setData({
							result: result
						});

						that.updateWallet();
						that.updateHistory();
					}else{
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
  /**
   * 生命周期函数--监听页面加载
   */
	updateWallet:function(){
		var that = this;
		wx.request({
			url: app.ServerUrl() + '/api/wallet.php',
			method: 'GET',
			header: {
				'Cookie': 'PHPSESSID=' + app.globalData.sessionid
			},
			success: function (res) {
				if (parseInt(res.data.err) == 0) {
					
					that.setData({
						result: res.data.result
					});
					if(!res.data.canearncoin)that.startTimer();
				}else{
					wx.showModal({
						title: '',
						content: res.data.msg,
						showCancel:false
					})
				}
			}
		});
	},
	startTimer:function(){
		var that=this;
		
		function updateCountDown(){
			var totalSec = 3600 - that.data.result.distancetime;
			if (totalSec<0){
				console.log("倒计时结束");
				result=that.data.result;
				result.canearncoin=true;
				that.setData({
					result: result
				});
				clearInterval(timer);
				return;
			}
			var disminute = Math.floor(totalSec / 60);
			var dissec = (totalSec % 60);
			var distancetimestr = disminute + "分" + dissec + "秒";
			if (disminute<=0){
				distancetimestr = dissec + "秒";
			}

			var result = that.data.result;
			result.distancetime = parseInt(result.distancetime)+1;
			that.setData({
				distancetimestr: distancetimestr,
				result: result
			});
		}
		updateCountDown();
		if (timer) clearInterval(timer);
		timer = setInterval(updateCountDown,1000);
	},
	updateHistory:function(page=0){
		var that = this;
		wx.showLoading({
			title: '请求中',
			mask: true
		})
		wx.request({
			url: app.ServerUrl() + '/api/coinhistorylist.php',
			method: 'POST',
			header: {
				'Cookie': 'PHPSESSID=' + app.globalData.sessionid
			},
			data: {
				page: page,
				token: app.globalData.token
			},
			complete: function (res) {
				wx.hideLoading();
				wx.stopPullDownRefresh();
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
  onLoad: function (options) {
		var that = this;

		if (app.globalData.userInfo == null) {
			wx.getSetting({
				success: function (res) {
					if (res.authSetting['scope.userInfo']) {
						// 已经授权，可以直接调用 getUserInfo 获取头像昵称
						wx.getUserInfo({
							success: function (res) {
								app.login(function () {
									that.setData({ userInfo: app.globalData.userInfo });
									that.updateWallet();
									that.updateHistory();
								});
							}
						})
					}
				}
			})
		} else {
			that.setData({ userInfo: app.globalData.userInfo });
			that.updateWallet();
			that.updateHistory();
			console.log(app.globalData.userInfo);
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
		clearInterval(timer);
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