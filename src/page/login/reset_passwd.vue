<template>
	
	<div class="reset-passwd-window">
		<div class="title">密码重置</div>
		<el-form
		    ref="my_form"
		    :model="my_form_model"
		    :rules="my_form_rules"
		    label-width="120px"
		    class="demo-ruleForm"
		    status-icon
		>	
			<el-form-item label="邮箱:" prop="email">
				<el-input v-model="my_form_model.email" placeholder="请输入注册的邮箱" prefix-icon="icon-mail" />
			</el-form-item>
			<el-form-item label="验证码:" prop="code">
				<el-col :span="15"><el-input v-model="my_form_model.code" placeholder="验证码" clearable prefix-icon="icon-protect"/></el-col>
				<el-col :span="9"> <el-button type="primary" round  :disabled="btn_status.disabled" @click="btn_send_email_verify_code(my_form)">{{btn_status.msg}}</el-button></el-col>
			</el-form-item>
			<el-form-item label="密码:" prop="password">
				<el-input v-model="my_form_model.password" type="password" placeholder="请输入新密码" show-password prefix-icon="Lock" />
			</el-form-item>
			<el-form-item label="再次输入密码:" prop="password_re">
				<el-input v-model="my_form_model.password_re" type="password" placeholder="请再输入一次新密码" show-password prefix-icon="Lock" />
			</el-form-item>
		</el-form>
		
		<el-button class='reset-passwd-button' type="primary" @click="btn_reset_passwd(my_form)">重置密码</el-button>   
		<div class='login'><router-link to="/login">登录</router-link>  <div class='error'> {{my_form_model.reset_passwd_status}}</div> </div> 
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
				code: '',
				password: '',
				password_re: '',
				email: '',
				reset_passwd_status: '',
			})
			// 再次验证密码：自定义验证规则
			const validatePassRE = (rule, value, callback) => {
				if(value !== my_form_model.password){
					callback(new Error("两次密码不一致"))
				}else{
					callback()
				}
			}
			// 验证码、密码 验证规则。务必与 表单名称一致
			const my_form_rules = reactive({
				email: [
					{type: 'email', required: true, message: '请输入正确的邮箱', trigger: 'blur', transform(value){return value.trim()}},
				],
				code: [
						{type: 'string', required: true, message: '请输入验证码', trigger: 'change', transform(value){return value.trim()}},
						{type: 'string', min: 6, message: '至少6个字符', trigger: 'change'},
					],
				password: [
					{type: 'string', required: true, message: '请输入密码', trigger: 'change', transform(value){return value.trim()}},
					{type: 'string', min: 6, message: '至少6个字符', trigger: 'change'},
				],
				password_re: [
					{type: 'string', required: true, message: '请再次输入密码', trigger: 'change', transform(value){return value.trim()}},
					{type: 'string', min: 6, message: '至少6个字符', trigger: 'change'},
					{ validator: validatePassRE, trigger: 'change' }
				],
				
			})
			
			// 按钮状态
			const btn_status = reactive({
				msg: '发送验证码',
				disabled: false,
			})
			// 定时器
			const timer = ref(0)
			const time_wait = ref(0)
			// 发送邮箱验证码
			async function btn_send_email_verify_code(form1){
				// 先检查是否1分钟内多次点击
				if(localStorage.getItem('reset_time') && localStorage.getItem('reset_time')  >= (Date.now() - 60000)){
					ElMessage({type: 'error', message: '您刚刚发送过验证码，请稍后重试'})
					return
				}
				// 此处仅验证email
				await form1.validateField( 'email', async (valid, fields)=>{
					if(valid){
						const res = await proxy.$my_request.post('/user/reset_passwd_verify_code/', {email: my_form_model.email}, {headers:{'Content-Type': 'application/x-www-form-urlencoded'}})
						if(res.status === 200){
							if(res.data.status === 0){
								ElMessageBox.alert('验证码已发送，请登录邮箱获取', '通知', {
									type: 'success',
									confirmButtonText: '确定',
								})
								my_form_model.reset_passwd_status = ''
								// 存放时间戳，防止多次单击
								localStorage.setItem('reset_time', Date.now())
								
								// 启动定时器，1分钟内，禁止再次发送验证码
								btn_status.disabled = true
								time_wait.value = 60
								timer.value = window.setInterval(function logname() {
								                btn_status.msg = '重新发送(' + time_wait.value + 's)'
								                time_wait.value = time_wait.value - 1
												// 关闭定时器
												if(time_wait.value < 0){
													window.clearInterval(timer.value) 
													btn_status.msg = '重新发送'
													btn_status.disabled = false
												}
								            }, 1000);
							}else{
								// 注册失败
								my_form_model.reset_passwd_status = res.data.msg
							}
						}
					}
				})
			}
			
			// 重置密码
			async function btn_reset_passwd(form1){
				await form1.validate( async (valid, fields)=>{
					if(valid){
						const res = await proxy.$my_request.post('/user/reset_passwd/', {code: my_form_model.code, password: my_form_model.password, email: my_form_model.email}, {headers:{'Content-Type': 'application/x-www-form-urlencoded'}})
						if(res.status === 200){
							if(res.data.status === 0){
								ElMessage({type: 'success', message: '密码重置成功'})
								my_form_model.reset_passwd_status = ""
								router.push({ name: 'login'})
							}else{
								my_form_model.reset_passwd_status = res.data.msg
							}
						}
					}
				})
			}
			// 绑定enter事件，也可以激活单击按钮事件
			function keyDown(e){
				if(e.keyCode === 13){  // enter 编码 13
					btn_reset_passwd(my_form.value)
				}
			}
			window.addEventListener("keydown", keyDown, false)  // 网页全局绑定键盘监听事件
			// 页面关闭时，移出事件监听
			onUnmounted(()=>{
				window.removeEventListener("keydown", keyDown, false)
			})
			
			// 修改网页标题
			document.title = "密码重置"

			return {my_form, my_form_model, my_form_rules, btn_status, btn_send_email_verify_code, btn_reset_passwd}
		}
	}
</script>

<style lang="less">
	.reset-passwd-window{
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
		.reset-passwd-button{
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