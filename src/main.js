import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 引入公共样式
import '@/assets/comment.css'
// 引入axios
import axios from 'axios'
// 引入时间插件 moment
import moment from 'moment'
// 引入富文本编辑器插件
import VueQuillEditor from 'vue-quill-editor'
// 引入样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// 使用
Vue.use(VueQuillEditor)

// 把axios添加到vue原型上
Vue.prototype.axios = axios

// 全局的 axios 默认值(跟拦截器的效果一样)
// axios.defaults.baseURL = 'http://localhost:8888/api/private/v1'
// axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')

// 给axios添加请求拦截器
axios.interceptors.request.use(
  function(config) {
    // 在发送请求之前做些什么
    // 配置基础路径
    config.baseURL = 'http://localhost:8888/api/private/v1'
    // 给config添加请求头
    config.headers.Authorization = localStorage.getItem('token')
    return config
  },
  function(error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)
// 使用Element插件
Vue.use(ElementUI)

// 定义过滤器，过滤时间格式
Vue.filter('dataFilter', (input, format = 'YYYY-MM-DD HH:mm:ss') => {
  // 这里的input是时间秒数比如：1524401758
  return moment(input * 1000).format(format)
})

// 关闭生成环境提示
Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
