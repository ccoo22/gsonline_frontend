<template>
	<el-dialog v-model="show" title="支付方式" width="20%" center align-center destroy-on-close>
		
		<template #header>
		      <div class="my-header">
		        选择支付方式
		      </div>
		</template>

		<div class='pay_box'>
			<div class="pay_box_one" @click="send_message('zhifubao')">
				<icon-alipay size="48" fill="#1677ff" />
				<div>支付宝</div>
			</div>
		</div>
		
		<template #footer>
		      <span class="dialog-footer">
		        <el-button @click="show = false">稍后支付</el-button>
				<el-button ><router-link to="/my/order_list">查看订单</router-link></el-button>

		      </span>
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
	import PayPlatform from '@/components/PayPlatform.vue'
	export default{
		props: ['show', 'serial_number'],
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
			
			
			// 获取支付链接
			async function send_message(platform){
				// 	先确认是否登陆
				if(! localStorage.getItem('token')){
					ElMessageBox.confirm("需要登陆", '警告', {confirmButtonText: '登陆',cancelButtonText: '取消',type: 'warning'}).then(() => {
						router.push({ name: 'login'})
					}).catch(()=>{
					// 取消
					})
				}else{
					const res = await proxy.$my_request.post('/pay/pay_'+platform+'/', {serial_number: props.serial_number}, {headers:{'Content-Type': 'application/x-www-form-urlencoded'}})
					if(res.status === 200){
						// 跳转到支付页面
						if(res.data.status === 0){
							window.open(res.data.data.url)
							show.value = false
						}else{
							ElMessage({type: 'error', message: '服务器异常，请稍后再试！'})
						}
					}
		 
				}
			
			}

			
			return {show, send_message}
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
		flex-direction: row;
		justify-content: center;
		align-items: center;
		.pay_box_one{
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			padding: 10px;
		}
	}
</style>