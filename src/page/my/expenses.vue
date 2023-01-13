<template>
	<el-container style=" height: 100%;">
	      <el-header height='30px' class='el-descriptions__title' >
			  我的消费记录
			</el-header>
	      <el-main>
			  <el-table :data="filterTableData" style="width: 100%"   :stripe='true' :border='true'   table-layout='auto'>
				  <el-table-column prop="id" label="编号"></el-table-column>
			      <el-table-column prop="serial_number" label="流水号"   />
			      <el-table-column prop="desc" label="收入描述"   />
			      <el-table-column prop="income" label="收入情况" />
			      <el-table-column prop="balance" label="当前余额"  />
			      <el-table-column prop="date_created" label="创建时间"   sortable/>
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
	
	export default{
		setup(){
			const route = useRoute();
			const router = useRouter();
			// 获取vue实例
			const {
				proxy
			} = getCurrentInstance()
			
			// 任务列表
			const expenses = reactive([])
			// 软件详细信息获取
			async function get_expenses() {
				// 先确认是否登陆
				if(! localStorage.getItem('token')){
					ElMessageBox.confirm("需要登陆", '警告', {confirmButtonText: '登陆',cancelButtonText: '取消',type: 'warning'}).then(() => {
						router.push({ name: 'login'})
					}).catch(()=>{
					// 取消
					})
				}else{
					const res = await proxy.$my_request.get('/user/expenses/')
					if(res.status === 200){
						if(res.data.status == 0){
							expenses.length = 0
							expenses.push(...res.data.data)
							
						}
					}
				}
				
				
			}
			
			// 当前的工具名称
			onMounted(() =>{
				get_expenses()
			})
			// watch(()=>route.path, (path_new, path_old)=>{
			// 	get_expenses()
			// })
			
			const pageSize  = ref(15) // 每页显示数量
			const currentPage = ref(1)  // 当前页码
			const totalItemCount = ref(100)
			const filterTableData = computed(() =>{
				// 分页
				totalItemCount.value = expenses.length
				const index_start = (currentPage.value - 1) * pageSize.value
				var index_end = currentPage.value * pageSize.value - 1
				if(index_end >= expenses.length){
				    index_end = expenses.length - 1
				}
				// 返回当前分页数据
				return expenses.slice(index_start, index_end + 1)
			  }
				
			)
			
			return{filterTableData,pageSize ,currentPage, totalItemCount}
		}
	}
</script>

<style>
</style>