<template>
	<el-descriptions title="任务描述" :column='3' border size='default'>
		
		<!-- 刷新按钮 -->
		<template #extra>
			<el-button type="primary" @click="router.go(0)">刷新页面</el-button>
		</template>
	    <el-descriptions-item label="任务id" >{{result.mission_id}}</el-descriptions-item>
	    <el-descriptions-item label="任务名" >{{result.mission_name}}</el-descriptions-item>
	    <el-descriptions-item label="软件" >{{result.software}}</el-descriptions-item>
	    <el-descriptions-item label="运行状态" >
			<el-tag
			   :type="status_tag(result.status)"  
			  disable-transitions
			  >{{ result.status}}
			</el-tag>
			
		</el-descriptions-item>
	    <el-descriptions-item label="时间" >
			{{result.date_created}}  <el-tag class="ml-2" type="warning">created</el-tag><br>
			{{result.date_run}}  <el-tag class="ml-2" type="warning">run</el-tag><br>
			{{result.date_finished}} <el-tag class="ml-2" type="warning">finished</el-tag><br>
		</el-descriptions-item>
	</el-descriptions>
	
	<div class='el-descriptions__title my-title'>分析结果</div>
	<ShowResult :result="result"></ShowResult>
</template>

<script>
	import {watch, ref, onMounted, getCurrentInstance, reactive} from 'vue'
	import {useRoute, useRouter} from 'vue-router'
	import { ElLoading , ElMessageBox, ElMessage } from 'element-plus'
	import {status_tag} from '@/api/gsonline.js'
	// 自定义结果展示组件
	import ShowResult from '@/components/ShowResult.vue'  
	export default{
		components:{
			"ShowResult": ShowResult,
		},
		setup(){
			const route = useRoute();
			const router = useRouter();
			const {
				proxy
			} = getCurrentInstance()
			
			const mission_id = ref('')
			const result = reactive({})
			
			// 当前的结果id
			onMounted(() =>{
				mission_id.value = route.params.mission_id
				get_result()
			})
			watch(()=>route.path, (path_new, path_old)=>{
				mission_id.value = route.params.mission_id
				get_result()
			})
			
			// 获取结果
			async function get_result(){
				// 先确认是否登陆
				if(! localStorage.getItem('token')){
					ElMessageBox.confirm("需要登陆", '警告', {confirmButtonText: '登陆',cancelButtonText: '取消',type: 'warning'}).then(() => {
						router.push({ name: 'login'})
					}).catch(()=>{
					// 取消
					})
				}else{
					const res = await proxy.$my_request.get('/api/result/' + mission_id.value)
					if(res.status === 200){
						if(res.data.status == 0){
							Object.assign(result, res.data.data)
						}else{ 
							ElMessage({type: 'error', duration: 5000, message: res.data.msg })
						}
					} 
				}
				
				
			}
			
			return {mission_id, result, status_tag, router}
		}
	}
</script>

<style scoped>
	.my-title{
		margin: 1rem 0;
	}
</style>