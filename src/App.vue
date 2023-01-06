<template>
	<div class="common-layout">
		<el-container style="height: 100%;">
			<!-- 顶部导航 -->
			<el-header class="top-nav">
				<div class="title">天昊云</div>
				<div class="login">
					<div v-if="is_login == false">
						<router-link to="/register">注册</router-link>
					</div>
					<div v-if="is_login == false">
						<router-link to="/login">登陆</router-link>
					</div>

					<div v-if="is_login == true">
						<div @click="btn_log_out">退出登陆{{"（" + username + "）"}}</div>
					</div>
				</div>
			</el-header>

			<el-container>
				<!-- 左侧导航 -->
				<el-aside width="200px" class='left-nav'>
					<el-menu :default-active="default_active_menu" class="el-menu-vertical-demo" :unique-opened='true' @select="select_menu">
						<div v-for="(item, index) in left_nav_list" :key="item.id">
							<!-- 无二级导航 -->
							<el-menu-item :index="item.router" v-if="!('sub' in item)">
								<el-icon>
									<component :is="item.icon"></component>
								</el-icon>
								<span> {{item.title}} </span>
							</el-menu-item>
							
							<!-- 有二级导航 -->
							<el-sub-menu :index="item.router" v-if="'sub' in item">
								<template #title> 
									<el-icon>
									<component :is="item.icon"></component>
									</el-icon>
									{{item.title}} 
								</template>
								
								<el-menu-item v-for="(sub_item, index) in item.sub" :key="sub_item.id" :index="sub_item.router">
									<el-icon>
										<component :is="sub_item.icon"></component>
									</el-icon>
									<span> {{sub_item.title}} </span>
								</el-menu-item>
								
							</el-sub-menu>
						</div>
					</el-menu>
				</el-aside>
				<!-- 右侧内容展示区 -->
				<el-main id="my-show-content" :style="defaultHeight">
					<router-view></router-view>
				</el-main>
			</el-container>
		</el-container>
	</div>
</template>

<script>
	import {
		watch,
		reactive,
		ref
	} from 'vue'
	import {
		HomeFilled,
		Files,
		Picture,
		Cpu,
		Avatar
	} from '@element-plus/icons-vue'
	import {
		useRoute, useRouter
	} from 'vue-router'
	import {ElMessageBox, ElMessage} from 'element-plus'

	export default {
		components: {
			HomeFilled,
			Files,
			Picture,
			Cpu,
			Avatar
		},
		setup() {
			const route = useRoute()
			const router = useRouter()
			// 左侧导航栏列表
			const left_nav_list = reactive([{
					id: '1',
					title: '首页',
					router: '/home',
					icon: 'HomeFilled',
					is_active: false
				},
				{
					id: '2',
					title: '全部',
					router: '/tools/all',
					icon: 'icon-all-application',
					is_active: false
				},
				{
					id: '3',
					title: '绘图',
					router: '/tools/plot',
					icon: 'Picture',
					is_active: false
				},
				{
					id: '4',
					title: '统计',
					router: '/tools/statistic',
					icon: 'icon-calculator-one',
					is_active: false
				},
				{
					id: '5',
					title: '我的',
					router: '/my',
					icon: 'Avatar',
					is_active: false,
					sub:[
						{
							id: '5-1',
							title: '任务',
							router:'/my/missions',
							icon: 'icon-list',
							is_active: false,
						},{
							id: '5-2',
							title: '消费记录',
							router:'/my/expenses',
							icon: 'icon-consume',
							is_active: false,
						},{
							id: '5-3',
							title: '个人信息',
							router:'/my/info',
							icon: 'icon-info',
							is_active: false,
						},
					]
				},
			])
			
			// menu 默认激活
			const default_active_menu = ref(left_nav_list[0].router)
			
			// 是否登陆
			const is_login = ref(false)
			const username = ref('')
			const token = localStorage.getItem('token')
			if(token){
				is_login.value = true
				username.value = localStorage.getItem('username')
			}
			
			// 监视路由变动，及时修正顶部导航（主要应对初次登陆成功时的刷新）
			watch(() => route.path, (path_new, path_old) => {
				is_login.value = false
				username.value = ''
				const token = localStorage.getItem('token')
				if(token){
					is_login.value = true
					username.value = localStorage.getItem('username')
				}
				
				// all/plot/statistic 的menu特殊标记处理
				const router_splits = path_new.split('/')
				if(router_splits[1] === 'my'){
					default_active_menu.value = '/' + router_splits[1] + '/' + router_splits[2]
				}else{
					default_active_menu.value = '/' + router_splits[1]
				}
				 
			})
			
			const select_menu = (index, indexPath) =>{
				// 主页，这里也要设置默认激活标签。如果不添加的话，el-menu 会触发自动跳转 router，估计是bug
				default_active_menu.value = index
				router.push(index)
			}
			
			
			// 退出登陆
			function btn_log_out(){
				ElMessageBox.confirm("确定要退出登陆？", '警告', {confirmButtonText: '确定',cancelButtonText: '取消',type: 'warning'}).then(() => {
					// 确定
					localStorage.removeItem('token')
					localStorage.removeItem('username')
					ElMessage({type: 'success', message: '成功退出'})
					router.go(0)  // 刷新页面
				}).catch(()=>{
					// 取消
					ElMessage({type: 'info', message: '取消退出'})
				})

			}
			
			// main 高度设置(顶部导航占用了 60)
			const defaultHeight = reactive({height: window.innerHeight - 60 + 'px'})
			 
			 
			// 导出
			return {
				left_nav_list,
				is_login,
				username,
				btn_log_out,
				defaultHeight,
				default_active_menu,
				select_menu
			}
		}
	}
</script>

<style lang="less" scoped>
	.common-layout {}

	.top-nav {
		line-height: 60px;
		display: flex;
		
		justify-content: space-between;
		box-shadow: var(--el-box-shadow-light);
		z-index: 100;


		.title {
			font-size: 2rem;
			color: #081f67;
		}

		.login {
			font-size: 0.5rem;
			display: flex;
			// width: 120px;
			justify-content: space-between;
			flex-direction: row-reverse;

			div {
				cursor: pointer;
				margin: 0 5px;
			}

		}
	}
	.el-main{
		background-color: var(--el-bg-color-page);
	}
	.is-active{
		color: var(--brand-color);
		font-weight: 600;
		background-color: var(--el-color-primary-light-9);
	}
 
</style>
