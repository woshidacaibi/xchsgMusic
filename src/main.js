import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import '@/../public/less/index.less'
// import '@/../public/lib/iconfont/iconfont.css'
import '@/../public/lib/iconfont.css'
// 滚动条插件
import vuescroll from 'vuescroll'
import 'vuescroll/dist/vuescroll.css'
// dayjs
import dayjs from 'dayjs'
// swiper
import 'swiper/dist/css/swiper.min.css'
import 'swiper/dist/js/swiper.min'
// vue-dplayer
import VueDPlayer from 'vue-dplayer'
import 'vue-dplayer/dist/vue-dplayer.css'

Vue.use(VueDPlayer)
Vue.use(vuescroll)
axios.defaults.baseURL = 'http://43.138.76.54:3000'
Vue.config.productionTip = false
Vue.prototype.$http = axios
Vue.prototype.$time = dayjs
Vue.use(ElementUI)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
