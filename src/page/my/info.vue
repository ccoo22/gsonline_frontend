<template>
	<el-descriptions title="我的账号信息" border :column='1'>
	    <el-descriptions-item label="用户名" width='20px' min-width='20px'>{{info.username}}</el-descriptions-item>
	    <el-descriptions-item label="邮箱" width='20px' min-width='20px'>{{info.email}}</el-descriptions-item>
	    <el-descriptions-item label="金币余额" width='20px' min-width='20px'>{{info.coin}}</el-descriptions-item>
	    <el-descriptions-item label="上一次登陆" width='20px' min-width='20px'>{{info.last_login}}</el-descriptions-item>
	    <el-descriptions-item label="账号创建日期" width='20px' min-width='20px'>{{info.date_joined}}</el-descriptions-item>
 
	  </el-descriptions>
 

</template>

<script>
	import {watch, onMounted, getCurrentInstance, reactive} from 'vue'
	import {useRoute, useRouter} from 'vue-router'
	import {ElMessageBox,  } from 'element-plus'
	
	export default{
		setup(){
			const route = useRoute();
			const router = useRouter();
			// 获取vue实例
			const {
				proxy
			} = getCurrentInstance()
			

			const info = reactive({})
			 
			async function get_info() {
				// 先确认是否登陆
				if(! localStorage.getItem('token')){
					ElMessageBox.confirm("需要登陆", '警告', {confirmButtonText: '登陆',cancelButtonText: '取消',type: 'warning'}).then(() => {
						router.push({ name: 'login'})
					}).catch(()=>{
					// 取消
					})
				}else{
					const res = await proxy.$my_request.get('/user/info/')
					if(res.status === 200){
						if(res.data.status == 0){
							Object.assign(info, res.data.data)
							
						}
					}
				}
				
				
			}
			
			// 当前的工具名称
			onMounted(() =>{
				get_info()
			})
			watch(()=>route.path, (path_new, path_old)=>{
				get_info()
			})
			
			return{info}
		}
	}
</script>

<style>
</style>