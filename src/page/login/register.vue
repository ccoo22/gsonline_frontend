<template>
	
	<div class="register-window">
		<div class="title">用户注册</div>
		<el-form
		    ref="my_form"
		    :model="my_form_model"
		    :rules="my_form_rules"
		    label-width="120px"
		    class="demo-ruleForm"
		    status-icon
		>	
		<el-form-item label="用户名:" prop="username">
			<el-input v-model="my_form_model.username" placeholder="用户名" clearable prefix-icon="UserFilled"/>
		</el-form-item>
		<el-form-item label="密码:" prop="password">
			<el-input v-model="my_form_model.password" type="password" placeholder="密码" show-password prefix-icon="Lock" />
		</el-form-item>
		<el-form-item label="再次输入密码:" prop="password_re">
			<el-input v-model="my_form_model.password_re" type="password" placeholder="再次输入密码" show-password prefix-icon="Lock" />
		</el-form-item>
		<el-form-item label="邮箱:" prop="email">
			<el-input v-model="my_form_model.email" placeholder="邮箱" prefix-icon="icon-mail" />
		</el-form-item>
			
			
			
		</el-form>
		
		<el-button class='register-button' type="primary" @click="btn_register(my_form)">注册</el-button>   
		<div class='login'><router-link to="/login">登录</router-link>  <div class='error'> {{my_form_model.register_status}}</div> </div> 
		<div class='login'><router-link to="/resend_active_token">未收到账号激活码？</router-link> </div>
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
			// 直接进入当前页面，先判断是否已经登录，否则不允许进入
			const token = localStorage.getItem('token')
			if(token){
				ElMessage({type: 'warning', message: '您已登录'})
				router.go(-1)
			}
			
			// 用户名、密码
			const my_form = ref('')
			const my_form_model = reactive({
				username: '',
				password: '',
				password_re: '',
				email: '',
				register_status: '',
			})
			// 再次验证密码：自定义验证规则
			const validatePassRE = (rule, value, callback) => {
				if(value !== my_form_model.password){
					callback(new Error("两次密码不一致"))
				}else{
					callback()
				}
			}
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
				password_re: [
					{type: 'string', required: true, message: '请再次输入密码', trigger: 'blur', transform(value){return value.trim()}},
					{type: 'string', min: 6, message: '至少6个字符', trigger: 'blur'},
					{ validator: validatePassRE, trigger: 'blur' }
				],
				email: [
					{type: 'email', required: true, message: '请输入正确的邮箱', trigger: 'blur', transform(value){return value.trim()}},
				],
			})

			
			// 注册
			async function btn_register(form1){
				// 验证表单规则是否合格.valid = true/false 是否有不合格的参数。fields: 哪些参数不合格
				await form1.validate( async (valid, fields)=>{
					// 表单填充项没有问题，则发送注册请求
					if(valid){
						const res = await proxy.$my_request.post('/user/register/', {username: my_form_model.username, password: my_form_model.password, email: my_form_model.email}, {headers:{'Content-Type': 'application/x-www-form-urlencoded'}})
						if(res.status === 200){
							// 注册成功，存储token,跳转到首页/刷新
							if(res.data.status === 0){
								ElMessageBox.alert('注册成功，账户需要激活才可使用。激活链接已发送，请打开邮箱查收', '通知', {
									type: 'success',
									confirmButtonText: '确定',
								})
								my_form_model.register_status = ""
								 
							}else{
								// 注册失败
								my_form_model.register_status = res.data.msg
							}
						}
					}
				})
			
			}
			// 绑定enter事件，也可以激活单击按钮事件
			function keyDown(e){
				if(e.keyCode === 13){  // enter 编码 13
					btn_register(my_form.value)
				}
			}
			window.addEventListener("keydown", keyDown, false)  // 网页全局绑定键盘监听事件
			// 页面关闭时，移出事件监听
			onUnmounted(()=>{
				window.removeEventListener("keydown", keyDown, false)
			})
			
			// 修改网页标题
			document.title = "用户注册"

			return {my_form, my_form_model, my_form_rules, btn_register}
		}
	}
</script>

<style lang="less">
	.register-window{
		margin: 0 auto;
		padding: 20px;
		border-radius: 3%;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
		background-color: rgba(75, 185, 206, 0.3);
		width:400px;
		height: 300px;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		.register-button{
			width: 100%
		}
		.title{
			margin: 0 auto;
		}
		.login{
			display: flex;
			flex-direction: row-reverse;
			justify-content: space-between ;
			.error{
				color: red;
			}
		}
	}
	
</style>