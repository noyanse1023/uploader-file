// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
// import VueWorker from 'vue-worker';
import router from './router'
import axios from 'axios'
import qs from 'qs'

// Vue.use(VueWorker)

Vue.prototype.$axios = axios
// axios.defaults.baseURL = 'http://www.wwtliu.com';

Vue.prototype.HOST = '/api'

// 引入mockjs
require('./mock.js')
//常用的时间整理过滤器 getYMD
Vue.filter('getYMD', function(input) {
  return input.split(' ')[0];
})




Vue.config.productionTip = false

// 注册一个全局自定义指令 `v-focus`
// Vue.directive('focus', {//vue上挂载的所以是全局定义
//   // 当被绑定的元素插入到 DOM 中时……
//   inserted: function (el) {
//     // 聚焦元素
//     el.focus()
//   }
// })

// 拦截器，先是请求，响应，然后才拿到数据
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  console.log(config)
  if(config.method === 'post') {
    config.data = qs.stringify(config.data)
  }
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  console.log(response)
  // 对响应数据做点什么
  return response;
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error);
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
