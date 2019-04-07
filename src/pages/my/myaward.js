// pages/my/mypost.js
const app=getApp();
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
		list:[],
		page:0,
		canLoadMore:false
  },
	btnGoDetail:function(e){
		wx.navigateTo({
			url: '/pages/luckydraw/detail?id='+e.currentTarget.dataset.id,
		})
	},
	btnSubmitExpressAddress:function(e){
		var that = this;
		app.postFormId(e.detail.formId);

		wx.chooseAddress({
			success: function (res) {
				// console.log(res.userName)
				// console.log(res.postalCode)
				// console.log(res.provinceName)
				// console.log(res.cityName)
				// console.log(res.countyName)
				// console.log(res.detailInfo)
				// console.log(res.nationalCode)
				// console.log(res.telNumber)
				that.postExpressAddress(e.currentTarget.dataset.id,{
					provinceName: res.provinceName,
					cityName: res.cityName,
					countyName: res.countyName,
					detailInfo: res.detailInfo,
					postalCode: res.postalCode,
					userName: res.userName,
					telNumber: res.telNumber
				});
			},
			fail:function(res){
				console.log(res);
				wx.openSetting({});
			}
		})
	},
	btnCheckExpress:function(e){
		var that=this;
		console.log(e.currentTarget.dataset.expressno);
		wx.navigateTo({
			url: '/pages/webview/index?url=' + escape("https://jnsii.com/zj/h5/express/index.html?nu="+e.currentTarget.dataset.expressno),
		})
	},
	postExpressAddress:function(id,expressaddress){
		var that=this;
		wx.request({
			url: app.ServerUrl() + '/api/postexpressaddress.php',
			method: 'POST',
			header: {
				'Cookie': 'PHPSESSID=' + app.globalData.sessionid
			},
			data: {
				id:id,
				expressaddress: JSON.stringify(expressaddress)
			},
			success: function (res) {
				wx.hideLoading();
				wx.showModal({
					title: '',
					content: res.data.msg,
					showCancel:false
				})
				if (parseInt(res.data.err) == 0) {
					var obj = res.data;

					that.updateList();
				}
			}
		});
	},
	updateList: function (page=0) {
		var that = this;
		wx.request({
			url: app.ServerUrl() + '/api/listluckydraw.php',
			method: 'GET',
			header: {
				'Cookie': 'PHPSESSID=' + app.globalData.sessionid
			},
			data:{
				type:22,
				page:page,
				limit:10
			},
			success: function (res) {
				if(parseInt(res.data.err)==0){
					var newlist = res.data.result;

					for (var i = 0; i < newlist.length; i++) {
						var item = newlist[i].luckydrawInfo;
						if (item["awardimage"] != "") {
							item["awardimage"] = app.CDNUrl() + "/upload/" + item["awardimage"];
						} else {
							item["awardimage"] = "../../images/defaultawardimage.jpg";
						}
						item["opendatestr"] = util.formatDate(new Date(item["opendate"] * 1000), "MM月dd日 hh:mm");
						item["opentypestr"] = ["自动开奖", "参与者达到 " + item['openneedusers'] + " 人时自动开奖", "发起人手动开奖"][item['opentype']];
					}
					
					var list = [];
					if (page <= 0) {
						list = newlist;
					} else {
						list = that.data.list.concat(newlist);
					}

					that.setData({
						list: list,
						page:page,
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
		this.updateList();
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