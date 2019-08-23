<template>
  <div>
    <!-- 搜索 -->
    <div class="nav">
      <div class="search">
        <input
          @input="think"
          @confirm="confirm"
          v-model="query"
          type="text"
          placeholder="请输入要搜索的内容"
        />
        <div class="think" v-if="thinkList.length!=0">
          <div
            @click="thinkTo(item.goods_name)"
            class="item"
            v-for="(item, index) in thinkList"
            :key="index"
          >{{item.goods_name}}</div>
        </div>
      </div>

      <icon type="search" size="14" />
      <button @click="clear" v-if="query.length!==0">取消</button>
    </div>
    <div class="his">
      <div class="title">
        <span>搜索历史</span>
        <icon @click="clearhis" type="clear" size="14"></icon>
      </div>
      <div class="list">
        <div
          @click="itemSearch(item)"
          class="item"
          v-for="(item, index) in list"
          :key="index"
        >{{item}}</div>
      </div>
    </div>
  </div>
</template>

<script>
// 导入异步请求的文件
import wxrequest from "../../utils/wxrequest.js";
export default {
  data() {
    return {
      // 搜索的关键字
      query: "",
      //保存关键字的数组
      list: [],
      // 保存联想的内容
      thinkList: []
    };
  },
  onLoad() {
    //动态获取搜索的关键字
    let res = wx.getStorageSync("query");
    //判断res 是否存在
    // if (res) {
    //   this.list = JSON.parse(res);
    // } else {
    //   this.list = [];
    // }
    this.list = res ? JSON.parse(res) : [];
  },
  methods: {
    // 清除关键字
    clear() {
      this.query = "";
    },
    // 点击完成按钮时触发
    confirm() {
      //进入搜索列表进行搜索内容
      wx.navigateTo({
        url: `../searchList/main?query=${this.query}`
      });
      //将搜索的关键字进行保存
      this.list.unshift(this.query);
      //在保存到 storage 中之前需要去重
      this.list = [...new Set(this.list)];
      wx.setStorageSync("query", JSON.stringify(this.list));
    },
    // 点击搜索历史中的选项,进行搜索
    itemSearch(item) {
      this.query = item;
      wx.navigateTo({
        url: `../searchList/main?query=${this.query}`
      });
      //将搜索的关键字进行保存
      this.list.unshift(this.query);
      //在保存到 storage 中之前需要去重
      this.list = [...new Set(this.list)];
      //使用 wx 中的 storage 进行保存
      wx.setStorageSync("query", JSON.stringify(this.list));
    },
    clearhis() {
      wx.showModal({
        title: "提示",
        content: "确定要清除吗(๑•ᴗ•๑)",
        success: res => {
          if (res.confirm) {
            wx.removeStorageSync("query");
            //清空list中的数据
            this.list = [];
          } else if (res.cancel) {
            console.log("用户点击取消");
          }
        }
      });
    },
    think() {
      if (this.time) {
        clearTimeout(this.time);
      }
      this.time = setTimeout(async () => {
        if (this.query.length === 0) {
          this.thinkList = [];
        } else {
          //发送请求到服务器得到联想的数据
          var res = await wxrequest({
            url: `api/public/v1/goods/search?query=${
              this.query
            }&pagesize=10&pagenum=1`
          });
          let { meta, message } = res.data;
          if (meta.status === 200) {
            this.thinkList = message.goods;
            console.log(this.thinkList);
          }
        }
      }, 500);
    },
    //点击联想内容时触发
    thinkTo(name) {
      this.query = name;
      //跳转到搜索列表
      wx.navigateTo({
        url: `/pages/searchList/main?query=${name}`
      });
      //将搜索关键字存储到 storage 中
      this.list.unshift(this.query);
      //在保存到 storage 中之前需要去重
      this.list = [...new Set(this.list)];
      //使用 wx 中的 storage 进行保存
      wx.setStorageSync("query", JSON.stringify(this.list));
    }
  }
};
</script>

<style lang="less" scoped>
.nav {
  width: 100%;
  height: 100rpx;
  padding: 20rpx 16rpx;
  background-color: #eee;
  box-sizing: border-box;
  position: relative;
  display: flex;
  z-index: 1000;

  .search {
    width: 100%;
    height: 60rpx;
    background-color: #fff;
    line-height: 60rpx;
    padding-left: 60rpx;
    box-sizing: border-box;
    font-size: 14px;
    border-radius: 5px;
    position: relative;
    input {
      width: 100%;
      height: 60rpx;
      background-color: #fff;
      box-sizing: border-box;
      font-size: 14px;
      border-radius: 5px;
    }
    .think {
      position: absolute;
      top: 60rpx;
      left: 0px;
      width: 100%;
      background: #ddd;
      .item {
        line-height: 60rpx;
        padding: 0 20rpx;
        white-space: nowrap; /*强制一行显示*/
        overflow: hidden; /*超出部分隐藏*/
        text-overflow: ellipsis; /*最后添加省略号*/
      }
    }
  }
  button {
    width: 160rpx;
    height: 64rpx;
    line-height: 64rpx;
    font-size: 14px;
    margin-left: 20rpx;
  }
  icon {
    position: absolute;
    top: 50%;
    left: 40rpx;
    transform: translate(0, -50%);
    display: flex;
    align-items: center;
  }
}
.his {
  width: 100%;
  padding: 0 16rpx;
  box-sizing: border-box;
  .title {
    display: flex;
    justify-content: space-between;
    line-height: 88rpx;
    height: 88rpx;
    icon {
      margin-top: 20rpx;
    }
  }
  .list {
    display: flex;
    flex-wrap: wrap;
    .item {
      padding: 20rpx 25rpx;
      background-color: #ddd;
      margin-right: 30rpx;
      margin-bottom: 18rpx;
      white-space: nowrap; /*强制一行显示*/
      overflow: hidden; /*超出部分隐藏*/
      text-overflow: ellipsis; /*最后添加省略号*/
    }
  }
}
</style>

