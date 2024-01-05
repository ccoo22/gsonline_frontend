<template>
	<el-container style=" height: 100%;">
	      <el-header height='30px' class='el-descriptions__title' >
			  我的充值订单
			  <PayPlatform v-model:show="show_pay_platform" :serial_number="serial_number"></PayPlatform>
			</el-header>
	      <el-main>
			  <el-table :data="filterTableData" style="width: 100%"   :stripe='true' :border='true'   table-layout='auto'>
				  <el-table-column prop="id" label="编号"></el-table-column>
			      <el-table-column prop="serial_number" label="流水号"   />
			      <el-table-column prop="money" label="交易金额"   />
			      <el-table-column prop="coin" label="金币充值" />
			      <el-table-column prop="is_payed" label="支付">
					  <template #default="scope">
					  	<el-text v-if="scope.row.is_payed == true" type="success" round size='small'>已支付</el-text>
						<el-button v-if="scope.row.is_payed == false" type="primary" round size='small' @click="show_pay_f(scope.row.serial_number)">支付</el-button>
					  </template>
				  </el-table-column>
			      <el-table-column prop="trade_platform" label="支付方式"  />
			      <el-table-column prop="trade_no" label="支付单号"  />
			      <el-table-column prop="date_created" label="下单时间"   sortable/>
			      <el-table-column prop="date_charge" label="支付时间"   sortable/>
			    </el-table>
				
				<!-- 分页 -->
				<el-pagination 
				  background 
				  layout="total, sizes, prev, pager, next, jumper" 
				  :page-sizes="[15, 30, 50, 100]"
				  v-model:current-page="currentPage"
				  v-model:page-size="pageSize"
				  prev-text='上一页'
				  next-text='下一页'
				  hide-on-single-page
				  :total="totalItemCount" />
		  </el-main>
	</el-container>
</template>

<script>
	import {watch, ref, onMounted, computed, getCurrentInstance, reactive} from 'vue'
	import {useRoute, useRouter} from 'vue-router'
	import { ElLoading , ElMessageBox, ElMessage } from 'element-plus'
	import PayPlatform from '@/components/PayPlatform.vue'

	export default{
		components:{PayPlatform},
		setup(){
			const route = useRoute();
			const router = useRouter();
			// 获取vue实例
			const {
				proxy
			} = getCurrentInstance()
			
			// 订单列表
			const order_list = reactive([])
			// 软件详细信息获取
			async function get_order_list() {
				// 先确认是否登录
				if(! localStorage.getItem('token')){
					ElMessageBox.confirm("需要登录", '警告', {confirmButtonText: '登录',cancelButtonText: '取消',type: 'warning'}).then(() => {
						router.push({ name: 'login'})
					}).catch(()=>{
					// 取消
					})
				}else{
					const res = await proxy.$my_request.get('/pay/order_list/')
					if(res.status === 200){
						if(res.data.status == 0){
							order_list.length = 0
							order_list.push(...res.data.data)
						}else{
							ElMessage({type: 'error', message: res.data.msg})
						}
					}
				}
				
				
			}
			
			// 当前的工具名称
			onMounted(() =>{
				// 修改网页标题
				document.title = "充值订单"
				get_order_list()
			})
			// watch(()=>route.path, (path_new, path_old)=>{
			// 	get_expenses()
			// })
			
			const pageSize  = ref(15) // 每页显示数量
			const currentPage = ref(1)  // 当前页码
			const totalItemCount = ref(100)
			const filterTableData = computed(() =>{
				// 分页
				totalItemCount.value = order_list.length
				const index_start = (currentPage.value - 1) * pageSize.value
				var index_end = currentPage.value * pageSize.value - 1
				if(index_end >= order_list.length){
				    index_end = order_list.length - 1
				}
				// 返回当前分页数据
				return order_list.slice(index_start, index_end + 1)
			  }
				
			)
			// 下单
			const show_pay_platform = ref(false)
			const serial_number = ref('')
			const show_pay_f = (sn) =>{
				serial_number.value = sn
				show_pay_platform.value = true
			}
			
			return{show_pay_platform, show_pay_f, serial_number, filterTableData,pageSize ,currentPage, totalItemCount}
		}
	}
</script>

<style>
</style>