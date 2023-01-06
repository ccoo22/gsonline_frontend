<template>
	<el-container style=" height: 100%;">
	      <el-header height='30px' >
			  <div class='title'>
				<div>我的任务列表</div> <div><el-input v-model="search" size="default"  style="width: 200px" placeholder="搜索" clearable  /> </div> 
			  </div>
		</el-header>
	      <el-main>
				<el-table :data="filterTableData" :stripe='true' :border='true' style="width: 100%"  table-layout='auto'>
					<el-table-column type="index"  label="行"/>
					<el-table-column prop="mission_name" label="操作">
						<template #default="scope">
							<el-button type="primary" round size='small'  @click="show_mission(scope.row.mission_id)">查看</el-button>
							 <el-popconfirm
							    confirm-button-text="是"
							    cancel-button-text="否"
							    title="确定要删除？"
							    @confirm="confirmDelete(scope.row.mission_id)"
							  >
							    <template #reference>
							      <el-button type="danger" round size='small'>删除</el-button>
							    </template>
							  </el-popconfirm>
							  
							
						</template>
						
					</el-table-column>
 
					<el-table-column prop="mission_name" label="任务名"   sortable>
						<template #default="scope">
							<el-popover
								placement="right"
								:width="500"
								trigger="hover"
							>
								<p>任务id: {{scope.row.mission_id}}</p>
								<template #reference>
									<span> {{ scope.row.mission_name}} </span>
								</template>
							</el-popover>
						</template>
					</el-table-column>
					<el-table-column prop="software" label="软件"  sortable >
						<template #default="scope">
					         <router-link :to="'/tools/all/' + scope.row.software"> <el-tag  round >{{scope.row.software}}</el-tag> </router-link>
					    </template>
					</el-table-column>
					<el-table-column prop="status" label="运行状态"   sortable :filters='filter_status' :filter-method="filter_status_fun">
						<template #default="scope">
							<el-tag
							:type="status_tag(scope.row.status)"  
							disable-transitions
							>{{ scope.row.status}}
							</el-tag>
						</template>
					</el-table-column>
					<el-table-column prop="date_created" label="接收时间"   sortable />
					<el-table-column prop="date_run" label="运行时间"   sortable />
					<el-table-column prop="date_finished" label="完成时间"   sortable />
				</el-table>
				  
				<!-- 分页 -->
				 
		  </el-main>
	</el-container>
	
 

</template>

<script>
	import {watch, ref, onMounted, getCurrentInstance, reactive, computed} from 'vue'
	import {useRoute, useRouter} from 'vue-router'
	import { ElLoading , ElMessageBox, ElMessage } from 'element-plus'
	import {status_tag} from '@/api/gsonline.js'
	export default{
		setup(){
			const route = useRoute();
			const router = useRouter();
			// 获取vue实例
			const {
				proxy
			} = getCurrentInstance()
			
			// 任务列表
			const missions = reactive([])
			// 软件详细信息获取
			async function get_missions() {
				// 先确认是否登陆
				if(! localStorage.getItem('token')){
					ElMessageBox.confirm("需要登陆", '警告', {confirmButtonText: '登陆',cancelButtonText: '取消',type: 'warning'}).then(() => {
						router.push({ name: 'login'})
					}).catch(()=>{
					// 取消
					})
				}else{
					const res = await proxy.$my_request.get('/user/missions/')
					if(res.status === 200){
						if(res.data.status == 0){
							missions.length = 0
							missions.push(...res.data.data)
							
						}
					}
				}
			}
			
 
			
			// 当前的工具名称
			onMounted(() =>{
				get_missions()
			})
			// watch(()=>route.path, (path_new, path_old)=>{
			// 	get_missions()
			// })
			
			// 表格处理
			// status 筛选策略
			const filter_status = [{text: 'error', value: 'error'}, {text: 'complete', value: 'complete'}, {text: 'queue', value: 'queue'},{text: 'running', value: 'running'}]
			const filter_status_fun = (value, row) => {
			  return row.status === value
			}
			
			// 搜索
			const search = ref('')
			const filterTableData = computed(() =>
			  missions.filter(
			    (data) =>
			      !search.value ||
			      data.mission_name.toLowerCase().includes(search.value.toLowerCase()) || data.software.toLowerCase().includes(search.value.toLowerCase())
			  )
			)
			
			// 跳转到任务详情页
			const show_mission = (mission_id) => {
				router.push({ name: 'MyResult', params:{'mission_id': mission_id}})
			}
			
			// 删除任务
			const confirmDelete = async (mission_id) =>{
				const res = await proxy.$my_request.get('/user/delete_mission/'+mission_id)
				if(res.status === 200){
					if(res.data.status == 0){
						// 修改客户端表格
						const tmps = missions.filter(
						  (data) => data.mission_id != mission_id
						)
						missions.length = 0
						missions.push(...tmps)
						ElMessage({type: 'success', duration: 5000, message: '任务删除成功'})
					}else{
						ElMessage({type: 'error', duration: 5000, message: '任务删除失败：' + res.data.msg})
					}
				}
			}

			return{missions, filter_status, filter_status_fun, search, filterTableData, status_tag, show_mission, confirmDelete}
		}
	}
</script>

<style scoped>
 .title{
	 display: flex;
	 justify-content: space-between;
 }
</style>