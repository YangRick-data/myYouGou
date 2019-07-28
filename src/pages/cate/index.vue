<template>
  <div>
    <!-- 搜索 -->
    <div class="nav">
      <input type="text" placeholder="搜索" />
      <icon type="search" size="14" />
    </div>
    <!-- 内容 -->
    <div class="content">
      <div class="left">
        <div
          @click="changeIndex(index)"
          class="l-item"
          :class="{active:selectedIndex === index}"
          v-for="(item, index) in cateList"
          :key="index"
        >{{item.cat_name}}</div>
      </div>
      <div class="right">
        <img
          class="topImg"
          src="https://img.alicdn.com/tps/i4/TB1OKgFXvb2gK0jSZK9SuuEgFXa.jpg_q90_.webp"
          alt
        />
        <div class="box">
          <div class="item" v-for="(item, index) in contentList" :key="index">
            <div class="title">
              <span>/</span>
              {{ item.cat_name }}
              <span>/</span>
            </div>
            <div class="list">
              <div class="list-item" v-for="(item1, index1) in item.children" :key="index1">
                <a :href="'/pages/searchList/main?query=' + item1.cat_name">
                  <img :src="'https://autumnfish.cn/wx/' + item1.cat_icon" alt />
                  <span>{{item1.cat_name}}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import wxrequest from "../../utils/wxrequest";
export default {
  data() {
    return {
      //设置默认激活的样式
      selectedIndex: 0,
      // 分类数据源
      cateList: [],
      // 内容的数据源
      contentList: []
    };
  },
  methods: {
    // 改变激活的样式
    changeIndex(index) {
      // 动态设置激活样式
      console.log(index);

      this.selectedIndex = index;
      // 动态获取内容数据
      this.contentList = this.cateList[index].children;
      // console.log(this.contentList);
    },
    // 动态分类获取数据
    async getCateList() {
      var res = await wxrequest({
        url: "api/public/v1/categories"
      });
      let { meta, message } = res.data;
      if (meta.status === 200) {
        // 得到数据时顺便给 contentList 赋值
        this.cateList = message;
        this.contentList = this.cateList[this.selectedIndex].children;
      }
    }
  },
  mounted() {
    this.getCateList();
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
.content {
  width: 100%;
  position: absolute;
  top: 100rpx;
  bottom: 0rpx;
  left: 0px;
  display: flex;
  .left {
    width: 198rpx;
    height: 100%;
    overflow: auto;
    .l-item {
      width: 100%;
      height: 100rpx;
      text-align: center;
      line-height: 100rpx;
      background-color: #f4f4f4;
      &.active {
        color: #eb4d5b;
        background-color: #fff;
        position: relative;
        &:before {
          content: "";
          position: absolute;
          width: 8rpx;
          height: 60rpx;
          background-color: #eb4d5b;
          top: 50%;
          left: 0;
          transform: translate(0px, -50%);
        }
      } // .l-item.active
    }
  }
  .right {
    flex: 1;
    height: 100%;
    padding: 20rpx 16rpx;
    box-sizing: border-box;
    overflow: auto;
    .topImg {
      width: 100%;
      height: 180rpx;
    }
    .box {
      width: 100%;
      .item {
        width: 100%;
        .title {
          width: 100%;
          height: 100rpx;
          text-align: center;
          line-height: 100rpx;
          span {
            color: #aaa;
            margin: 0px 10rpx;
          }
        }
        .list {
          width: 100%;
          display: flex;
          flex-wrap: wrap;
          .list-item {
            width: 33.3333%;
            text-align: center;
            margin: 20rpx 0px;
            img {
              width: 80%;
              height: 80rpx;
            }
            span {
              display: block;
              font-size: 14px;
            }
          }
        }
      }
    }
  }
}
</style>

