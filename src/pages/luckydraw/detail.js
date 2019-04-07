// pages/luckydraw/detail.js
const app=getApp();
var util = require('../../utils/util.js');
var distance = [0, 1000, 5000, 10000, 30000, 50000];
var timer;
Page({

  /**
   * 页面的初始数据
   */
  data: {
		result:null,
		distanceOpen:300,
		distanceOpenStr:"",
		canstart:true,
		startdis:0,
		startformat:""
  },
	showJoinedTips:function(e){
		wx.showModal({
			title: '',
			content: e.currentTarget.dataset.tips,
			showCancel:false
		})
	},
	btnGoAwardHistory:function(){
		wx.navigateTo({
			url: '/pages/my/myaward',
		})
	},
	showShareImage:function(){
		var that = this;
		wx.navigateTo({
			url: '/pages/luckydraw/shareimage?id=' + that.data.id,
		});
		that.btnHideShareMenu();
	},
	btnShowShareMenu:function(){
		this.setData({
			showShareMenu:true
		});
	},
	btnHideShareMenu:function(){
		this.setData({
			showShareMenu: false
		});
	},
	btnAwardsAddress:function(){
		var that = this;
		wx.navigateTo({
			url: '/pages/luckydraw/awardsaddress?id=' + that.data.id,
		})
	},
	btnAllLuckyGuys:function(){
		var that = this;
		wx.navigateTo({
			url: '/pages/luckydraw/alljoiner?id=' + that.data.id+"&type=2",
		})
	},
	btnOpenMiniApp:function(e){
		var that=this;
		if(e.currentTarget.dataset.xcxid!=''){
			wx.navigateToMiniProgram({
				appId: e.currentTarget.dataset.xcxid,
				path: e.currentTarget.dataset.xcxpath,
				success(res) {
					
				}
			})
		} else if (e.currentTarget.dataset.sponserurl != ''){
			//result.sponserurl
			wx.navigateTo({
				url: '/pages/webview/index?url=' + e.currentTarget.dataset.sponserurl,
			})
		}
		app.postStats("clicksponser",{luckydrawid:that.data.id});
	},
	btnGoEdit:function(){
		var that=this;
		wx.redirectTo({
			url: '/pages/create/create?id='+that.data.id,
		})
	},
	btnGoCreate:function(){
		wx.redirectTo({
			url: '/pages/create/create',
		})
	},
	showAdvTips:function(){
		var that=this;
		this.setData({
			showAdvTips:true
		});
		setTimeout(function(){
			that.setData({
				showAdvTips: false
			});
		},3000);
	},
	bindGetUserInfo: function (e) {
		var that = this;
		wx.getUserInfo({
			success: function (res) {
				app.login(function () {
					that.setData({ userInfo: app.globalData.userInfo });
					that.updateDetail();
				});
			}
		})
	},
	inputAdvPassword:function(e){
		var that=this;
		that.setData({
			passwordResult:e.detail.value
		});
	},
	btnClearAdvPassword:function(){
		this.setData({
			passwordResult:"",
			showPasswordInput:false
		});
	},
	btnSaveAdvPassword:function(){
		var that=this;
		if (that.data.passwordResult != that.data.result.advpassword) {
			wx.showToast({
				title: '口令不正确',
				icon:"none",
			})
		}else{
			wx.showToast({
				title: '口令正确！',
			});
			that.setData({
				showPasswordInput: false
			});
		}
	},
	get2GPSDistance:function(gps1,gps2){
		if(!gps1 || !gps2)return 999999999999999999;
		function toRad(d) { return d * Math.PI / 180; }
		var lat1=gps1.split(",")[0];
		var lng1 = gps1.split(",")[1];
		var lat2 = gps2.split(",")[0];
		var lng2 = gps2.split(",")[1];

		var dis = 0;
		var radLat1 = toRad(lat1);
		var radLat2 = toRad(lat2);
		var deltaLat = radLat1 - radLat2;
		var deltaLng = toRad(lng1) - toRad(lng2);
		var dis = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(deltaLat / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(deltaLng / 2), 2)));
		return dis * 6378137;
	},
	btnCancelMap:function(){
		this.setData({
			showMap:false,
			usergps:null
		});
	},
	btnCheckGPS:function(){
		var that=this;
		wx.getLocation({
			type: 'wgs84',
			success: function (res) {
				var latitude = res.latitude + "";
				var longitude = res.longitude + "";
				that.data.usergps = latitude + "," + longitude;

				if (that.get2GPSDistance(that.data.usergps, that.data.result.advgps) > distance[that.data.result.advdistancetype]) {
					wx.showToast({
						title: '解锁失败',
						icon:"none"
					})
				}else{
					wx.showToast({
						title: '解锁成功',
					})
					that.setData({
						showMap: false
					});
				}
			},
			fail: function (res) {
				wx.openSetting({})
			}
		})
	},
	verifyJoinCondition:function(success){
		var that=this;
		
		if(that.data.result.advpassword!=""){
			console.log("校验密码");
			if (that.data.passwordResult!=that.data.result.advpassword){
				that.setData({
					showPasswordInput:true
				});
				return;
			} else {
				console.log("通过");
			}
		}
		
		if (that.data.result.advgps!="" && that.data.result.advdistancetype>0){
			console.log("校验位置");
			
			if (that.get2GPSDistance(that.data.usergps, that.data.result.advgps) > distance[that.data.result.advdistancetype]){
				function startLocation(){
					var advgps = that.data.result.advgps.split(",");
					that.setData({
						showMap:true,
						markers: [{
							iconPath : "/images/mapmarker.png",
							latitude: parseFloat(advgps[0]),
							longitude: parseFloat(advgps[1]),
							width : 55,
							height : 60}],
						circles:[
							{
								latitude: parseFloat(advgps[0]),
								longitude: parseFloat(advgps[1]),
								radius: distance[that.data.result.advdistancetype],
								fillColor: "#33ff6666"
							}
						],
						centerLng: advgps[1],
						centerLat: advgps[0]
					});
					wx.getLocation({
						type: 'wgs84',
						success: function (res) {
							var latitude = res.latitude+"";
							var longitude = res.longitude+"";
							that.data.usergps = latitude + "," + longitude;

							var mapCtx = wx.createMapContext('map');
							mapCtx.includePoints({
								padding: [10, 10, 10, 10],
								points: [{ latitude: latitude, longitude: longitude }, { latitude: that.data.centerLat, longitude: that.data.centerLng }]
							})
						},
						fail:function(res){
							wx.openSetting({})
						}
					})
				}
				
				return wx.showModal({
					title: '',
					content: '当GPS定位处于 [' + that.data.result.advgpscity + that.data.result.advgpsaddr +"] "+ distance[that.data.result.advdistancetype]/1000+"km内时方可参与抽奖",
					confirmText: "开始定位",
					success: function (res) {
						if (res.confirm) {
							startLocation();
						}
					}
				})
			}else{
				console.log("通过");
			}
		}
		
		console.log(that.data.result.advgendertype);
		console.log(app.globalData.userInfo.gender);
		if (that.data.result.advgendertype != 0) {
			console.log("校验性别");
			if (app.globalData.userInfo.gender != that.data.result.advgendertype){
				return wx.showModal({
					title: '',
					content: '仅限' + ["", "男性", "女性"][that.data.result.advgendertype]+"参与",
					showCancel:false
				})
			}else{
				console.log("通过");
			}
		}

		if (that.data.result.advbarcode != "") {
			console.log("校验条码");
			if (that.data.scanBarcodeResult != that.data.result.advbarcode) {
				function startScan(){
					wx.scanCode({
						onlyFromCamera: true,
						scanType: ["barCode"],
						success: function (res) {
							that.data.scanBarcodeResult=res.result;
							if (that.data.scanBarcodeResult != that.data.result.advbarcode) {
								wx.showModal({
									title: '',
									content: '请仔细查看抽奖详情，扫描指定的条形码',
									confirmText:"知道了",
									showCancel:false
								})
							}else{
								wx.showToast({
									title: '条形码正确',
								})
							}
						}
					})
				}
				
				return wx.showModal({
					title: '',
					content: '请扫描指定的条形码参与抽奖',
					confirmText:"开始扫码",
					success:function(res){
						if(res.confirm){
							startScan();
						}
					}
				})
			} else {
				console.log("通过");
			}
		}
		
		if (that.data.result.advcoinbottom != 0) {
			console.log("校验RP余额");
			if (app.globalData.userInfo.coin < that.data.result.advcoinbottom) {
				return wx.showModal({
					title: '',
					content: "RP币余额大于" + that.data.result.advcoinbottom+"才可参与抽奖",
					confirmText: "查看余额",
					success:function(res){
						if(res.confirm){
							wx.navigateTo({
								url: '/pages/my/wallet',
							})
						}
					}
				})
			} else {
				console.log("通过");
			}
		}
		
		if (that.data.result.advneedinfokey != "") {
			console.log("校验必备字段");
			var optiondetailObj={};
			for (var index in app.globalData.userInfo.optiondetail){
				optiondetailObj[app.globalData.userInfo.optiondetail[index].key] = app.globalData.userInfo.optiondetail[index].value;
			}
			if (!optiondetailObj[that.data.result.advneedinfokey]) {
				return wx.showModal({
					title: '',
					content: "我的资料中包含" + that.data.result.advneedinfokey + "才可参与抽奖",
					confirmText:"前往填写",
					success:function(res){
						if(res.confirm){
							wx.navigateTo({
								url: '/pages/my/userotherinfo',
							})
						}
					}
				})
			} else {
				console.log("通过");
			}
		}

		if (success) success();
	},
	btnOpenLucky:function(){
		var that=this;

		wx.request({
			url: app.ServerUrl() + '/api/openluckydraw.php',
			method: 'GET',
			header: {
				'Cookie': 'PHPSESSID=' + app.globalData.sessionid
			},
			data: {
				'id': that.data.id
			},
			success: function (res) {
				wx.showModal({
					title: '',
					content: res.data.msg,
					showCancel: false,
					success:function(res){
						if(res.confirm){
							that.updateDetail();
						}
					}
				})
			}
		});
	},
	btnJoinLuckyDraw:function(e){
		var that=this;
		app.postFormId(e.detail.formId);
		that.verifyJoinCondition(function(){
			console.log("可以参与");
			// return;
			wx.showLoading({
				title: '加入中',
				mask:true
			})
			
			wx.request({
				url: app.ServerUrl() + '/api/joinluckydraw.php',
				method: 'POST',
				header: {
					'Cookie': 'PHPSESSID=' + app.globalData.sessionid
				},
				data: {
					'id': that.data.id,
					'inviterid': that.data.inviterid,
					'token': app.globalData.token
				},
				complete:function(){
					wx.hideLoading();
				},
				success: function (res) {
					wx.hideLoading();
					if (parseInt(res.data.err) == 0) {
						wx.showToast({
							title: '已参加，等待开奖吧',
						})
						that.updateDetail();
						app.globalData.userInfo.coin = parseInt(app.globalData.userInfo.coin) - 1;
					} else {
						wx.showModal({
							title: '',
							content: res.data.msg,
							showCancel: false
						})
					}
				}
			});
		});
	},
	btnAllJoiner:function(){
		var that=this;
		wx.navigateTo({
			url: '/pages/luckydraw/alljoiner?id='+that.data.id,
		})
	},
	startTimer:function(){
		var that=this;
		function countdown(reDrawCircle=false){
			var now=new Date().getTime();
			var distanceOpen;
			var distanceOpenStr="";
			
			if(that.data.result.opentype==0){
				var distanceSec = that.data.result.opendate - Math.floor(now / 1000);
				if (distanceSec <= 0) distanceSec=0;
				distanceOpen = distanceSec / (that.data.result.opendate - that.data.result.createdate)*300;
				
				var dishour = Math.floor(distanceSec / 3600);
				var disminute = Math.floor(distanceSec / 60%60);
				var dissec = Math.floor(distanceSec % 60);
				
				distanceOpenStr = "还有" + dishour + "小时" + disminute + "分" + dissec+"秒";
			} else if (that.data.result.opentype == 1){
				distanceOpen = (that.data.result.openneedusers-that.data.result.totalusers) / that.data.result.openneedusers * 300;
				distanceOpenStr = "还差" + (that.data.result.openneedusers - that.data.result.totalusers)+"人即可开奖";
			}

			var updateParams={
				distanceOpenStr: distanceOpenStr
			};

			if (reDrawCircle) updateParams.distanceOpen=distanceOpen;

			that.setData(updateParams);
		}
		clearInterval(timer);
		if(that.data.result.opentype==0)timer = setInterval(function(){
			countdown(false);
		},1000);
		countdown(true);
	},
	updateDetail:function(){
		var that=this;
		wx.request({
			url: app.ServerUrl() + '/api/getluckydrawdetail.php',
			method: 'GET',
			header: {
				'Cookie': 'PHPSESSID=' + app.globalData.sessionid
			},
			data:{
				id:that.data.id,
				inviterid: that.data.inviterid
			},
			success: function (res) {
				if(parseInt(res.data.err)==0){

					var result = res.data.result;

					if (result["awardimage"]!=""){
						result["awardimage"] = app.CDNUrl() +"/upload/"+ result["awardimage"];
					}else{
						result["awardimage"]="../../images/defaultawardimage.jpg";
					}
					result["opendatestr"] = util.formatDate(new Date(result["opendate"]*1000),"MM月dd日 hh:mm");
					result["opentypestr"] = ["自动开奖", "参与者达到 " + result['openneedusers'] + " 人时自动开奖", "发起人手动开奖"][result['opentype']];
					
					if (result.awardpics.length>0){
						for (var i = 0; i < result.awardpics.length;i++){
							result.awardpics[i] = app.CDNUrl() + "/upload/" + result.awardpics[i];
						}
					}

					var nowsec=new Date().getTime()/1000;
					that.setData({
						result: result,
						canstart:result.startdate<nowsec,
						startdis:Math.ceil((result.startdate-nowsec)/86400),
						startformat:util.formatDate(new Date(result.startdate*1000),"M月d日 hh:mm"),
						isowner: app.globalData.userInfo?result.ownerid==app.globalData.userInfo.id:false
					});

					//判断是否显示开奖进度，必须放在最后
					if (result['opentype'] != 2) {
						that.startTimer();
					}
				}
			}
		});
	},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
		var that=this;
		console.log("页面参数",options);
		this.setData({
			id:options.id,
			inviterid: options.inviterid ? options.inviterid:null
		});

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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
		this.updateDetail();
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
		var that=this;
		var path = '/pages/index/index?luckydrawid=' + that.data.id;
		if(that.data.result.isjoined){
			// path='/pages/index/index?scene=luckydrawid' + that.data.id + '_inviterid' + app.globalData.userInfo.id;
			path = path+"&inviterid="+app.globalData.userInfo.id;
		}
		return {
			title: "免费抽["+that.data.result.awardname+"]，速度参与，人品爆发！",
			path: path,
			success: function (res) {
				// 转发成功
			},
			fail: function (res) {
				// 转发失败
			}
		}
  }
})