<template>
	<el-container style=" height: 100%;">
	      <el-header height='30px' >
			  我的消费记录
			</el-header>
	      <el-main>
			  <el-table :data="expenses" style="width: 100%"   :stripe='true' :border='true'   table-layout='auto'>
				  <el-table-column type="index" />
			      <el-table-column prop="serial_number" label="流水号"   />
			      <el-table-column prop="desc" label="收入描述"   />
			      <el-table-column prop="income" label="收入情况" />
			      <el-table-column prop="balance" label="当前余额"  />
			      <el-table-column prop="date_created" label="创建时间"   sortable/>
			    </el-table>
		  </el-main>
	</el-container>
</template>

<script>
	import {watch, ref, onMounted, getCurrentInstance, reactive} from 'vue'
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
			
			return{expenses}
		}
	}
</script>

<style>
</style>