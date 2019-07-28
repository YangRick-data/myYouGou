<template>
  <div>
    <!-- 搜索 -->
    <div class="fixbox" :style="{position: myposition}">
      <div class="nav">
        <input type="text" placeholder="搜索" v-model="query" />
        <icon type="search" size="14" />
      </div>
      <div class="myFbox">
        <div
          class="item"
          :class="{active:SelectionIndex===index}"
          v-for="(item, index) in list"
          :key="index"
          @click="changeIndex(index)"
        >{{item}}</div>
      </div>
    </div>
    <!-- 商品列表 -->
    <div class="goodsList" :style="{marginTop:myTop}">
      <a
        :href="'/pages/detail/main?id='+item.goods_id"
        class="box"
        v-for="(item, index) in goodsList"
        :key="index"
      >
        <div class="left">
          <img :src="item.goods_small_logo" alt />
        </div>
        <div class="right">
          <div class="word">{{item.goods_name}}</div>
          <div class="price">
            ￥
            <span>{{item.goods_price}}</span>.00
          </div>
        </div>
      </a>
    </div>
  </div>
</template>

<script>
import wxrequest from "../../utils/wxrequest";
export default {
  data() {
    return {
      // 搜索的关键字
      query: "",
      //导航的数据源
      list: ["综合", "销量", "价格"],
      //默认激活的选项
      SelectionIndex: 0,
      // 页容量
      pagesize: 10,
      // 当前页
      pagenum: 1,
      //商品数据源
      goodsList: [],
      //商品总数据条数
      total: -1, //让总条数在打开页面时和goodsList 的长度不一样
      // 标识:用来判断当前请是否完成
      isEnd: true,
      // 设置元素定位
      myposition: "static",
      myTop: 0
    };
  },
  onLoad(options) {
    //重置数据
    this.SelectionIndex = 0;
    this.pagenum = 1;
    this.total = -1;
    this.isEnd = true;
    this.goodsList = [];
    // 给搜索的关键字赋值
    this.query = options.query;
    // 调用方法 请求数据
    this.getGoodsList();
  },
  //上拉加载更多
  onReachBottom() {
    // console.log("到底了");
    // 修改当前页
    this.pagenum++;
    //重新请求新页的数据
    this.getGoodsList();
    // this.goodsList
  },
  //下拉刷新
  onPullDownRefresh() {
    // console.log("下拉了");
    //重置数据
    this.pagenum = 1;
    this.goodsList = [];
    this.total = -1;
    this.isEnd = true;
    // 重新请求
    this.getGoodsList();
  },
  onPageScroll(scroll) {
    // console.log("滚动了");
    // console.log(scroll);
    if (scroll.scrollTop === 0) {
      console.log(1);
      this.myposition = "static";
      this.myTop = "0px";
    } else {
      this.myposition = "fixed";
      this.myTop = "200rpx";
    }
  },
  methods: {
    changeIndex(index) {
      this.SelectionIndex = index;
    },
    async getGoodsList() {
      // 判断当前数据源的总条数是否与total相同,如果相同说明数据已经加载完成,否则继续加载
      if (this.goodsList.length === this.total) {
        return;
      }
      //判断上一次请求是否完成
      if (this.isEnd === false) {
        //将没有发送的请求对应的num 还原
        this.pagenum--;
        return; //结束本次请求
      }
      //将标识 改为 false
      this.isEnd = false;
      wx.showLoading({
        title: "加载中..."
      });
      let res = await wxrequest({
        url: "api/public/v1/goods/search",
        data: {
          query: this.query,
          pagesize: this.pagesize,
          pagenum: this.pagenum
        }
      });
      // console.log(res);
      let { meta, message } = res.data;
      if (meta.status === 200) {
        // 不能直接赋值,应该追加
        this.total = message.total;
        this.goodsList = [...this.goodsList, ...message.goods];
      }
      //将标识改为 true
      this.isEnd = true;
      // 关闭加载框
      wx.hideLoading();
      //关闭下拉的背景
      wx.stopPullDownRefresh();
    }
  }
};
</script>

<style lang="less" scoped>
// 小程序提供了一个关键字 @import 可以导入外联样式
@import url("./index.less");
</style>

