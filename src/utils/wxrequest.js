// 封装请求接口的文件
export default function(options) {
  if (!options.baseUrl) {
    options.baseUrl = "https://autumnfish.cn/wx/";
  }
  return new Promise((resolve, reject) => {
    wx.request({
      url: options.baseUrl + options.url,
      method: options.method || "GET",
      header: options.header || {},
      data: options.data || {},
      success(res) {
        resolve(res);
      },
      fail(err) {
        reject(err);
      }
    });
  });
}
