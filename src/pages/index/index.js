//index.js
//获取应用实例
const app = getApp();
var util = require('../../utils/util.js');
var timer;
Page({
  data: {
    result:null,
		marqueeText:"",
		showtotalawards:0
  },
	btnJump:function(e){
		app.postFormId(e.detail.formId);
		
  	var url=e.currentTarget.dataset.url;

  	if(url.indexOf("xcxid://")>=0){
  		var urls=url.split("xcxid://");
  		wx.navigateToMiniProgram({
			appId: urls[1],
			path: "",
			success(res) {
				
			}
		})
  	}else{
	  	wx.navigateTo({
				url: e.currentTarget.dataset.url,
			})
	  }
  },
	btnMyWallet:function(){
		wx.navigateTo({
			url: '/pages/my/wallet',
		})
	},
	btnList:function(){
		wx.navigateTo({
			url: '/pages/luckydraw/list',
		})
	},
	btnMap:function(){
		wx.navigateTo({
			url: '/pages/luckydraw/map',
		})
	},
  goCreate:function(e){
    wx.navigateTo({
      url: '/pages/create/create',
    })
  },
  changeTabIndex: function (e) {
    app.setTabIndex(e.currentTarget.dataset.index);
  },
  //事件处理函数
  bindViewTap: function() {
    
  },
	startTimer:function(){
		var that=this;
		var showtotalawards=that.data.result.totalawards-Math.floor(Math.random()*50+50);
		function updateTotalAwards(){
			if (showtotalawards<that.data.result.totalawards){
				showtotalawards+=Math.floor(Math.random()*5+1);
			}
			that.setData({
				showtotalawards: showtotalawards
			});
		}
		updateTotalAwards();
		if(timer)clearInterval(timer);
		timer=setInterval(updateTotalAwards,5000);
	},
	updateHomeIndex:function(){
		var that = this;
		wx.showLoading({
			title: '奖品加载中',
		})
		wx.request({
			url: app.ServerUrl() + '/api/homeindex.php',
			method: 'GET',
			header: {
				'Cookie': 'PHPSESSID=' + app.globalData.sessionid
			},
			complete:function(){
				wx.hideLoading();
			},
			success: function (res) {
				if (parseInt(res.data.err) == 0) {
					var result = res.data.result;

					for (var i = 0; i < result.recommends.length;i++){
						var item = result.recommends[i];
						if (item["awardimage"] != "") {
							item["awardimage"] = app.CDNUrl() + "/upload/" + item["awardimage"];
						} else {
							item["awardimage"] = "../../images/defaultawardimage.jpg";
						}
						item["opendatestr"] = util.formatDate(new Date(item["opendate"] * 1000), "MM月dd日 hh:mm");
						item["opentypestr"] = ["自动开奖", "参与者达到 " + item['openneedusers'] + " 人时自动开奖", "发起人手动开奖"][item['opentype']];
					}

					for (var i = 0; i < result.opensoons.length; i++) {
						var item = result.opensoons[i];
						if (item["awardimage"] != "") {
							item["awardimage"] = app.CDNUrl() + "/upload/" + item["awardimage"];
						} else {
							item["awardimage"] = "../../images/defaultawardimage.jpg";
						}
						item["opendatestr"] = util.formatDate(new Date(item["opendate"] * 1000), "MM月dd日 hh:mm");
						item["opentypestr"] = ["自动开奖", "参与者达到 " + item['openneedusers'] + " 人时自动开奖", "发起人手动开奖"][item['opentype']];
					}

					app.globalData.shareapptext = result.shareapptext;
					app.globalData.shareimagetext = result.shareimagetext;
					app.globalData.shareimageslogan = result.shareimageslogan;

					that.setData({
						result: result
					});
					that.startTimer();
				}
			}
		});
	},
	btnRank:function(){
		wx.navigateTo({
			url: '/pages/webview/index?url=' + "https://jnsii.com/zj/h5/rank/index.html",
		})
	},
	btnQNA: function () {
		wx.navigateTo({
			url: '/pages/webview/index?url=' + "https://jnsii.com/zj/helpcenter/qna.html",
		})
	},
	btnCooperation: function () {
		wx.navigateTo({
			url: '/pages/webview/index?url=' + "https://jnsii.com/zj/helpcenter/cooperation.html",
		})
	},
  onLoad: function (options) {
		this.updateHomeIndex();
		var luckydrawid = options.luckydrawid;
		console.log("options:",options);
		// options.scene ="luckydrawid7_inviterid1";
		if(options.scene){
			if (options.scene.indexOf("luckydrawid")>=0){
				var scene_params = options.scene.split("_");
				var luckydrawid = scene_params[0].substr(11, scene_params[0].length);
				var url = '/pages/luckydraw/detail?id=' + luckydrawid;
				if (scene_params.length>1){
					var inviterid = scene_params[1].substr(9, scene_params[1].length);
					url = '/pages/luckydraw/detail?id=' + luckydrawid + "&inviterid=" + inviterid;
				}
				console.log("option url:"+url);
				wx.navigateTo({
					url: url
				});
				return;
			}
		}
		if (luckydrawid) {
			var url='/pages/luckydraw/detail?id=' + luckydrawid;
			if(options.inviterid){
				url=url+"&inviterid="+options.inviterid;
			}
			console.log("option url:"+url);
			wx.navigateTo({
				url: url,
			})
		}
  },
	onUnload:function(){
		clearInterval(timer);
	},
	onShow:function(){

	},
	onShareAppMessage: function () {
		return app.getMainAppShare();
	}
})
