<template>
  <div>
    <!-- 搜索 -->
    <div class="nav">
      <input @click="tosearch" type="text" placeholder="搜索" />
      <icon type="search" size="14" />
    </div>
    <!-- 轮播 -->
    <swiper class="lunbo" indicator-dots autoplay interval="3000" duration="300" circular>
      <block>
        <swiper-item class="lb-item" v-for="(item, index) in mylist" :key="index">
          <image :src="item.image_src" class="slide-image" />
        </swiper-item>
      </block>
    </swiper>
    <!-- 导航 -->
    <div class="box">
      <div class="box_nav" v-for="(item, index) in boxlist" :key="index">
        <img :src="item.image_src" alt />
        <span>{{item.name}}</span>
      </div>
    </div>
    <!-- 楼层 -->
    <div class="floor" v-for="(item, index) in floorlist" :key="index">
      <div class="title">
        <img :src="item.floor_title.image_src" alt />
        <span>{{item.floor_title.name}}</span>
      </div>
      <div class="f-item">
        <img v-for="(item1, index1) in item.product_list" :key="index1" :src="item1.image_src" alt />
      </div>
    </div>
  </div>
</template>

<script>
import wxrequest from "../../utils/wxrequest";
export default {
  data() {
    return {
      //轮播图数据
      mylist: [],
      //分类数据
      boxlist: [],
      //获取楼层数据
      floorlist: []
    };
  },
  methods: {
    //获取轮播图数据
    async getlunbo() {
      var res = await wxrequest({
        url: "api/public/v1/home/swiperdata"
      });
      // 解析
      // console.log(res);

      let { message, meta } = res.data;
      // 判断
      if (meta.status === 200) {
        this.mylist = message;
      }
    },
    //获取分类数据
    async getcatitms() {
      var res = await wxrequest({
        url: "api/public/v1/home/catitems"
      });
      // console.log(res.data);
      let { message, meta } = res.data;
      if (meta.status === 200) {
        this.boxlist = message;
      }
    },
    //获取楼层的数据
    async getfloor() {
      let res = await wxrequest({
        url: "api/public/v1/home/floordata"
      });
      // console.log(res);

      let { message, meta } = res.data;
      // 判断
      if (meta.status === 200) {
        this.floorlist = message;
      }
    },
    //进入搜索页面
    tosearch() {
      wx.navigateTo({
        url: "../search/main"
      });
    }
  },

  mounted() {
    this.getlunbo();
    this.getcatitms();
    this.getfloor();
  }
};
</script>

<style lang="less" scoped>
.nav {
  width: 100%;
  height: 100rpx;
  background-color: #ff2d4a;
  padding: 0rpx 20rpx;
  box-sizing: border-box;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  input {
    margin-top: 20rpx;
    height: 60rpx;
    text-align: center;
    font-size: 14px;
    background-color: #ffffff;
    border-radius: 10px;
  }
  icon {
    position: absolute;
    top: 50%;
    left: 40%;
    transform: translate(-50%, -50%);
  }
}
.lunbo {
  margin-top: 100rpx;
  width: 100%;
  height: 340rpx;
  .lb-item {
    width: 100%;
    height: 340rpx;
    image {
      width: 100%;
      height: 340rpx;
    }
  }
}
.box {
  width: 100%;
  height: 196rpx;
  display: flex;
  .box_nav {
    margin-top: 25rpx;
    width: 25%;
    text-align: center;
    img {
      width: 100rpx;
      height: 100rpx;
    }
    span {
      display: block;
      font-size: 14px;
    }
  }
}
.floor {
  width: 100%;
  .title {
    width: 100%;
    height: 88rpx;
    position: relative;
    img {
      width: 100%;
      height: 88rpx;
    }
    span {
      position: absolute;
      top: 20rpx;
      left: 20rpx;
      font-weight: 700;
      color: #ef8295;
    }
  }
  .f-item {
    overflow: hidden;
    padding: 16rpx;
    img {
      width: 233rpx;
      height: 185rpx;
      float: left;
      margin-bottom: 10rpx;
      &:first-child {
        height: 380rpx;
        margin-right: 10rpx;
      }
      &:nth-child(2n) {
        margin-right: 10rpx;
      }
    }
  }
}
</style>

