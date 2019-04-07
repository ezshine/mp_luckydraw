// pages/create/create.js
const app = getApp();
var util = require('../../utils/util.js');
var weekstr = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
Page({

  /**
   * 页面的初始数据
   */
  data: {
		showAdvance:false,
		showPasswordEditor:false,
    files:[],
    maxfile:4,
		pickerDates:[],
    pickerDateIndexs:[0,0,0],
		openTypeNames:["按时间自动开奖","按人数自动开奖","手动开奖"],
		openTypeDescs:["到达设定时间自动开奖","到达设定人数自动开奖","由发起人手动开奖"],
		openType:0,
		openNeedUsers:1,
		awardNum:"",
		awardName:"",
		awardImage:"",
    advDistanceTypeStr:["不限制","1公里","5公里","10公里","30公里","50公里"],
    advDistanceType:0,
    advGenderTypeStr:["不限制","限男性","限女性"],
    advGenderType:0,
		advCoinBottom:"",
    advBarCode:"",
		advPassword:"",
		advPasswordTips:"",
    advGPSCity:"",
    advGPS:"",
    advGPSAddr:"",
		advNeedInfoKey:"",
		advShare:0,
		advIsPublic:0
  },
	inputAdvCoinBottom:function(e){
		var that=this;
		that.setData({
			advCoinBottom: e.detail.value
		});
	},
	inputOpenNeedUsers: function (e) {
		var that = this;
		that.setData({
			openNeedUsers: e.detail.value
		});
	},
	inputAdvNeedInfoKey:function(e){
		var that = this;
		that.setData({
			advNeedInfoKey: e.detail.value.toUpperCase()
		});
	},
	inputAdvPassword:function(e){
			this.setData({
				advPassword: e.detail.value.toUpperCase()
			});
	},
	inputAdvPasswordTips: function (e) {
		this.setData({
			advPasswordTips: e.detail.value
		});
	},
	btnClearAdvPassword:function(){
		this.setData({
			advPassword:"",
			advPasswordTips:"",
			showPasswordEditor:false
		});
	},
	btnSaveAdvPassword:function(){
		this.setData({
			showPasswordEditor: false
		});
	},
	btnShowPasswordEditor:function(){
		this.setData({
			showPasswordEditor:true
		});
	},
	btnAdvIsPublic:function(){
		var that = this;

		wx.showActionSheet({
			itemList: ["私密", "公开"],
			success: function (res) {
				if (res.tapIndex == 0) {
					that.setData({
						advIsPublic: 0
					});
				} else if (res.tapIndex == 1) {
					that.setData({
						advIsPublic: 1
					});
				}
			}
		})
	},
	btnAdvShare:function(){
		var that=this;

		wx.showActionSheet({
			itemList: ["关闭","开启"],
			success:function(res){
				if(res.tapIndex==0){
					that.setData({
						advShare:0
					});
				} else if (res.tapIndex == 1) {
					that.setData({
						advShare: 1
					});
				}
			}
		})
	},
	btnScanAdvBarcode:function(){
		var that=this;

		function startScan(){
			wx.scanCode({
				onlyFromCamera: true,
				scanType: ["barCode"],
				success: (res) => {
					if (res.errMsg == "scanCode:ok") {
						that.setData({
							advBarCode: res.result
						});
					} else {

					}
				}
			})
		}

		if (util.trimStr(that.data.advBarCode)==""){
			startScan();
		}else{
			wx.showActionSheet({
				itemList: ["清除", "重新扫描"],
				success: function (res) {
					if(res.tapIndex==0){
						that.setData({
							advBarCode:""
						});
					}else if(res.tapIndex==1){
						startScan();
					}
				}
			})
		}
	},
	btnChooseAdvLocation:function(){
		var that=this;

		function startChoosLocation(){
			wx.chooseLocation({
				success: function (res) {
					console.log(res);
					that.setData({
						advGPS: res.latitude + "," + res.longitude,
						advGPSAddr: res.name,
						advGPSCity: util.getCityFromStr(res.address)
					});
				},
				fail:function(res){
					console.log(res);
					wx.openSetting({});
				}
			})
		}
		if (util.trimStr(that.data.advGPS) == "") {
			startChoosLocation();
		} else {
			wx.showActionSheet({
				itemList: ["清除", "重新选择"],
				success: function (res) {
					if (res.tapIndex == 0) {
						that.setData({
							advGPS: "",
							advGPSAddr:"",
							advGPSCity:""
						});
					} else if (res.tapIndex == 1) {
						startChoosLocation();
					}
				}
			})
		}
	},
	btnChangeAdvDistance:function(){
		var that=this;
		wx.showActionSheet({
			itemList: that.data.advDistanceTypeStr,
			success:function(res){
				that.setData({
					advDistanceType:res.tapIndex
				});
			}
		})
	},
	btnChangeAdvGender:function(){
		var that = this;
		wx.showActionSheet({
			itemList: that.data.advGenderTypeStr,
			success: function (res) {
				that.setData({
					advGenderType: res.tapIndex
				});
			}
		})
	},
	btnChangeCover:function(){
		var that=this;
		wx.chooseImage({
			count:1,
			sizeType: ['compressed'],
			sourceType: ['album', 'camera'],
			success: function(res) {
				that.setData({
					awardImage:res.tempFilePaths[0]
				});
			},
		})
	},
	pickerDateChange:function(e){
		this.setData({
			pickerDateIndexs: e.detail.value
		});
	},
	btnChangeOpenType:function(){
		var that=this;
		wx.showActionSheet({
			itemList: that.data.openTypeNames,
			success:function(res){
				that.setData({
					openType:res.tapIndex
				});
			}
		})
	},
	btnShowAdvance:function(){
		if (this.data.showAdvance){
			this.setData({
				showAdvance: !this.data.showAdvance,
				advDistanceType: 0,
				advGenderType: 0,
				advCoinBottom: "",
				advPassword: "",
				advPasswordTips: "",
				advGPSCity: "",
				advGPS: "",
				advGPSAddr: "",
				advNeedInfoKey:""
			});
		}else{
			this.setData({
				showAdvance: !this.data.showAdvance
			});
		}
	},
	inputAwardName:function(e){
		this.setData({
			awardName:e.detail.value
		});
	},
	inputAwardNum:function(e){
		this.setData({
			awardNum: e.detail.value
		});
	},
  btnTips:function(e){
		wx.showModal({
			title: '小窍门',
			content: e.currentTarget.dataset.tips,
			showCancel:false
		})
  },
	btnSubmit:function(){
		var that=this;
		if (util.trimStr(that.data.awardName)==""){
			return wx.showModal({
				title: '',
				content: '请填写奖品名称',
				showCancel:false
			})
		} else if (util.trimStr(that.data.awardNum)=="" || parseInt(that.data.awardNum) <=0) {
			return wx.showModal({
				title: '',
				content: '请填写奖品数量',
				showCancel: false
			})
		}
		var params ={};
		var awardDescArray=[];
		function step2(){
			if (util.trimStr(that.data.awardImage)!=""){
				app.uploadPictrue(that.data.awardImage,{a:"cover"},function(res){
					that.data.awardImage=res.result.filename;
					params.awardimage = res.result.filename;
					step3();
				});
			}else{
				step3();
			}
		}
		function step3(){
			if (that.data.files.length>0){
				var index=0;
				function uploadNext(){
					console.log(that.data.files[index]);
					app.uploadPictrue(that.data.files[index],{},function(res){
						awardDescArray.push(res.result.filename);
						
						if(index<that.data.files.length-1){
							index+=1;
							uploadNext();
						}else{
							params.awardpics = awardDescArray.join(",");
							step4();
						}
					});
				}
				uploadNext();
			}else{
				step4();
			}
		}
		function step1(){
			var openDate=null;
			if(that.data.openType==0){
				var openDateStr = that.data.pickerDates[0][that.data.pickerDateIndexs[0]] + " " + that.data.pickerDates[1][that.data.pickerDateIndexs[1]] + ":" + that.data.pickerDates[2][that.data.pickerDateIndexs[2]];
				var openDateArr=openDateStr.split(" ");
				openDateStr = openDateArr[0] +" "+ openDateArr[2];

				openDateStr=openDateStr.replace(/-/g, "/");

				openDate = new Date(openDateStr);

				console.log(openDateStr);
				console.log(openDate.getTime());

				if (openDate.getTime()<=new Date().getTime()){
					wx.hideLoading();
					return wx.showModal({
						title: '',
						content: '开奖时间已过期，请重新选择',
						showCancel:false
					})
				}
			} else if (that.data.openType ==1){
				if (that.data.openNeedUsers<=0) {
					wx.hideLoading();
					return wx.showModal({
						title: '',
						content: '至少有1人方可开奖',
						showCancel: false
					})
				}
			}
			
			params={
				awardimage:"",
				awardpics:"",
				awardname:that.data.awardName,
				awardnum:parseInt(that.data.awardNum),
				opentype:that.data.openType,
				opendate: openDate ? openDate.getTime()/1000:openDate,
				openneedusers: that.data.openNeedUsers,
				advdistancetype: that.data.advDistanceType,
				advgendertype: that.data.advGenderType,
				advcoinbottom: that.data.advCoinBottom,
				advbarcode: that.data.advBarCode,
				advpassword: that.data.advPassword,
				advpasswordtips: that.data.advPasswordTips,
				advgpscity: that.data.advGPSCity,
				advgps: that.data.advGPS,
				advgpsaddr: that.data.advGPSAddr,
				advneedinfokey: that.data.advNeedInfoKey,
				advshare: that.data.advShare,
				advispublic: that.data.advIsPublic
			}

			if(that.data.id){
				params.id = that.data.id;
			}

			step2();
		}
		function step4(){
			console.log(params);
			wx.request({
				url: app.ServerUrl() + '/api/postluckdraw.php',
				method: 'POST',
				header: {
					'Cookie': 'PHPSESSID=' + app.globalData.sessionid
				},
				data: params,
				complete:function(){
					wx.hideLoading();
				},
				success: function (res) {
					wx.hideLoading();
					if (parseInt(res.data.err) == 0) {
						var obj=res.data;
						wx.showModal({
							title: '',
							content: res.data.msg,
							cancelText:"返回",
							confirmText:"查看抽奖",
							success:function(res){
								if(res.cancel){
									wx.navigateBack({});
								}else if(res.confirm){
									wx.redirectTo({
										url: '/pages/luckydraw/detail?id=' + obj.result.id,
									});
								}
							}
						})
						
					} else {
						wx.showModal({
							title: '',
							content: res.data.msg,
							showCancel:false
						})
					}
				}
			})
		}

		wx.showModal({
			title: '',
			content: '确定发起新的抽奖吗？',
			success:function(res){
				if(res.confirm){
					wx.showLoading({
						title: '正在发起',
						mask: true
					})
					step1();
				}
			}
		})
	},
  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['compressed'], //'original', 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        
        var files=that.data.files;
        var curLenth=files.length;
        console.log("本次选择:"+res.tempFilePaths.length);
        console.log("可选总数，当前总数:", that.data.maxfile, curLenth);
        for (var i = 0; i < that.data.maxfile - curLenth;i++){
          console.log(i);
          if (res.tempFilePaths[i]){
            console.log(i);
            files.push(res.tempFilePaths[i]);
          }
        }
        
        that.setData({
          files: files
        });
      }
    })
  },
  previewImage: function(e){
    var that=this;

    var index = e.currentTarget.id.substr(4, e.currentTarget.id.length);
    wx.showActionSheet({
      itemList: ["预览","删除此照片"],
      success:function(res){
        if(res.tapIndex==0){
          wx.previewImage({
            current: that.data.files[index], // 当前显示图片的http链接
            urls: that.data.files // 需要预览的图片http链接列表
          })
        } else if (res.tapIndex == 1){
          var files = that.data.files;
          files.splice(index, 1);
          that.setData({
            files: files
          });
        }
      }
    });
  },
	bindGetUserInfo: function (e) {
		var that = this;
		wx.getUserInfo({
			success: function (res) {
				app.login(function () {
					that.setData({ userInfo: app.globalData.userInfo });
				});
			}
		})
	},
	updateDetail: function () {
		var that = this;
		wx.request({
			url: app.ServerUrl() + '/api/getluckydrawdetail.php?id=' + that.data.id,
			method: 'GET',
			header: {
				'Cookie': 'PHPSESSID=' + app.globalData.sessionid
			},
			success: function (res) {
				if (parseInt(res.data.err) == 0) {

					var result = res.data.result;

					var showAdvance=false;
					if (result.advgps != '' || result.advcoinbottom != '' || result.advbarcode != '' || result.advpassword != '' || result.advshare == 1 || result.advneedinfokey != '') {
						showAdvance=true;
					}

					wx.showToast({
						title: '请重设开奖时间',
						icon:"none",
						mask:true
					})
					// var opendate = new Date(parseInt(result.opendate)*1000);
					// var hour = opendate.getHours();

					// var minute = opendate.getMinutes();
					// if (minute > 30) {
					// 	hour =z hour + 1;
					// 	minute = 0;
					// } else {
					// 	minute = 1;
					// }

					var awardImage = result.awardimage;
					if(result.awardimage!=""){
						awardImage = app.ServerUrl() + "/upload/" + result.awardimage;
						wx.downloadFile({
							url: awardImage, 
							success: function (res) {
								if (res.statusCode === 200) {
									that.setData({
										awardImage: res.tempFilePath
									});
								}
							}
						})
					}

					var files=[];
					for (var i = 0; i < result.awardpics.length;i++){
						var awardpic=app.ServerUrl() + "/upload/" + result.awardpics[i];
						wx.downloadFile({
							url: awardpic,
							success: function (res) {
								if (res.statusCode === 200) {
									files.push(res.tempFilePath);
									if (files.length >= result.awardpics.length){
										that.setData({
											files: files
										});
									}
								}
							}
						})
					}

					that.setData({
						awardName:result.awardname,
						awardNum:result.awardnum,
						openType:result.opentype,
						openNeedUsers: result.openneedusers,
						openDate:result.opendate,
						showAdvance: showAdvance,
						advDistanceType: result.advdistancetype,
						advGenderType: result.advgendertype,
						advCoinBottom: result.advcoinbottom,
						advBarCode: result.advbarcode,
						advPassword: result.advpassword,
						advPasswordTips: result.advpasswordtips,
						advGPSCity: result.advgpscity,
						advGPSAddr: result.advgpsaddr,
						advGPS: result.advgps,
						advNeedInfoKey: result.advneedinfokey,
						advShare: result.advshare,
						advIsPublic: result.advispublic
					});
				}
			}
		});
	},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var pickerDates=[[],[],[]];

    var now=new Date();
    for(var i=0;i<7;i++){
      pickerDates[0].push(util.formatDate(now,"yyyy-MM-dd")+" "+weekstr[now.getDay()]);
      now.setDate(now.getDate()+1);
    }

    for(var i=0;i<24;i++){
      pickerDates[1].push(util.formatNumber(i));
    }

    pickerDates[2].push("00");
    pickerDates[2].push("30");

		var now=new Date();
		var hour=now.getHours();
		hour = hour + 1;

		var minute=now.getMinutes();
		if (minute>30){
			minute=0;
		}else{
			minute=1;
		}

    this.setData({
			pickerDateIndexs:[0,hour,minute],
      pickerDates:pickerDates,
			userInfo:app.globalData.userInfo
    });

		if(options.id){
			this.data.id = options.id;
			this.updateDetail();
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
		return app.getMainAppShare();
  }
})