<template>
  <div>
    <div>
      <input v-model="addrStr" />
      <button @click="addressResolution">地址解析</button>
      <input v-model="longitudeAndLatitude" />
      <button @click="inverseAddressResolution">逆地址解析</button>
    </div>
    <div>
      <label for="start">起点</label>
      <input id="start" v-model="startPoint" />
      <label for="end">终点</label>
      <input id="end" v-model="endPoint" />
      <button @click="ana">路线规划</button>
      <button @click="clear">清除路线规划</button>
    </div>

    <div id="mapContent" class="mapContent" ></div>
  </div>
</template>
<script>
import BMap from "BMap";
export default {
  name: "baiduMap",
  components: {},
  data() {
    return {
      addrStr: "沈阳市",
      longitudeAndLatitude: "123.805961, 43.083229",
      map: null,
      startPoint: "北京市",
      endPoint: "沈阳市",
      driving: ""
    };
  },
  methods: {
    clear() {
      this.driving.clearResults();
    },
    ana() {
      var myGeo = new BMap.Geocoder();
      myGeo.getPoint(this.startPoint, startPoint => {
        myGeo.getPoint(this.endPoint, endPoint => {
          var start = new BMap.Point(startPoint.lng, startPoint.lat);
          // 终点
          var end = new BMap.Point(endPoint.lng, endPoint.lat);
          if (this.driving) {
            this.driving.clearResults();
          } else {
            var driving = new BMap.DrivingRoute(this.map, {
              renderOptions: {
                map: this.map,
                autoViewport: true,
                panel: document.querySelector("r-reslut")
              }
            });
            this.driving = driving;
          }
          this.driving.search(start, end);
        });
      });
    },
    addressResolution() {
      var myGeo = new BMap.Geocoder();
      const that = this;
      // 将地址解析结果显示在地图上，并调整地图视野  这里val就是想要查找的地址,point就是返回的经纬度
      myGeo.getPoint(this.addrStr, point => {
        if (point) {
          that.map.centerAndZoom(point, 16);
          that.map.addOverlay(new BMap.Marker(point));
        }
      });
    },
    inverseAddressResolution() {
      var lng = this.longitudeAndLatitude.split(",")[0];
      var lat = this.longitudeAndLatitude.split(",")[1];
      var myGeo = new BMap.Geocoder();
      // 根据坐标得到地址描述
      myGeo.getLocation(new BMap.Point(lng, lat), function(result) {
        if (result) {
          alert(result.address);
        }
      });
    },
    addClickHandler(content, marker, map) {
      const that = this;
      marker.addEventListener("click", function(e) {
        that.openInfo(content, e, map);
      });
    },
    openInfo(content, e, map) {
      // 定义窗口信息
      const opts = {
        width: 250, // 信息窗口宽度
        height: 120, // 信息窗口高度
        title: "信息窗口", // 信息窗口标题
        enableMessage: true //设置允许信息窗发送短息
      };
      var p = e.target;
      var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
      var infoWindow = new BMap.InfoWindow(
        `
          <div>
            地点：${content[0]} <br />
            人物：${content[1]} <br />
            事件：${content[2]} <br />
          </div>
        `,
        opts
      ); // 创建信息窗口对象

      map.openInfoWindow(infoWindow, point); //开启信息窗口
    }
  },
  mounted() {
    const map = new BMap.Map("mapContent", { minZoom: 4, maxZoom: 14 });
    this.map = map;
    const point = new BMap.Point(116, 39);
    map.centerAndZoom("北京", 14);
    map.enableScrollWheelZoom(true);

    // 混合图
    var mapType = new BMap.MapTypeControl({
      mapTypes: [BMAP_NORMAL_MAP, BMAP_HYBRID_MAP],
      anchor: BMAP_ANCHOR_TOP_LEFT
    });

    // 鹰眼图
    var overView = new BMap.OverviewMapControl();

    // 比例尺
    var top_left_control = new BMap.ScaleControl({
      anchor: BMAP_ANCHOR_TOP_LEFT
    });

    // 添加默认缩放平移控件
    var top_left_navigation = new BMap.NavigationControl({
      anchor: BMAP_ANCHOR_TOP_RIGHT,
      type: BMAP_NAVIGATION_CONTROL_SMALL
    });

    map.addControl(mapType);
    map.addControl(overView);
    map.addControl(top_left_control);
    map.addControl(top_left_navigation);

    const data = [
      {
        lon: 116.304854,
        lat: 39.921988,
        address: "地点1",
        people: "周元",
        doThing: "暴揍赵牧神"
      },
      {
        lon: 116.417824,
        lat: 39.92191,
        address: "地点2",
        people: "夭夭",
        doThing: "沉睡冰棺"
      },
      {
        lon: 116.517777,
        lat: 39.821999,
        address: "地点3",
        people: "吞吞",
        doThing: "死亡历练"
      }
    ];

    for (var i = 0; i < data.length; i++) {
      var marker = new BMap.Marker(new BMap.Point(data[i].lon, data[i].lat)); // 创建标注

      var content = [data[i].address, data[i].people, data[i].doThing];

      map.addOverlay(marker); // 将标注添加到地图上
      this.addClickHandler(content, marker, map); // 添加一个点击事件 将我们的map传递过去
    }

    var geoc = new BMap.Geocoder();
    map.addEventListener("click", function(e) {
      var pt = e.point;
      geoc.getLocation(pt, function(rs) {
        var addComp = rs.addressComponents;
        alert(
          addComp.province +
            ", " +
            addComp.city +
            ", " +
            addComp.district +
            ", " +
            addComp.street +
            ", " +
            addComp.streetNumber
        );
      });
    });
  }
};
</script>
<style>
.mapContent {
  width: 100%;
  height: 100vh;
}
</style>
