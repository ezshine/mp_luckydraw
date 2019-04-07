// pages/map/index.js
var app = getApp();
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mapHeight: 0,
    markers: [],
    centerLat: 0,
    centerLng: 0,
    curUserLat: 0,
    curUserLng: 0,
    inputShowed: false,
    inputVal: "",
    searchResult: []
  },
	goCreate: function (e) {
		wx.navigateTo({
			url: '/pages/create/create',
		})
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
    this.searchShelfBy(this.data.city);
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
    this.searchShelfBy(this.data.city);
  },
  inputTyping: function (e) {
    if (util.trimStr(e.detail.value) != "") {
      this.setData({
        inputVal: util.trimStr(e.detail.value)
      });
      this.searchShelfBy(util.trimStr(e.detail.value));
    } else {
      this.clearInput();
    }
  },
  regionchange(e) {
    console.log(e);
    var map = wx.createMapContext('map');
    map.getCenterLocation({
      success: function (res) {
        console.log(res);
      }
    });
  },
  markertap(e) {
    console.log(e.markerId);
    var id = e.markerId.substr(3, e.markerId.length);
    
		wx.navigateTo({
			url: '/pages/luckydraw/detail?id=' + id,
		})
  },
  /**
   * 生命周期函数--监听页面加载
   */
  searchShelfBy:function(kw){
    var that = this;
    wx.request({
      url: app.ServerUrl() + '/api/listluckydraw.php',
      method: 'GET',
      header: {
        'Cookie': 'PHPSESSID=' + app.globalData.sessionid
      },
      data: {
        city: kw,
				type:"city",
        token: app.globalData.token
      },
      success: function (res) {
        if (parseInt(res.data.err) == 0) {
          var markers = [];

          for (var name in res.data.result) {
            var marker = {};

            var item = res.data.result[name];
            
            marker.id = "li_" + item.id;
            
						marker.iconPath = "/images/mapmarker.png";

						item.gps=item.advgps.split(",");

            marker.latitude = parseFloat(item.gps[0]);
            marker.longitude = parseFloat(item.gps[1]);

            marker.width = 55;
            marker.height = 60;

            markers.push(marker);
          };

          that.setData({
            markers: markers
          });

          var mapCtx = wx.createMapContext('map');
          mapCtx.includePoints({
            padding: [10, 10, 10, 10],
            points: markers.concat({ latitude: that.data.curUserLat, longitude: that.data.curUserLng})
          })
        }
      }
    })
  },
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          mapHeight: res.windowHeight-46
        });
        console.log(res);
      }
    });
    wx.getLocation({
      success: function (res) {
        that.setData({
          centerLat: res.latitude,
          centerLng: res.longitude,
          curUserLat: res.latitude,
          curUserLng: res.longitude
        });
        util.getCityFromLocation(res.latitude + "," + res.longitude, function (obj) {
          var city = obj.addressComponent.city;
          var shiIndex = city.lastIndexOf("市");
          if (shiIndex>=0){
            city = city.substr(0, shiIndex);
          }
          that.setData({
            city:city
          });
          that.searchShelfBy(city);
        });
      },
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
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
		return app.getMainAppShare();
  }
})