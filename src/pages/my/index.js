// pages/my/index.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
		shortVersion:app.ShortVersion()
  },
	btnSettings:function(){
		wx.openSetting({
			success: function (res) {
				console.log(res);
			}
		});
	},
  btnOtherInfo:function(e){
    wx.navigateTo({
      url: '/pages/my/userotherinfo',
    })
  },
  goCreate: function (e) {
    wx.navigateTo({
      url: '/pages/create/create',
    })
  },
  changeTabIndex: function (e) {
    app.setTabIndex(e.currentTarget.dataset.index);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  bindGetUserInfo:function(e){
    var that=this;
    wx.getUserInfo({
      success: function (res) {
        app.login(function () {
          that.setData({ userInfo: app.globalData.userInfo });
        });
      }
    })
  },
  btnDonate:function(){
		wx.navigateTo({
			url: '/pages/my/donate',
		})
	},
	btnMyWallet:function(){
		wx.navigateTo({
			url: '/pages/my/wallet',
		})
	},
	btnMyJoin:function(){
		wx.navigateTo({
			url: '/pages/my/myjoin',
		})
	},
	btnMyAward:function(){
		wx.navigateTo({
			url: '/pages/my/myaward',
		})
	},
	btnMyPost:function(){
		wx.navigateTo({
			url: '/pages/my/mypost',
		})
	},
	btnQNA:function(){
		wx.navigateTo({
			url: '/pages/webview/index?url='+"https://jnsii.com/zj/helpcenter/qna.html",
		})
	},
	btnCooperation: function () {
		wx.navigateTo({
			url: '/pages/webview/index?url=' + "https://jnsii.com/zj/helpcenter/cooperation.html",
		})
	},
  onLoad: function (options) {
    
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
								});
							}
						})
					}
				}
			})
		} else {
			that.setData({ userInfo: app.globalData.userInfo });
			console.log(app.globalData.userInfo);
		}
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