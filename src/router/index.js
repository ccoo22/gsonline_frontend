import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'root',
    redirect: { name: 'home' } 
  },
  {
    path: '/home',
    name: 'home',
    component: () => import(/* webpackChunkName: "Home" */ '../page/home/home.vue')
  },
  {
    path: '/all',
    name: 'all',
    component: () => import(/* webpackChunkName: "All" */ '../page/tools/tool_list.vue')
  },  
  {
    path: '/mgs_relative',
    name: 'MGSRelative',
    component: () => import(/* webpackChunkName: "MGSRelative" */ '../page/tools/mgs_relative.vue')
  },
  {
    path: '/all/:software',
    name: 'AllSoftware',
    component: () => import(/* webpackChunkName: "AllSoftware" */ '../page/tools/tool_show.vue')
  },
  {
    path: '/plot',
    name: 'plot',
    component: () => import(/* webpackChunkName: "Plot" */ '../page/tools/tool_list.vue')
  },
  {
    path: '/plot/:software',
    name: 'PlotSoftware',
    component: () => import(/* webpackChunkName: "PlotSoftware" */ '../page/tools/tool_show.vue')
  },
  {
    path: '/statistic',
    name: 'statistic',
    component: () => import(/* webpackChunkName: "Statistic" */ '../page/tools/tool_list.vue')
  },
  {
    path: '/statistic/:software',
    name: 'StatisticSoftware',
    component: () => import(/* webpackChunkName: "StatisticSoftware" */ '../page/tools/tool_show.vue')
  },
  {
    path: '/my/missions',
    name: 'MyMission',
    component: () => import(/* webpackChunkName: "MyMission" */ '../page/my/missions.vue')
  },
  {
    path: '/result/:mission_id',
    name: 'MyResult',
    component: () => import(/* webpackChunkName: "MyResult" */ '../page/my/result.vue')
  },{
    path: '/my/expenses',
    name: 'MyExpense',
    component: () => import(/* webpackChunkName: "MyExpense" */ '../page/my/expenses.vue')
  },{
    path: '/my/info',
    name: 'MyInfo',
    component: () => import(/* webpackChunkName: "MyInfo" */ '../page/my/info.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "Login" */ '../page/login/login.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import(/* webpackChunkName: "Register" */ '../page/login/register.vue')
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
