import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'root',
    redirect: { name: 'ToolList', params: { tag: 'all' }  } 
  },
  {
    path: '/home',
    name: 'home',
    component: () => import(/* webpackChunkName: "Home" */ '../page/home/home.vue')
  },
  {
    path: '/tools/:tag',
    name: 'ToolList',
    component: () => import(/* webpackChunkName: "ToolList" */ '../page/tools/tool_list.vue')
  },
  {
    path: '/tools/:tag/:software',
    name: 'ToolShow',
    component: () => import(/* webpackChunkName: "ToolShow" */ '../page/tools/tool_show.vue')
  },
  {
    path: '/my/missions',
    name: 'MyMission',
    component: () => import(/* webpackChunkName: "MyMission" */ '../page/my/missions.vue')
  },
  {
    path: '/my/missions/:mission_id',
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
  {
    path: '/reset_passwd',
    name: 'reset_passwd',
    component: () => import(/* webpackChunkName: "ResetPWD" */ '../page/login/reset_passwd.vue')
  },,
  {
    path: '/resend_active_token',
    name: 'resend_active_token',
    component: () => import(/* webpackChunkName: "ResendActiveToken" */ '../page/login/resend_active_token.vue')
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
