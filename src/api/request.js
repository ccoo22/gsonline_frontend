import axios from 'axios'
import {ElMessageBox, ElLoading} from 'element-plus'


// 创建通用 axios 配置
let instance = axios.create({
	baseURL: 'http://192.168.0.13:8000',  // 后端地址
	// baseURL: 'http://cloud.geneskybiotech.com:8082',  // 后端地址
	responseType: "json",
	headers:{'Content-Type': 'application/json'}
})

var loading = null;
// http拦截：在 axios 请求发出之前，给每一个接口携带token去后端校验身份
instance.interceptors.request.use(
	config =>{
		// 加载中，屏蔽罩
		if(loading){
			// 如果上一次的请求还没有结束，新的一次又来了，此时，要先关闭上一次的
			loading.close()
			loading = null
		}
		loading = ElLoading.service({text: '加载中', background: 'rgba(0, 0, 0, 0.05)', lock: false, fullscreen: false, target:"#my-show-content"})
		let token = localStorage.getItem('token')
		if(token){
			config.headers.Authorization = token
		}
		return config
	}, // 请求失败
	err => {
		return Promise.reject(err)
	}
)

// http拦截： 在 axios请求发出后，接收到了返回信息
instance.interceptors.response.use(
	// 信息正常，直接返回数据即可
	response =>{
		if(loading){
			loading.close()
			loading = null
		}
		return response
	}, // 返回异常，处理一下
	error => {
		if(loading){
			loading.close()
			loading = null
		}
		if(error.response){
			ElMessageBox.alert("远程服务器异常，请稍后重试，或者联系管理员。error code:  " + error.response.status , "error", {confirmButtonText: '确认'})
		}else{
			ElMessageBox.alert("远程服务器错误，请稍后重试，或者联系管理员。error code:  " + error.code, "error", {confirmButtonText: '确认'})
			error.response = {'status': 404}
		}
		return error.response // 返回接口的错误信息
	}
)

export default instance