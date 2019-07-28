<template>
  <div class="bigbox">
    <!-- 轮播图 -->
    <swiper class="lunbo" indicator-dots autoplay interval="3000" duration="300" circular>
      <swiper-item
        @click="previews(item.pics_big_url)"
        v-for="(item, index) in deta.pics"
        :key="index"
      >
        <img mode="aspectFit" :src="item.pics_big_url" alt />
      </swiper-item>
    </swiper>
    <!-- 商品信息 -->
    <div class="msg">
      <div class="price">￥{{deta.goods_price}}.00</div>
      <div class="word">
        <div class="left">{{deta.goods_name}}</div>
        <div class="right">
          <i class="iconfont icon-fenxiang"></i>
          转发
          <button open-type="share">转发</button>
        </div>
      </div>
      <div class="send">快递:免运费</div>
    </div>
    <!-- 促销 -->
    <div class="chuxiao">
      <div class="item">
        促销:
        <span class="color">满300 减 30</span>
      </div>
      <div class="item">
        已选:
        <span>黑色/s/1件</span>
      </div>
    </div>
    <!-- 图文介绍 -->
    <div class="jieshao">
      <div @click="selectedIndex=0" class="item" :class="{active:selectedIndex === 0}">图文介绍</div>
      <div @click="selectedIndex=1" class="item" :class="{active:selectedIndex === 1}">规格参数</div>
    </div>
    <!-- 选项 -->
    <div class="items">
      <div v-if="selectedIndex ===0" class="item" v-html="deta.goods_introduce"></div>
      <div v-if="selectedIndex ===1" class="item">规格参数</div>
    </div>
    <!-- 底部 -->
    <div class="bottom">
      <div class="start">
        <i class="iconfont icon-kefu"></i>
        联系客服
        <button open-type="contact"></button>
      </div>
      <div class="start" @click="tocar">
        <i class="iconfont icon-gouwuchekong"></i>
        购物车
      </div>
      <button class="end one">加入购物车</button>
      <button class="end two">立即购买</button>
    </div>
  </div>
</template>

<script>
import wxrequest from "../../utils/wxrequest";
export default {
  data() {
    return {
      selectedIndex: 0,
      //商品详情参数
      deta: {},
      //商品id
      goods_id: "",
      // 保存图片的数组
      imgList: []
    };
  },
  //点击转发后触发的事件
  onShareAppMessage() {
    console.log("触发了");
  },
  onLoad(options) {
    this.goods_id = options.id;
    this.getDetail();
  },
  methods: {
    // 跳转到购物车
    tocar() {
      wx.switchTab({
        url: "/pages/cart/main"
      });
    },
    //动态获取商品详情
    async getDetail() {
      let res = await wxrequest({
        url: `api/public/v1/goods/detail?goods_id=${this.goods_id}`
      });
      console.log(res);
      let { meta, message } = res.data;
      if (meta.status === 200) {
        this.deta = message;
        // 将轮播图中的所有图片全部单独保存到一个数组中
        message.pics.forEach(item => {
          this.imgList.push(item.pics_big_url);
        });
      }
    },
    previews(item) {
      wx.previewImage({
        current: item, // 当前显示图片的http链接
        urls: this.imgList // 需要预览的图片http链接列表
      });
    }
  }
};
</script>

<style lang="less" scoped>
@import "./index.less";
// 引入字体图标
@import "../../utils/css/iconfont.css";
</style>

