<template>
	<div class="common-layout">
		<el-container style="height: 100%;">
			<!-- 顶部导航 -->
			<el-header class="top-nav">
				<!-- <div class="title">天昊云</div> -->
				<el-image  :src="logo_img" fit="contain" />

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
						
						<div @click="help_and_feedback">
							<li class='el-menu-item'>
								<el-icon><QuestionFilled /></el-icon>
								<span>求助与反馈</span>
							</li>
						</div>
					</el-menu>
					
				</el-aside>
				<!-- 右侧内容展示区 -->
				<el-main id="my-show-content" :style="defaultHeight">
					<router-view></router-view>
				</el-main>
				
				<!-- help dialog -->
				<HelpDialog v-model:show='help_dialog'/>
			</el-container>
		</el-container>
	</div>
</template>

<script>
	import {
		watch,
		reactive,
		ref,
		computed
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
	import HelpDialog from '@/components/HelpDialog.vue'
	const logo_img = require('@/assets/logo.png')
	export default {
		components: {
			HomeFilled,
			Files,
			Picture,
			Cpu,
			Avatar,
			HelpDialog
		},
		setup() {
			const route = useRoute()
			const router = useRouter()
			// 左侧导航栏列表
			const left_nav_list = reactive([
				// {
				// 	id: '1', 
				// 	title: '首页',
				// 	router: '/home',
				// 	icon: 'HomeFilled',
				// 	is_active: false
				// },
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
					title: '流程',
					router: '/tools/pipeline',
					icon: 'Orange',
					is_active: false
				},
				{
					id: '6',
					title: '其他分类',
					router: '/tools',
					icon: 'icon-more-four',
					is_active: false,
					sub:[
						{
							id: '6-1',
							title: '转录组',
							router:'/tools/rna',
							icon: 'Tools',
							is_active: false,
						},{
							id: '6-2',
							title: '微生物',
							router:'/tools/microbe',
							icon: 'Tools',
							is_active: false,
						},{
							id: '6-3',
							title: '降维',
							router:'/tools/dimensional_reduction',
							icon: 'Tools',
							is_active: false,
						},
					]
				},
				{
					id: '7',
					title: '我的',
					router: '/my',
					icon: 'Avatar',
					is_active: false,
					sub:[
						{
							id: '7-1',
							title: '任务',
							router:'/my/missions',
							icon: 'icon-list',
							is_active: false,
						},{
							id: '7-2',
							title: '消费记录',
							router:'/my/expenses',
							icon: 'icon-consume',
							is_active: false,
						},{
							id: '7-3',
							title: '个人信息',
							router:'/my/info',
							icon: 'icon-info',
							is_active: false,
						},
					]
				}
			])
			
			// 面包屑导航设计
			
			const breadcrumb_nav = reactive([])
			
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
			
			// 监视路由变动，及时修正顶部导航（主要应对初次登陆成功时的刷新高亮menu）
			watch(() => route.path, (path_new, path_old) => {
				is_login.value = false
				username.value = ''
				const token = localStorage.getItem('token')
				if(token){
					is_login.value = true
					username.value = localStorage.getItem('username')
				}
				
				// 当前激活的menu
				const router_splits = path_new.split('/')
				if(router_splits[1] === 'home'){
					default_active_menu.value = path_new
				}else{
					default_active_menu.value = '/' + router_splits[1] + '/' + router_splits[2]
				}
			})
			
			const select_menu = (index, indexPath) =>{
				// 主页，这里也要设置默认激活标签。如果不添加的话，el-menu 会触发自动跳转 router，估计是bug
				// 求助反馈页面，收集客户的反馈
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
			 
			
			// help 反馈对话框
			const help_dialog = ref(false)
			const help_and_feedback = function(){
				const token = localStorage.getItem('token')
				if(token){
					help_dialog.value = true
				}else{
					ElMessageBox.confirm("需要登陆", '警告', {confirmButtonText: '登陆',cancelButtonText: '取消',type: 'warning'}).then(() => {
						router.push({ name: 'login'})
					}).catch(()=>{
					// 取消
					})
				}
			}
			
			
			// 导出
			return {
				left_nav_list,
				is_login,
				username,
				btn_log_out,
				defaultHeight,
				default_active_menu,
				select_menu,
				breadcrumb_nav,
				help_dialog,
				help_and_feedback,
				logo_img
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
			font-size: 1rem;
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
		// color: var(--brand-color);
		font-weight: 600;
		background-color: var(--el-color-primary-light-9);
	}
	#breadcrumb-nav{
		margin-bottom: 10px;
	}
 
 
</style>
