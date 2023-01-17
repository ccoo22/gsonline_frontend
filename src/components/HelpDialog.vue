<template>
	<el-dialog v-model="show" title="求助与反馈" width="30%" center align-center destroy-on-close>
		
		<template #header>
		      <div class="my-header">
		        求助与反馈
		      </div>
		</template>
		
		
	    <el-form
	        ref="my_form"
	        :model="my_form_model"
	        :rules="my_form_rules"
	        label-width="0px"
	        class="demo-ruleForm"
	        status-icon
	    >
	    	<el-form-item label="" prop="title">
	    		<el-input v-model="my_form_model.title" placeholder="标题" clearable prefix-icon="InfoFilled"/>
	    	</el-form-item>
	    	
	    	<el-form-item label="" prop="content">
	    		<el-input v-model="my_form_model.content" placeholder="问题描述"  prefix-icon="Comment" :rows="10" type="textarea" />
	    	</el-form-item>
	    </el-form>
	    
		<template #footer>
		    <el-button type="primary" @click="send_message(my_form)">发送</el-button>
		</template>
			
	  </el-dialog>
</template>

<script>
	import {
		watch,
		reactive,
		ref,
		computed,
		getCurrentInstance
	} from 'vue'
	
	import {ElMessage, ElMessageBox} from 'element-plus'
	import {useRouter} from 'vue-router'
	export default{
		//
		props: ['show'],
		setup(props, { emit }){
			const router = useRouter()
			const {
				proxy
			} = getCurrentInstance()
			// 是否显示 el-dialog
			const show = computed({
			  get: () => props.show,
			  set: val => {
			    emit('update:show', val)
			  }
			})
			
			// 表单
			const my_form = ref('')
			const my_form_model = reactive({
				title: '',
				content: '',
			})
			// 用户名、密码 验证规则。务必与 表单名称一致
			const my_form_rules = reactive({
				title: [
						{type: 'string', required: true, message: '请输入标题', trigger: 'blur', transform(value){return value.trim()}},
						{type: 'string', min: 3, message: '至少3个字符', trigger: 'blur'},
					],
				content: [
						{type: 'string', required: true, message: '请输入标题', trigger: 'blur', transform(value){return value.trim()}},
						{type: 'string', min: 3, message: '至少3个字符', trigger: 'blur'},
				],
			})
			
			// 发送消息
			async function send_message(form1){
				// 先确认是否登陆
				if(! localStorage.getItem('token')){
					ElMessageBox.confirm("需要登陆", '警告', {confirmButtonText: '登陆',cancelButtonText: '取消',type: 'warning'}).then(() => {
						router.push({ name: 'login'})
					}).catch(()=>{
					// 取消
					})
				}else{
					await form1.validate( async (valid, fields)=>{
						// 表单填充项没有问题，则发送登陆请求
						if(valid){
							const res = await proxy.$my_request.post('/user/help_and_feedback/', {title: my_form_model.title, content: my_form_model.content}, {headers:{'Content-Type': 'application/x-www-form-urlencoded'}})
							if(res.status === 200){
								// 登陆成功，存储token,跳转到首页/刷新
								if(res.data.status === 0){
									ElMessage({type: 'success', message: '已收到您的反馈！'})
									show.value = false
								}else{
									ElMessage({type: 'error', message: '服务器异常，请稍后再试！'})
								}
							}
						}
					})
				}
			
			}
			
 
			
			return {show, my_form, my_form_model, my_form_rules, send_message}
		}
	}
</script>

<style lang="less" scoped>
	.my-header{
		// background-color: #081f67;
		// color: #fff;
		font-size: 1.5rem;
	}
</style>