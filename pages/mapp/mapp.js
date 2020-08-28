var app = getApp();
var amap = require('./amap-wx.js');
var key = '960476552c63083f9ff2706d5a9d7f60';//app.data.key;
Page({
  data: {
    aroundList: [
      {
        name: '餐饮',
        id: '050000'
      },
      {
        name: '购物',
        id: '060000'
      },
      {
        name: '生活',
        id: '070000'
      },
      {
        name: '体育休闲',
        id: '080000'
      },
      {
        name: '医疗保健',
        id: '090000'
      },
      {
        name: '住宿',
        id: '100000'
      },
      {
        name: '风景名胜',
        id: '110000'
      },
      {
        name: '公共服务',
        id: '200000'
      }
    ],
    status:null,
    latitude: null,
    longitude: null,
    isShow: false,
    markers: [],
    points: [],
    rangePoints:[],
    location: '',
    name:'',
    address: '',
    forrn:[],
    nlatitude:null,
    nlongitude: null,
    showbtn:false,
    btmshow:''
  },
  onShareAppMessage: function() {
    app.globalData.map = false;
    var lnglat = this.data.forrn[0].location.split(",");
    return this.data.forrn ? {
        title: "我们去" + this.data.forrn[0].name + "吧!",
        path: "/pages/fenxiang/fenxiang?latitude=" + lnglat[1] + "&longitude=" + lnglat[0] + "&name=" + this.data.forrn[0].name + "&address=" + this.data.forrn[0].adres,
        imageUrl: '../../images/come.png'
    } : 1;
  },
  onShow(){
    // 判断是后台切到前台刷新接口
    if (app.globalData.first_load ==true && app.globalData.map == true){
        app.globalData.first_load =false;
        this.setData({
          showbtn:false
        })
        this.onLoad()
    }
  },
  onLoad: function () {
    // 页面加载获取当前定位位置为地图的中心坐标
    var _this = this;
    wx.getLocation({
      type: 'gcj02',
      success(data) {
        if (data) {
          _this.setData({
            latitude: data.latitude,
            longitude: data.longitude,
            nlongitude:data.longitude,
            nlatitude:data.latitude,
            location:data.longitude+','+data.latitude,
            markers:[{
              id:0,
              latitude: data.latitude,
              longitude: data.longitude,
              iconPath: '../../images/ding.png',
              width: 32,
              height: 32
            }]
          });
        }
      },
      fail: function (res) {
        wx.getSetting({
          withSubscriptions: true,
          success:function(res) {
            //说明没有开启位置授权
            if (res.authSetting['scope.userLocation'] ==  false) {
              _this.setData({
                showbtn:true
              })
            }
          }
        })
      }
    });
  },
  bindMark : function() {
    var _this = this;
    var data = this.getRand(_this.data.rangePoints, 1);
    if (data == '' || data == null) {
      wx.showModal({
          title: "温馨提示", // 提示的标题
          content: "请先选择分类哦!", // 提示的内容
          showCancel: false, // 是否显示取消按钮，默认true
          cancelText: "取消", // 取消按钮的文字，最多4个字符
          cancelColor: "#000000", // 取消按钮的文字颜色，必须是16进制格式的颜色字符串
          confirmText: "确定", // 确认按钮的文字，最多4个字符
          confirmColor: "#576B95", // 确认按钮的文字颜色，必须是 16 进制格式的颜色字符串
      });
      return;
    }
    var lnglat = data[0].location.split(",");
    var myAmap = new amap.AMapWX({ key: key });
    myAmap.getRegeo({
      　　iconPath: "../../assets/ding.png",
      　　iconWidth: 22,
      　　iconHeight: 32,
      　　success: function (data) {
          _this.setData({
      　　　　　　markers: [{
      　　　　　　　　latitude: lnglat[1],
      　　　　　　　　longitude: lnglat[0],
      　　　　　　},{
                    latitude: _this.data.nlatitude,
                    longitude: _this.data.nlongitude,
                    id:0,
                    iconPath: '../../images/ding.png',
                    width: 32,
                    height: 32
                    }],
      　　　　});
      　　},
      　　fail: function (info) {
      　　}
      })
    _this.setData({
      forrn:data,
      btmshow:'1'
    })
  },
  onsharetap: function() {
      wx.showModal({
        title: "温馨提示", // 提示的标题
        content: "请先选择一个哦!", // 提示的内容
        showCancel: false, // 是否显示取消按钮，默认true
        cancelText: "取消", // 取消按钮的文字，最多4个字符
        cancelColor: "#000000", // 取消按钮的文字颜色，必须是16进制格式的颜色字符串
        confirmText: "确定", // 确认按钮的文字，最多4个字符
        confirmColor: "#576B95", // 确认按钮的文字颜色，必须是 16 进制格式的颜色字符串
    });
    return;
  },
  getType(e) {//获取选择的附近关键词，同时更新状态
    this.setData({ status: e.currentTarget.dataset.type})
    this.getAround(e.currentTarget.dataset.keywords,e.currentTarget.dataset.type);
  },
  getAround(keywords,types) {//通过关键词获取附近的点，只取前20个，同时保证十个点在地图中显示
    var _this = this;
    var myAmap = new amap.AMapWX({ key: key });
    myAmap.getPoiAround({
      iconPath: '../../images/blue.png',
      iconPathSelected: '../../images/blue.png',
      querykeywords: keywords,
      querytypes: types,
      location: _this.data.location,
      offset:20,
      success(data) {
        if (data.markers) {
          var markers = [], points = [];
          for (var value of data.markers) {
            if(value.id == 0){
              _this.setData({
                name: value.name,
                address: value.address,
                isShow: true
              })
            }
            markers.push({
              id: value.id,
              latitude: value.latitude,
              longitude: value.longitude,
              title: value.name,
              iconPath: value.iconPath,
              width: 32,
              height: 32,
              anchor: { x: .5, y: 1 },
              // label: {
              //   // content: value.name,
              //   color: 'green',
              //   fontSize: 12,
              //   borderRadius: 5,
              //   bgColor: '#fff',
              //   padding: 3,
              //   x: 0,
              //   y: -50,
              //   textAlign: 'center'
              // }
            });
            points.push({
              latitude: value.latitude,
              longitude: value.longitude
            })
          }
          _this.setData({
            markers: markers,
            points: points
          })
        }
        if (data.poisData) {
          var rn = [];
          for (var value of data.poisData) { 
            console.log(value);
            rn.push({
              location:value.location,
              name:value.name,
              juli:value.distance,
              typename:value.type,
              adres:value.address
            })
          }
          //放入data数据中心
          _this.setData({
            rangePoints:rn
          })
        }
      },
      fail: function (info) {
        console.log(info);
        wx.showToast({title: '获取失败!'})
      }
    })
  },
  //随机取出不重复得数据
  getRand(typeData,num){
      let numArr=[];
      let itemData=typeData;
      let arrLength=itemData.length;
      for(let i=0;i<arrLength;i++){
          let len=itemData.length-1;
          let number = Math.floor(Math.random()*len); //生成随机数0-len之间的整数  len得提前减1
          numArr.push(itemData[number]);
          //数组截取掉，避免重复
          // itemData.splice(number,1);
          console.log(itemData.length,arrLength-num);
          return numArr;
      }
  }
});