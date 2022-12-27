<template>
	
	<div class="login-window">
		<div class="title">用户登陆</div>
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
		<el-button class='login-button' type="primary" @click="btn_login(my_form)">登陆</el-button>   
		<div class='register'><router-link to="/register">注册</router-link>  <div class='error'> {{my_form_model.login_status}}</div> </div> 
	</div>
</template>

<script>
	import {ref, reactive, getCurrentInstance} from 'vue'
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
			
			// 登陆
			async function btn_login(form1){
				// 验证表单规则是否合格.valid = true/false 是否有不合格的参数。fields: 哪些参数不合格
				await form1.validate( async (valid, fields)=>{
					// 表单填充项没有问题，则发送登陆请求
					if(valid){
						const res = await proxy.$my_request.post('/user/login/', {username: my_form_model.username, password: my_form_model.password}, {headers:{'Content-Type': 'application/x-www-form-urlencoded'}})
						if(res.status === 200){
							// 登陆成功，存储token,跳转到首页/刷新
							if(res.data.status === 0){
								localStorage.setItem('token', res.data.token)
								localStorage.setItem('username', my_form_model.username)
								my_form_model.login_status = ""
								router.push({ name: 'home'})
							}else{
								// 登陆失败
								my_form_model.login_status = "用户名或密码错误!"
							}
						}
					}
				})
			
			}
			
			// 直接进入当前页面，先判断是否已经登陆，否则不允许进入
			const token = localStorage.getItem('token')
			if(token){
				ElMessage({type: 'warning', message: '您已登陆'})
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
		height: 200px;
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