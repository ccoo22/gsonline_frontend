<template>
	<el-descriptions title="任务描述" :column='3' border size='default'>
		<!-- 刷新按钮 -->
		<template #extra>
			<el-button type="primary" @click="router.go(0)">刷新页面</el-button>
		</template>
	    <el-descriptions-item label="任务id" >{{result.mission_id}}</el-descriptions-item>
	    <el-descriptions-item label="任务名" >{{result.mission_name}}</el-descriptions-item>
	    <el-descriptions-item label="软件" >  <router-link :to="'/tools/all/' + result.software" target="_blank"> <el-tag  round >{{result.software}}</el-tag> </router-link></el-descriptions-item>
	    <el-descriptions-item label="运行状态" >
			  <el-steps :active="result_status.active" finish-status='success'>
			    <el-step title="接收"  :description="result.date_created" />
			    <el-step title="运行"  :description="result.date_run" />
			    <el-step :title="result_status.final_title" :description="result.date_finished" :status='result_status.final_status' />
			  </el-steps>
		</el-descriptions-item>
		<el-descriptions-item label="用户" >{{result.username}}</el-descriptions-item>
	</el-descriptions>
	
	<div class='el-descriptions__title my-title'>分析结果 <el-tag class="ml-2" type="danger">注意：结果最多保存 7 天，请及时下载</el-tag></div>
			
	
	<ShowResult :result="result"></ShowResult>
</template>

<script>
	import {watch, ref, onMounted, computed, getCurrentInstance, reactive} from 'vue'
	import {useRoute, useRouter} from 'vue-router'
	import { ElLoading , ElMessageBox, ElMessage } from 'element-plus'

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
				if(path_new.search('missions') > 0){
					// 当跳转的新页面也是 missions结果，才会执行结果获取
					get_result()
				}
				
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
							// 修改网页标题
							document.title = "结果查看 " + result.mission_name
						}else{ 
							ElMessage({type: 'error', duration: 5000, message: res.data.msg })
						}
					} 
				}
				
				
			}
			
			// 运行steps 优化
			const result_status = computed(()=>{
				const status = {active: 0, final_status: '', final_title: '完成'}
				if('status' in result){
					switch(result.status){
						case 'queue':
							status.active = 1
							break
						case 'running':
							status.active = 2
							break
						case 'error':
							status.active = 3
							status.final_title = "错误"
							status.final_status = 'error'
							break
						case 'complete':
							status.active = 3
							break
						default:
							return ''
					}
				}
				
				return status
			})
			
			return {mission_id, result, result_status, router}
		}
	}
</script>

<style scoped>
	.my-title{
		margin: 1rem 0;
	}
</style>