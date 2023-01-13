import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// eleme 组件
import ElementPlus from 'element-plus'
// import 'element-plus/dist/index.css'  // 不用加载了，在 vue.config.js 中使用CDN方式加载
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { IconPark } from '@/api/icon-park.js'
import '@icon-park/vue-next/styles/index.css'
// axios 组件
import request from './api/request.js'

const app = createApp(App)

// 挂载饿了么所有的图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 挂载iconpark的图标
IconPark(app)

// 挂载 axios
app.config.globalProperties.$my_request = request
app.use(ElementPlus).use(store).use(router).mount('#app')
