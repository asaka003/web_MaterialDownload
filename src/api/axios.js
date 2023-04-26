import axios from "axios";
// 顶部进度条库
import NProgress from "nprogress";
import "nprogress/nprogress.css";
// 顶部进度条库

// 服务器
var baseURL = "";
// 本地
// var baseURL = "http://192.168.31.44:8080";
export default class HttpRequest {
  constructor(baseUrl = baseURL) {
    this.baseUrl = baseUrl;
    this.queue = {};
  }
  getInsideConfig() {
    const token = localStorage.getItem("userToken");
    const config = {
      timeout: 60 * 60 * 1000,
      baseURL: this.baseUrl,
      headers: { "access-token": token },
    };
    return config;
  }
  distroy(url) {
    delete this.queue[url];
    if (!Object.keys(this.queue).length) {
      // store.commit("changeloading", false);
    }
  }
  interceptors(instance, url) {
    instance.interceptors.request.use(
      (config) => {
        NProgress.start();
        console.log("请求拦截", config);
        if (!Object.keys(this.queue).length) {
          // store.commit("changeloading", true);
        }
        this.queue[url] = true;
        return config;
      },
      (error) => {
        console.log("请求拦截报错", error);
      }
    );
    instance.interceptors.response.use(
      (res) => {
        NProgress.done();

        this.distroy(url);
        const { data } = res;
        console.log("响应拦截", res);
        if (res.headers.option == "download") {
          return res;
        } else {
          return res.data;
        }
      },
      (err) => {
        console.log("err", err.response);
        this.distroy(url);
        if (err && err.response) {
          switch (err.response.status) {
            case 400:
              err.message = "请求错误";
              break;
            case 401:
              err.message = "未授权，请登录";
              break;
            case 403:
              err.message = "拒绝访问";
              break;
            case 404:
              err.message = `请求地址出错`;
              break;
            case 408:
              err.message = "请求超时";
              break;
            case 500:
              err.message = "服务器内部错误";
              break;
            case 501:
              err.message = "服务未实现";
              break;
            case 502:
              err.message = "网关错误";
              break;
            case 503:
              err.message = "服务不可用";
              break;
            case 504:
              err.message = "网关超时";
              break;
            case 505:
              err.message = "HTTP版本不受支持";
              break;
            default:
          }
        }
        return Promise.reject(err);
      }
    );
  }
  request(options) {
    const instance = axios.create();
    options = Object.assign(this.getInsideConfig(), options);
    this.interceptors(instance, options.url);
    return instance(options);
  }
}
