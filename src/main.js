// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import {router} from './router'
import store from './store'
import iView from 'iview'
import i18n from '@/locale'
import config from '@/config'
import importDirective from '@/directive'
import 'iview/dist/styles/iview.css'
import './index.less'
import '@/assets/icons/iconfont.css'
import '@/css/common.less'
import util from '@/libs/util';
import {deleteRequest, getRequest, postRequest, putRequest, uploadFileRequest} from '@/libs/axios'
import {getStore, removeStore, setStore} from '@/libs/storage'
import VueVirtualScroller from 'vue-virtual-scroller'
import hasPermission from '@/libs/hasPermission';
import * as filters from '@/filters/filter'
import {Message} from 'iview'


// import '@/mock'
// 实际打包时应该不引入mock
/* eslint-disable */
if (process.env.NODE_ENV !== 'production') require('@/mock')

Vue.use(iView, {
  i18n: (key, value) => i18n.t(key, value)
})
Vue.use(VueVirtualScroller)
Vue.use(hasPermission);
Vue.config.productionTip = false
/**
 * @description 全局注册应用配置
 */
Vue.prototype.$config = config
// Vue.prototype.getRequest = getRequest;
// Vue.prototype.postRequest = postRequest;
// Vue.prototype.putRequest = putRequest;
// Vue.prototype.deleteRequest = deleteRequest;
// Vue.prototype.uploadFileRequest = uploadFileRequest;
Vue.prototype.setStore = setStore;
Vue.prototype.getStore = getStore;
Vue.prototype.removeStore = removeStore;
Vue.prototype.$Message = Message;

/**
 * 注册指令
 */
importDirective(Vue);

/**
 * 注册过滤器
 */
Object.keys(filters).forEach(key => {
  Vue.filter(key,filters[key]);
});

/**
 * event bus
 */
let bus = new Vue();

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  store,
  render: h => h(App),
  data: {
    currentPageName: '',
    bus: bus
  },
  mounted() {
    // 初始化菜单
    util.initRouter(this);
    this.currentPageName = this.$route.name;
    // 显示打开的页面的列表
    this.$store.commit('setOpenedList');
    this.$store.commit('initCachepage');
  }
})
