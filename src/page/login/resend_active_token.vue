<template>
	
	<div class="resend-window">
		<div class="title">重新发送账号激活码</div>
		<el-form
		    ref="my_form"
		    :model="my_form_model"
		    :rules="my_form_rules"
		    label-width="60px"
		    class="demo-ruleForm"
		    status-icon
		>	
		<el-form-item label="邮箱:" prop="email">
			<el-input v-model="my_form_model.email" placeholder="注册账号的邮箱" prefix-icon="icon-mail" />
		</el-form-item>
		</el-form>
		
		<el-button class='resend-button' type="primary" :disabled="btn_status.disabled" @click="btn_resend(my_form)">{{btn_status.msg}}</el-button>   
		<div class='login'><router-link to="/login">登录</router-link>  <div class='error'> {{my_form_model.resend_status}}</div> </div> 
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
				email: '',
				resend_status: '',
			})
			// 用户名、密码 验证规则。务必与 表单名称一致
			const my_form_rules = reactive({
				email: [
					{type: 'email', required: true, message: '请输入正确的邮箱', trigger: 'blur', transform(value){return value.trim()}},
				],
			})
			// 按钮状态
			const btn_status = reactive({
				msg: '发送',
				disabled: false,
			})
			// 定时器
			const timer = ref(0)
			const time_wait = ref(0)
			// 注册
			async function btn_resend(form1){
				// 先检查是否1分钟内多次点击
				if(localStorage.getItem('resend_time') && localStorage.getItem('resend_time')  >= (Date.now() - 60000)){
					ElMessage({type: 'error', message: '您刚刚发送过，请稍后重试'})
					return
				}
				await form1.validate( async (valid, fields)=>{
					if(valid){
						const res = await proxy.$my_request.post('/user/resend_active_token/', {email: my_form_model.email}, {headers:{'Content-Type': 'application/x-www-form-urlencoded'}})
						if(res.status === 200){
							if(res.data.status === 0){
								ElMessageBox.alert('激活码已发送，请打开邮箱查收', '通知', {
									type: 'success',
									confirmButtonText: '确定',
								})
								my_form_model.resend_status = ""
								// 存放时间戳，防止多次单击
								localStorage.setItem('resend_time', Date.now())
								
								// 启动定时器，1分钟内，禁止再次发送
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
								my_form_model.resend_status = res.data.msg
							}
						}
					}
				})
			
			}
			// 绑定enter事件，也可以激活单击按钮事件
			function keyDown(e){
				if(e.keyCode === 13){  // enter 编码 13
					btn_resend(my_form.value)
				}
			}
			window.addEventListener("keydown", keyDown, false)  // 网页全局绑定键盘监听事件
			// 页面关闭时，移出事件监听
			onUnmounted(()=>{
				window.removeEventListener("keydown", keyDown, false)
			})
			
			// 修改网页标题
			document.title = "重新发送账号激活码"
			// 直接进入当前页面，先判断是否已经登录，否则不允许进入
			const token = localStorage.getItem('token')
			if(token){
				ElMessage({type: 'warning', message: '您已登录'})
				router.go(-1)
			}
			return {my_form, my_form_model, my_form_rules, btn_resend, btn_status}
		}
	}
</script>

<style lang="less">
	.resend-window{
		margin: 0 auto;
		padding: 20px;
		border-radius: 3%;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
		background-color: rgba(75, 185, 206, 0.3);
		width:400px;
		height: 150px;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		.resend-button{
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