<template>
	<el-dialog v-model="show" title="支付" width="40%" center align-center destroy-on-close @close="close_func()">
		
		<template #header>
		      <div class="my-header">
		        充值
		      </div>
		</template>
		
		<div class='pay_box'>
			<el-form
			    ref="my_form"
			    :model="my_form_model"
			    label-width="60px"
			    class="demo-ruleForm"
			    status-icon
			>
				
				<el-form-item label="">
					<el-radio-group v-model="my_form_model.coin" size="large">
						<el-radio-button :label="5">5金币</el-radio-button>
						<el-radio-button :label="10">10金币</el-radio-button>
						<el-radio-button :label="20">20金币</el-radio-button>
						<el-radio-button :label="50">50金币</el-radio-button>
						<el-radio-button :label="100">100金币</el-radio-button>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="自定义">
					<el-input-number v-model="my_form_model.coin_selfdefined" :min="0" :max="10000000" label="自定义"/>
				</el-form-item>
			</el-form>
			<div>
				<el-text class="mx-1" type='primary'>充值 : {{my_form_model.coin_final}} 金币 ({{my_form_model.money}}元)</el-text>
			</div>
			 
		</div>
		
		<!-- 支付平台选择 -->
	    <PayPlatform :show_pay_platform="show_pay_platform" :serial_number="my_form_model.serial_number"></PayPlatform>
	    
		<template #footer>
		    <el-button type="primary" @click="send_message(my_form)">下单</el-button>
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
	import PayPlatform from '@/components/PayPlatform.vue'
	import {ElMessage, ElMessageBox} from 'element-plus'
	import {useRouter} from 'vue-router'
	export default{
		components: {
			PayPlatform
		},
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
				coin: 100,
				coin_selfdefined: 0,
				coin_final: 0,
				money: 0,
				serial_number: ''
			})
			// 侦听coin单选框，它会消除自定义值
			watch(()=>my_form_model.coin,(newVal,oldVal)=>{
			            my_form_model.coin_selfdefined = 0
			})
			// 最终消耗资金计算
			my_form_model.coin_final = computed(() => {
			        if(my_form_model.coin_selfdefined > 0){
						return my_form_model.coin_selfdefined
					}else{
						return my_form_model.coin
					}
			})
			my_form_model.money = computed(() => {
			        return my_form_model.coin_final
			})
			
			// 发送消息
			async function send_message(form1){
			// 	先确认是否登陆
				if(! localStorage.getItem('token')){
					ElMessageBox.confirm("需要登陆", '警告', {confirmButtonText: '登陆',cancelButtonText: '取消',type: 'warning'}).then(() => {
						router.push({ name: 'login'})
					}).catch(()=>{
					// 取消
					})
				}else{
					const res = await proxy.$my_request.post('/pay/order/', {money: my_form_model.money, coin: my_form_model.coin_final}, {headers:{'Content-Type': 'application/x-www-form-urlencoded'}})
					if(res.status === 200){
						// 下单成功，跳转支付工具选择页面
						if(res.data.status === 0){
							console.log(res)
							ElMessage({type: 'success', message: '下单成功! 请支付'})
							// show.value = false
							show_pay_platform.value = true
							my_form_model.serial_number = res.data.data.serial_number
						}else{
							ElMessage({type: 'error', message: '服务器异常，请稍后再试！'})
						}
					}
		 
				}
			
			}
			const show_pay_platform = ref(false)
			const close_func = function(){
				console.log('closed')
			}
			
			return {show, show_pay_platform, my_form, my_form_model, send_message, close_func}
		}
	}
</script>

<style lang="less" scoped>
	.my-header{
		// background-color: #081f67;
		// color: #fff;
		font-size: 1.5rem;
	}
	.pay_box{
		
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
</style>