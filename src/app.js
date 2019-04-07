//app.js
App({
  ServerUrl: function () {
    return "https://jnsii.com/zj/";
  },
  CDNUrl: function () {
    return "http://file.jnsii.com/zj/";
  },
	ShortVersion:function(){
		return "v0.71 羊毛版";
	},
  BuildVersion: function () {
    return 1;
  },
	postStats: function (scene,extparams=null) {
		var that = this;
		var params = extparams ? extparams:{};
		params.scene = scene;
		params.token = that.globalData.token;
		wx.request({
			url: that.ServerUrl() + '/api/poststats.php',
			method: 'POST',
			header: {
				'Cookie': 'PHPSESSID=' + that.globalData.sessionid
			},
			data: params,
			complete: function () {

			},
			success: function (res) {
				console.log(res.data);
				if (parseInt(res.data.err) == 0) {

				}
			}
		});
	},
  postFormId: function (formid) {
    var that = this;
    wx.request({
      url: that.ServerUrl() + '/api/reportformid.php',
      method: 'POST',
      header: {
        'Cookie': 'PHPSESSID=' + that.globalData.sessionid
      },
      data: {
        formid: formid,
        token: that.globalData.token
      },
      complete: function () {

      },
      success: function (res) {
        console.log(res.data);
        if (parseInt(res.data.err) == 0) {

        }
      }
    });
  },
  getPrevPage: function () {
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];

    return prevPage;
  },
  setTabIndex:function(index){
		var pages = getCurrentPages();
		var currentUrl = "/"+pages[pages.length - 1].route;
		
    var url="";
    if(index==0){
      url="/pages/index/index";
    }else if(index==1){
      url = "/pages/my/index";
    }

		if (url!=currentUrl){
			wx.redirectTo({
				url: url,
			})
		}
  },
  login: function (callback) {
    var that = this;
    this.getUserInfo(function (obj) {
      that.getMemberInfo(obj, function (result) {
        that.globalData.userInfo = result;
        that.globalData.token = result.token;
        that.globalData.sessionid = result.sessionid;
        if (callback) callback();
      });
    });
  },
  authorizeCheck: function (scope) {
    var that = this;
    wx.getSetting({
      success: function (res) {
        if (!res.authSetting[scope]) {
          wx.showModal({
            title: '',
            content: '请打开必须的授权设置',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                wx.openSetting({
                  success: function (res) {
                    console.log(res);
                    if (res.authSetting[scope] == true) {
                      that.login();
                    }
                  }
                });
              }
            }
          })
        }
      }
    })
  },
  getMemberInfo: function (obj, cb) {
    var that = this;
    wx.request({
      url: that.ServerUrl() + '/api/login.php',
      method: 'POST',
      data: obj,
      success: function (res) {
        if (parseInt(res.data.err) == 0) {
          if (cb) cb(res.data.result);
        } else {
          wx.showModal({
            title: '',
            content: res.data.msg
          })
        }
      }
    })
  },
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function (res) {
          wx.getUserInfo({
            success: function (res2) {
              that.globalData.userInfo = res2.userInfo;
              wx.request({
                url: that.ServerUrl() + '/api/getopenid.php',
                method: 'POST',
                data: {
                  code: res.code
                },
                success: function (res3) {
                  that.globalData.session_key = res3.data.result.session_key;
                  that.globalData.userInfo.openid = res3.data.result.openid;
                  typeof cb == "function" && cb(that.globalData.userInfo)
                }
              })
            },
            fail: function () {
              that.authorizeCheck("scope.userInfo");
            }
          });
        }
      })
    }
  },
	uploadPictrue:function(filepath,params,cb){
		var that=this;
		if (!params) params = { token: that.globalData.token};
		else params.token=that.globalData.token;
		wx.uploadFile({
			url: that.ServerUrl() + '/api/uploadpic.php',
			filePath: filepath,
			name: 'picture',
			formData: params,
			header: {
				'Cookie': 'PHPSESSID=' + that.globalData.sessionid
			},
			success: function (res) {
				var obj = JSON.parse(res.data);
				if (parseInt(obj.err) == 0) {
					if (cb) cb(obj);
				}
			},
			fail: function (res) {
				console.log("fail");
				console.log(res);
			}
		})
	},
  onLaunch: function () {
    var that=this;
    if (that.globalData.userInfo == null) {
      wx.getSetting({
        success: function (res) {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称
            wx.getUserInfo({
              success: function (res) {
                that.login();
              }
            })
          }
        }
      })
    }
  },
  globalData: {
    userInfo: null
  }
	,
	getRandomShareTitle:function(){
		var arr=[
			"推荐你用[众奖]小程序，免费抽奖，天天有奖！",
			"这个小程序可以免费抽奖，运气好谁都挡不住！",
			"平时积攒人品，运气来的时候挡都挡不住！",
			"多分享多参与，众奖天天有奖等着你~",
			"分享是攒人品最好的方式，人品好，运气必须好~"
		];

		if (this.globalData.shareapptext){
			arr = this.globalData.shareapptext;
		}

		return arr[Math.floor(Math.random() * arr.length)];
	},
	getMainAppShare:function(){
		return {
			title: this.getRandomShareTitle(),
			path: '/pages/index/index',
			success: function (res) {
				// 转发成功
			},
			fail: function (res) {
				// 转发失败
			}
		}
	}
})