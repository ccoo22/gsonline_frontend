<template>
	
	<div class="login-window">
		<div class="title">用户登录</div>
		<el-form
		    ref="my_form"
		    :model="my_form_model"
		    :rules="my_form_rules"
		    label-width="0px"
		    class="demo-ruleForm"
		    status-icon
		>
			<el-form-item label="" prop="username">
				<el-input v-model="my_form_model.username" placeholder="用户名" clearable prefix-icon="UserFilled"/>
			</el-form-item>
			
			<el-form-item label="" prop="password">
				<el-input v-model="my_form_model.password" type="password" placeholder="密码" show-password prefix-icon="Lock" />
			</el-form-item>
		</el-form>
		<el-button class='login-button' type="primary" @click="btn_login(my_form)">登录</el-button>   
		<div class='register'><router-link to="/register">注册</router-link>  <div class='error'> {{my_form_model.login_status}}</div> </div>
		<div class='register'><router-link to="/reset_passwd">忘记密码</router-link> </div>
		<div class='register'><router-link to="/resend_active_token">未收到账号激活码？</router-link> </div>
	</div>
</template>

<script>
import {ref, onUnmounted, reactive, getCurrentInstance} from 'vue'
	import {
		useRouter, useRoute
	} from 'vue-router'
	import {
		UserFilled,
		Lock,
		
	} from '@element-plus/icons-vue'
	import {ElMessageBox, ElMessage} from 'element-plus'
	
	export default{
		components:{
			UserFilled,
			Lock,
		},
		setup(){
			// 获取vue实例
			const {
				proxy
			} = getCurrentInstance()
			const router = useRouter()
			const route = useRoute()
			
			// 用户名、密码
			const my_form = ref('')
			const my_form_model = reactive({
				username: '',
				password: '',
				login_status: '',
			})
			// 用户名、密码 验证规则。务必与 表单名称一致
			const my_form_rules = reactive({
				username: [
						{type: 'string', required: true, message: '请输入用户名', trigger: 'blur', transform(value){return value.trim()}},
						{type: 'string', min: 3, message: '至少3个字符', trigger: 'blur'},
					],
				password: [
					{type: 'string', required: true, message: '请输入密码', trigger: 'blur', transform(value){return value.trim()}},
					{type: 'string', min: 6, message: '至少6个字符', trigger: 'blur'},
				],
			})
			
			// 登录
			async function btn_login(form1){
				// 验证表单规则是否合格.valid = true/false 是否有不合格的参数。fields: 哪些参数不合格
				await form1.validate( async (valid, fields)=>{
					// 表单填充项没有问题，则发送登录请求
					if(valid){
						const res = await proxy.$my_request.post('/user/login/', {username: my_form_model.username, password: my_form_model.password}, {headers:{'Content-Type': 'application/x-www-form-urlencoded'}})
						if(res.status === 200){
							// 登录成功，存储token,跳转到首页/刷新
							if(res.data.status === 0){
								localStorage.setItem('token', res.data.token)
								localStorage.setItem('username', my_form_model.username)
								my_form_model.login_status = ""
								router.push({ name: 'ToolList', params: { tag: 'all' }})
							}else{
								// 登录失败
								my_form_model.login_status = res.data.msg
							}
						}
					}
				})
			
			}
			
			// 带有激活信息，则先发送账号激活
			async function active_account(active_token){
				const res = await proxy.$my_request.post('/user/active_account/', {active_token: active_token}, {headers:{'Content-Type': 'application/x-www-form-urlencoded'}})
				if(res.status === 200){
					if(res.data.status === 0){
						// 激活成功
						ElMessage({type: 'success', message: '账户激活成功，请登录'})
					}else{
						// 激活失败
						ElMessageBox.alert('账户激活失败：'+ res.data.msg, '警告', {
							type: 'error',
							confirmButtonText: '确定',
						})
					}
				}
			}
			if('active_token' in route.query){
				active_account(route.query.active_token)
			}
			
			// 绑定enter事件，也可以激活单击按钮事件
			function keyDown(e){
				if(e.keyCode === 13){  // enter 编码 13
					btn_login(my_form.value)
				}
			}
			window.addEventListener("keydown", keyDown, false)  // 网页全局绑定键盘监听事件
			// 页面关闭时，移出事件监听
			onUnmounted(()=>{
				window.removeEventListener("keydown", keyDown, false)
			})
			
			// 修改网页标题
			document.title = "用户登录"
			
			// 直接进入当前页面，先判断是否已经登录，否则不允许进入
			const token = localStorage.getItem('token')
			if(token){
				ElMessage({type: 'warning', message: '您已登录'})
				router.go(-1)
			}
			
			return {my_form, my_form_model, my_form_rules, btn_login}
		}
	}
</script>

<style lang="less">
	.login-window{
		margin: 0 auto;
		padding: 20px;
		border-radius: 3%;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
		background-color: rgba(75, 185, 206, 0.3);
		width:300px;
		height: 240px;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		.login-button{
			width: 100%
		}
		.title{
			margin: 0 auto;
		}
		.register{
			display: flex;
			flex-direction: row-reverse;
			justify-content: space-between ;
			.error{
				color: red;
			}
		}
	}
	
</style>