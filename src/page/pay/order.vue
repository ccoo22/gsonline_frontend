<template>
	
	<div class="login-window">
		<div class="title">购买金币</div>
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
		
		<el-button class='login-button' type="primary" @click="send_message(my_form)">下单</el-button>   
		<PayPlatform v-model:show="show_pay_platform" :serial_number="my_form_model.serial_number"></PayPlatform>
		<div class='register'><router-link to="/my/order_list">查看所有订单</router-link> </div>
	</div>
</template>

<script>
import {ref, onUnmounted, reactive, getCurrentInstance, watch, computed, onMounted} from 'vue'
	import {
		useRouter, useRoute
	} from 'vue-router'
	import {ElMessageBox, ElMessage} from 'element-plus'
	import PayPlatform from '@/components/PayPlatform.vue'

	export default{
		components:{PayPlatform},
		setup(){
			const router = useRouter()
			const {
				proxy
			} = getCurrentInstance()

			
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
							ElMessage({type: 'success', message: '下单成功! 请支付'})
							my_form_model.serial_number = res.data.data.serial_number
							show_pay_platform.value = true
						}else{
							ElMessage({type: 'error', message: '服务器异常，请稍后再试！'})
						}
					}
		 
				}
			
			}
			// 当前的工具名称
			onMounted(() =>{
				// 修改网页标题
				document.title = "充值"
			})
			// 下单
			const show_pay_platform = ref(false)
			return {show_pay_platform, my_form, my_form_model, send_message}
		}
	}
</script>

<style lang="less">
	.login-window{
		margin: 0 auto;
		padding: 20px;
		border-radius: 3%;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
		background-color: #fff;
		width:600px;
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