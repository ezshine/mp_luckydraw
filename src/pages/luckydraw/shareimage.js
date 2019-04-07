// pages/book/shelfimage.js
var app=getApp();
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgHeight:600
  },

  /**
   * 生命周期函数--监听页面加载
   */
  btnSaveImage:function(){
    var that=this;
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: that.data.sysInfo.windowWidth,
      height: that.data.imgHeight,
      // destWidth: that.data.sysInfo.windowWidth,
      // destHeight: that.data.imgHeight,
      canvasId: 'mycanvas',
      success: function (res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(res) {
            wx.showModal({
              title: '',
              content: "已保存到手机相册，点击预览并长按图片可直接发送",
							cancelText:"返回",
							confirmText:"预览",
							success:function(res){
								if(res.confirm){
									that.previewCanvasImage();
								}else if(res.cancel){
									wx.navigateBack({
										
									})
								}
							}
            })
          }
        })
      }
    })
  },
	previewCanvasImage:function(){
		var that = this;
		wx.canvasToTempFilePath({
			x: 0,
			y: 0,
			width: that.data.sysInfo.windowWidth,
			height: that.data.imgHeight,
			destWidth: that.data.sysInfo.windowWidth,
			destHeight: that.data.imgHeight,
			canvasId: 'mycanvas',
			success: function (res) {
				wx.previewImage({
					urls: [res.tempFilePath],
				})
			}
		})
	},
	randomShareTile:function(){
		var arr = [
			"这东西挺不错，帮我抽奖你也有机会中！",
			"人品我攒够了，就差你的神助攻了！",
			"这么好的事儿，以后你也AT一下我呗~",
			"快来帮我抽奖，让友谊的小船天长地久~",
			"哥们姐们一起来，咱把这个奖品拿下！"];

		if (app.globalData.shareimagetext) {
			arr = app.globalData.shareimagetext;
		}

		return arr[Math.floor(Math.random() * arr.length)];
	},
  drawCanvasImage:function(){
    function drawDImage(ctx,url, dx, dy, dw, dh,callback) {
      wx.downloadFile({
        url: url, //仅为示例，并非真实的资源
        success: function (res) {
					var tempFilePath=res.tempFilePath;
          wx.getImageInfo({
						src: res.tempFilePath,
						success: function (res) {

							if(!dh){
								dh = dw / res.width * res.height
								ctx.drawImage(tempFilePath, dx, dy, dw, dh);
							}else{
								ctx.drawImage(tempFilePath, dx, dy, dw, dh);
							}
							ctx.draw(true);

							if (callback) callback(dw,dh);
						}
					});
        }
      })
    }
    var that=this;

		var curX=0;

    var ctx = wx.createCanvasContext('mycanvas');
    
    ctx.setFillStyle('#0099ee');
		ctx.fillRect(0, 0, that.data.sysInfo.windowWidth, that.data.imgHeight);

		ctx.setFillStyle('#ffffff');
		ctx.fillRect(4, 4, that.data.sysInfo.windowWidth - 8, that.data.imgHeight-8);

		ctx.setFillStyle('#000000');
		ctx.setFontSize(16);
		ctx.fillText(that.randomShareTile(), 10, 25);

		var curY=30;

		drawDImage(ctx, that.data.result.awardimage, 4, curY, that.data.sysInfo.windowWidth-8,null,function(nw,nh){
			// console.log(nh);
			curY+=280;
			
			ctx.setFillStyle('#ffffff');
			ctx.fillRect(4, curY, that.data.sysInfo.windowWidth - 8, that.data.imgHeight - curY-8);
		
			curY+=28;

			ctx.setFillStyle('#000000');
			ctx.setFontSize(16);
			var metrics = ctx.measureText(that.data.result.awardname);
			ctx.fillText(that.data.result.awardname, (that.data.sysInfo.windowWidth - metrics.width) / 2, curY);

			// curY += 18;

			// //result["opentypestr"]
			// ctx.setFillStyle('#999999');
			// ctx.setFontSize(12);
			// var metrics = ctx.measureText(that.data.result.opentypestr);
			// ctx.fillText(that.data.result.opentypestr, (that.data.sysInfo.windowWidth - metrics.width) / 2, curY);

			curY += 14;

			ctx.setFillStyle('#ddd');
			ctx.fillRect(10, curY, that.data.sysInfo.windowWidth-20, 1);

			curY += 30;

			ctx.setFillStyle('#0099ee');
			ctx.setFontSize(14);

			var slogan = '众奖：免费抽奖，天天有奖';
			if (app.globalData.shareimageslogan){
				slogan = app.globalData.shareimageslogan;
			}

			var metrics = ctx.measureText(slogan);
			ctx.fillText(slogan, (that.data.sysInfo.windowWidth - metrics.width) / 2, curY);

			curY += 20;

			var qrcodeurl = app.ServerUrl() + '/api/appqrcode.php?path=pages/index/index&scene=luckydrawid' + that.data.result.id;
			if (app.globalData.userInfo && that.data.result.isjoined){
				qrcodeurl = app.ServerUrl() + '/api/appqrcode.php?path=pages/index/index&scene=luckydrawid' + that.data.result.id + '_inviterid' + app.globalData.userInfo.id;
			}
			console.log(qrcodeurl);
			drawDImage(ctx, qrcodeurl, (that.data.sysInfo.windowWidth - 150) / 2, curY, 150, 150);

			curY+=170;

			ctx.setFillStyle('#999999');
			ctx.setFontSize(14);
			var  metrics = ctx.measureText('长按识别或扫码，参与抽奖');
			ctx.fillText("长按识别或扫码，参与抽奖", (that.data.sysInfo.windowWidth - metrics.width) / 2, curY);
		});
		ctx.draw();
  },
  onLoad: function (options) {
    var that=this;
    this.setData({
      id: options.id
    });
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sysInfo: res
        });
				that.updateDetail();
      }
    });
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

					if (result["awardimage"] != "") {
						result["awardimage"] = app.ServerUrl() + "/upload/" + result["awardimage"];
					} else {
						result["awardimage"] = "../../images/defaultawardimage.jpg";
					}
					result["opendatestr"] = util.formatDate(new Date(result["opendate"] * 1000), "MM月dd日 hh:mm");
					result["opentypestr"] = ["自动开奖", "参与者达到 " + result['openneedusers'] + " 人时自动开奖", "发起人手动开奖"][result['opentype']];

					if (result.awardpics.length > 0) {
						for (var i = 0; i < result.awardpics.length; i++) {
							result.awardpics[i] = app.ServerUrl() + "/upload/" + result.awardpics[i];
						}
					}

					that.setData({
						result: result,
					});

					that.drawCanvasImage();
				}
			}
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
  
  }
})