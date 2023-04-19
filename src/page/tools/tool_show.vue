<template>
	<el-row class="software-show" align='top' ref="row_ref" v-if="'ui' in software_details" >
		 
		<el-col class="form-window" :span="14"   >
			<div class="content">
				<div class='title'>
					<span >{{software_details.name}}</span>
				</div>
				<!-- 表单 -->
				<el-form
				    ref="my_form"
				    :model="my_form_model"
					:rules="my_form_rules"
				    label-width="120px"
				    class="demo-ruleForm"
				>
					<el-row>
						<el-col :span="15" >
							<el-form-item label="任务名">
								<template #label>
									<el-tooltip
									    content="给当前任务取一个便于区分的名字"
									    raw-content
										placement="top-start" 
										effect="dark"
									  >
									  <span>任务名</span>
									</el-tooltip>
								</template>
								<el-input v-model="my_form_model.mission_name"  />
							</el-form-item>
						</el-col>
						<el-col :span="8" >
						</el-col>
						
						<el-col :span="item.span" :offset="item.offset" :pull="item.pull" v-for="(item, index) in software_details.ui" :key='index'>
				
							
							<!-- upload 文件输入 -->
							<el-form-item :label="item.label" :prop="item.name" :required="item.required" v-if="item.type === 'upload'">
								<template #label>
									
									<el-tooltip
									    :content="item.desc"
									    raw-content
										placement="top-start" 
										effect="dark"
									  >
									  <span>{{item.label}}</span>
									</el-tooltip>
									
								</template>
								
								<el-upload
									style="width: 100%;"
									action=""
									v-model:file-list="my_form_model[item.name]"
									:multiple="item.multiple"
									:limit="item.limit"
									:auto-upload="false"
									:show-file-list="true"
									:accept="item.accept"
								>
									<el-button type="primary">{{item.placeholder}}</el-button>
								</el-upload>
							</el-form-item>
							
							<!-- input-text 输入框 -->
							<el-form-item :label="item.label" :prop="item.name" :required="item.required" v-if="item.type === 'input-text'">
								<template #label>
									<el-tooltip
									    :content="item.desc"
									    raw-content
										placement="top-start" 
										effect="dark"
									  >
									  <span>{{item.label}}</span>
									</el-tooltip>
								</template>
								<el-input v-model="my_form_model[item.name]" :placeholder="item.placeholder" clearable />
							</el-form-item>
							
							<!-- input-textarea 输入框 -->
							<el-form-item :label="item.label" :prop="item.name" :required="item.required" v-if="item.type === 'input-textarea'">
								<template #label>
									<el-tooltip
									    :content="item.desc"
									    raw-content
										placement="top-start" 
										effect="dark"
									  >
									  <span>{{item.label}}</span>
									</el-tooltip>
								</template> 
								<el-input v-model="my_form_model[item.name]" :placeholder="item.placeholder" :rows="item.rows" type="textarea" clearable />
							</el-form-item>
							
							<!-- input-number 数字输入框 -->
							<el-form-item :label="item.label" :prop="item.name" :required="item.required" v-if="item.type === 'input-number'">
								<template #label>
									<el-tooltip
									    :content="item.desc"
									    raw-content
										placement="top-start" 
										effect="dark"
									  >
									  <span>{{item.label}}</span>
									</el-tooltip>
								</template>
								 <el-input-number v-model="my_form_model[item.name]" :min="item.min" :max="item.max" :step="item.step" size='small'/>
							</el-form-item>
							
							<!-- select 单选框 -->
							<el-form-item :label="item.label" :prop="item.name" :required="item.required" v-if="item.type === 'select'">
								<template #label>
									<el-tooltip
									    :content="item.desc"
									    raw-content
										placement="top-start" 
										effect="dark"
									  >
									  <span>{{item.label}}</span>
									</el-tooltip>
								</template>
								   <el-select v-model="my_form_model[item.name]" :placeholder="item.placeholder" :multiple='false' >
								     <el-option
								       v-for="(opt, opt_index) in item.options"
								       :key="opt"
								       :value="opt"
									   :label="item.options_label[opt_index]"
									   
								     >
										<div v-html="item.options_label_html[opt_index]"></div>
									 </el-option>
								   </el-select>
							</el-form-item>
							
							<!-- select-multiple 多选框 -->
							<el-form-item :label="item.label" :prop="item.name" :required="item.required" v-if="item.type === 'select-multiple'">
								<template #label>
									<el-tooltip
									    :content="item.desc"
									    raw-content
										placement="top-start" 
										effect="dark"
									  >
									  <span>{{item.label}}</span>
									</el-tooltip>
								</template>
								   <el-select v-model="my_form_model[item.name]" :placeholder="item.placeholder" :multiple='true'>
								     <el-option
								       v-for="(opt, opt_index) in item.options"
								       :key="opt"
								       :value="opt"
									   :label="item.options_label[opt_index]"
								     >
										<div v-html="item.options_label_html[opt_index]"></div>
									 </el-option>
								   </el-select>
							</el-form-item>
							
							<!-- checkbox 单选 -->
							<el-form-item :label="item.label" :prop="item.name" :required="item.required" v-if="item.type === 'checkbox'">
								<template #label>
									<el-tooltip
									    :content="item.desc"
									    raw-content
										placement="top-start" 
										effect="dark"
									  >
									  <span>{{item.label}}</span>
									</el-tooltip>
								</template>
								   <el-checkbox v-model="my_form_model[item.name]" />
							</el-form-item>
							
							<!-- checkbox-group 多选 -->
							<el-form-item :label="item.label" :prop="item.name" :required="item.required" v-if="item.type === 'checkbox-group'">
								<template #label>
									<el-tooltip
									    :content="item.desc"
									    raw-content
										placement="top-start" 
										effect="dark"
									  >
									  <span>{{item.label}}</span>
									</el-tooltip>
								</template>
								   <el-checkbox-group v-model="my_form_model[item.name]">
								       <el-checkbox :label="opt" v-for="opt in item.options" />
								     </el-checkbox-group>
							</el-form-item>
							
							<!-- switch 开关 -->
							<el-form-item :label="item.label" :prop="item.name" :required="item.required" v-if="item.type === 'switch'">
								<template #label>
									<el-tooltip
									    :content="item.desc"
									    raw-content
										placement="top-start" 
										effect="dark"
									  >
									  <span>{{item.label}}</span>
									</el-tooltip>
								</template>
								    <el-switch
								       v-model="my_form_model[item.name]"
								       :active-text="item.active_text"
								       :inactive-text="item.inactive_text"
								     />
							</el-form-item>
							
							
							<!-- slider 数字滑块 -->
							<el-form-item :label="item.label" :prop="item.name" :required="item.required" v-if="item.type === 'slider'">
								<template #label>
									<el-tooltip
									    :content="item.desc"
									    raw-content
										placement="top-start" 
										effect="dark"
									  >
									  <span>{{item.label}}</span>
									</el-tooltip>
								</template>
								    <el-slider v-model="my_form_model[item.name]" show-input :min="item.min" :max="item.max" :step="item.step" />
							</el-form-item>
							
							<!-- slider-range 数字滑块，选范围 -->
							<el-form-item :label="item.label" :prop="item.name" :required="item.required" v-if="item.type === 'slider-range'">
								<template #label>
									<el-tooltip
									    :content="item.desc"
									    raw-content
										placement="top-start" 
										effect="dark"
									  >
									  <span>{{item.label}}</span>
									</el-tooltip>
								</template>
								    <el-slider v-model="my_form_model[item.name]" range :min="item.min" :max="item.max" :step="item.step" />
							</el-form-item>
							
							
							<!-- color-picker 选颜色 -->
							<el-form-item :label="item.label" :prop="item.name" :required="item.required" v-if="item.type === 'color-picker'">
								<template #label>
									<el-tooltip
									    :content="item.desc"
									    raw-content
										placement="top-start" 
										effect="dark"
									  >
									  <span>{{item.label}}</span>
									</el-tooltip>
								</template>
								    <el-color-picker v-model="my_form_model[item.name]" />
							</el-form-item>
							
							<!-- radio-group 单选框 -->
							<el-form-item :label="item.label" :prop="item.name" :required="item.required" v-if="item.type === 'radio-group'">
								<template #label>
									<el-tooltip
									    :content="item.desc"
									    raw-content
										placement="top-start" 
										effect="dark"
									  >
									  <span>{{item.label}}</span>
									</el-tooltip>
								</template>
								    <el-radio-group v-model="my_form_model[item.name]">
								          <el-radio :label="opt" v-for="opt in item.options"> {{opt}} </el-radio>
								        </el-radio-group>
							</el-form-item>
							
							<!-- 分割线 -->
							<el-divider :border-style="item.border_style" :content-position='item.content_position' v-if="item.type === 'divider'"> 
							<div v-html="item.desc"></div>
							</el-divider>
							
							<!-- 下载示例 -->
							<el-button color="#247585" @click="get_example_data(item.name)" v-if="item.type === 'download_demo_file'">
								示例&nbsp; <icon-download-one size="18" fill="#fff"/>
							</el-button>
				 
				
						</el-col>
					</el-row>
				
				</el-form>
				
				
				<!-- 进度条 -->
				<div class="progress" v-if="btn_status.loading">
					<el-progress type="dashboard" :percentage="upLoadProgress">
					      <template #default="{ percentage }">
					        <span class="percentage-value">{{ upLoadProgress }}%</span><br>
					        <span class="percentage-label">Uploading</span>
					      </template>
					    </el-progress>
				</div>
				<div class='cost'>
					<div v-if="software_details.price > 0" class='gold'>
						<span title="消耗金币">
							<el-icon><Coin /></el-icon>&nbsp;{{software_details.price}}
						</span> 
					</div>
					<div v-else>
						<el-tag class="ml-2" type="success" effect="dark">免费</el-tag>
					</div>
				</div>
				<!-- 上传按钮 -->
				<div class='button'>
					<el-button type='success' @click='btn_start_run(my_form)' :loading='btn_status.loading' :disabled='btn_status.disabled'> {{btn_status.msg}}</el-button>
				</div>
				 
			</div>
			
		</el-col>
		
		<!-- 用法 -->
		<el-col class="form-usage" :span="8" :style="usageHeight" >
			<el-tabs v-model="usage_activeName" type='border-card' style="height: 100%; border-bottom: 0px;">
			    <el-tab-pane label="描述" name="usage" style="overflow: auto;">
					<el-scrollbar :max-height="contentHeight">
						  <el-card class="box-card" shadow='never' style="height: 100%;border: 0px;">
							<div style="width: 1000px"></div>
 						    <div v-html="software_details.usage" ></div> 
						  </el-card>
					</el-scrollbar>
				</el-tab-pane>
				
			    <el-tab-pane label="参数说明" name="params">
					<el-scrollbar :max-height="contentHeight">
						<el-descriptions title="" border :column='1' size='small'>
							<el-descriptions-item :label="item.label" v-for="(item, index) in software_helps" :key='index' :width='150000' > <div v-html="item.desc"></div> </el-descriptions-item>
						</el-descriptions>
					</el-scrollbar>
				</el-tab-pane>
				
			    <el-tab-pane label="示例图" name="pic">
					<el-card shadow="never" class="usage">
						<div style="width: 1000px"></div>
					    <el-image :src="software_details.demo_img"  :preview-src-list='[software_details.demo_img]' :hide-on-click-modal='true' fit='contain' :preview-teleported='true' />
					</el-card>
				</el-tab-pane>
				
			    <el-tab-pane label="工具信息" name="tool_info">
					<el-descriptions title="" border :column='1' size='small'  :max-height="contentHeight">
						<el-descriptions-item label="版本"  :width='150000'>{{software_details.version}}</el-descriptions-item>
						<el-descriptions-item label="标签"  :width='150000'>
							<router-link v-for="tag in software_details.tag" :to="'/tools/' + tag"> <el-tag  round >{{tag}}</el-tag> </router-link>
						</el-descriptions-item>
						<el-descriptions-item label="发布日期" :width='150000'>{{software_details.date_created}}</el-descriptions-item>
						<el-descriptions-item label="最近更新" :width='150000'>{{software_details.date_last_modified}}</el-descriptions-item>
						<el-descriptions-item label="引用" :width='150000'>{{software_details.citation}}</el-descriptions-item>
					</el-descriptions>
				</el-tab-pane>
			  </el-tabs>
			  
		</el-col>
	</el-row>

</template>

<script  >
	import {
		useRoute, useRouter
	} from 'vue-router'
	import {watch, ref, h, onMounted, getCurrentInstance, reactive, computed} from 'vue'
 
 import { ElMessageBox, ElMessage } from 'element-plus'
 import {form_pack, set_btn_status} from '../../api/gsonline.js'
	export default {
		setup() {
			const route = useRoute();
			const router = useRouter();
			// 获取vue实例
			const {
				proxy
			} = getCurrentInstance()
			// 软件
			const software_name = ref('')
			const software_details = reactive({})
			const skip_types = ['placeholder', 'divider', 'download_demo_file']
			const software_helps = computed(() => software_details.ui.filter((item) => !skip_types.includes(item['type'])) )
			// 表单对象
			const my_form = ref('')
			// 表单参数
			const my_form_model = reactive({})
			const my_form_rules = reactive({})  // 必填规则
			// 软件详细信息获取
			async function get_software() {
				const res = await proxy.$my_request.get('/api/tool/'+software_name.value)
				if(res.status === 200){
					if(res.data.status == 0){
						Object.assign(software_details, res.data.data)
						// 添加表单参数
						software_details.ui.forEach((item, index)=>{
							if(!skip_types.includes(item['type'])){
								if('default' in item){
									my_form_model[item.name] = item.default
									// if(item['type'] == 'input-number' && typeof item.default !== 'number'){
									// 	my_form_model[item.name] = NaN
									// }
								}else{
									if(item.type === 'upload'){
										my_form_model[item.name] = []
									}else{
										my_form_model[item.name] = ''
									}
								}
								// 添加必填验证
								if(item['required']){
									my_form_rules[item['name']] = [{required: true, message: '必填', trigger: 'blur'}]
								}
							}
						})
						// 添加客户自定义任务名
						my_form_model.mission_name = software_name.value
					}else{
						ElMessage({type: 'error', message: res.data.msg})
					}
				}
			}
			
			// 当前的工具名称
			onMounted(() =>{
				software_name.value = route.params.software
				get_software()
			})
			// watch(()=>route.path, (path_new, path_old)=>{
			// 	// software_name.value = route.params.software
			// 	// get_software()
			// 	console.log("离开软件页面了，但是还是激活了 watch", software_name.value)
			// })
			
			
			// 按钮状态
			const btn_status = reactive({})
			set_btn_status(btn_status, 'start')
			
			// 上传进度
			const upLoadProgress = ref(0)
			
			// 开始分析（1）数据检测 （2）打包上传
			async function btn_start_run(form1){
				// 先确认是否登陆
				if(! localStorage.getItem('token')){
					ElMessageBox.confirm("需要登陆", '警告', {confirmButtonText: '登陆',cancelButtonText: '取消',type: 'warning'}).then(() => {
						router.push({ name: 'login'})
					}).catch(()=>{
					// 取消
					})
				}else{
					await form1.validate( async (valid, fields) => {
						if(valid){
							// 验证合格
							// 修改按钮状态
							set_btn_status(btn_status, 'upload')
							ElMessage({type: 'warning', message: '数据上传中，请耐心等待，不要关闭窗口'})
							  
							// 数据打包
							var formData = form_pack(software_details.ui, my_form_model, skip_types)
							formData.append('mission_name', my_form_model.mission_name)  // 任务名
							formData.append('software', software_name.value)  // 软件
							formData.append('version', software_details.version)  // 软件版本
					
							// 发送
							const axios_config = {headers:{'Content-Type': 'multipart/form-data'}, onUploadProgress: (progressEvent)=>{
								if (progressEvent.upload) {
								    upLoadProgress.value = Math.round(progressEvent.progress * 100)
								}
							}} 
							const res = await proxy.$my_request.post('/api/mission_accept/', formData, axios_config)
							if(res.status === 200){
								// 上传成功
								if(res.data.status === 0){
									ElMessage({type: 'success', message: '任务提交完成'})
									
									// 跳转到结果页面
									ElMessageBox.confirm("任务提交完毕，是否查看结果? <br>也可以在 '我的' -> '任务' 中查看<br>另外，当分析完成时，我们也将通过您注册的邮件发送通知", '通知', {confirmButtonText: '查看结果', cancelButtonText: '留在当前页面', type: 'success', dangerouslyUseHTMLString: true,}).then(() => {
										
										let routeData = router.resolve({
										        name: 'MyResult',
										        params: {'mission_id': res.data.mission_id}
										    })
										window.open(routeData.href, '_blank')
									}).catch(()=>{
										// 取消
									})
								}else{
									// 上传失败
									ElMessage({type: 'error', duration: 5000, message: '数据上传失败：' + res.data.msg })
								}
							}
							
							// 按钮状态重置
							set_btn_status(btn_status, 'start')
							
							 
						}else{
							ElMessage({type: 'error', message: '注意必填项'})
						}
					})
				}
			}
			
			// 示例文件下载函数
			async function get_example_data(file_name) {
				const res = await proxy.$my_request.get('/api/demo_file/' + file_name)
				if(res.status === 200){
					if(res.data.status == 0){
						var url = res.data.data.demo_file
						var name = url.substr(url.lastIndexOf("/") + 1);
						fileAjax(url, function(xhr) {
						    downloadFile(xhr.response, name)
						}, {
						    responseType: 'blob'
						})
					}else{
						ElMessage({type: 'error', message: '示例数据丢失'})
					}
				}
			}
			
			function fileAjax(url, callback, options) {
			    let xhr = new XMLHttpRequest()
			    xhr.open('get', url, true)
			    if (options.responseType) {
			        xhr.responseType = options.responseType
			    }
			    xhr.onreadystatechange = function() {
			        if (xhr.readyState === 4 && xhr.status === 200) {
			            callback(xhr)
			        }
			    }
			    xhr.send()
			}
			
			function downloadFile(content, filename) {
			    window.URL = window.URL || window.webkitURL
			    let a = document.createElement('a')
			    let blob = new Blob([content])
			// 通过二进制文件创建url
			    let url = window.URL.createObjectURL(blob)
			    a.href = url
			    a.download = filename
			    a.click()
			// 销毁创建的url
			    window.URL.revokeObjectURL(url)
			}
			
			
			// usage 页面高度定义
			const usageHeight = reactive({'max-height': window.innerHeight - 60 - 20 - 24 + 'px'})
			// usage tab 页面高度
			const contentHeight = ref(window.innerHeight - 60 - 20 - 24 - 100 + 'px')
			// tab 默认
			const usage_activeName = ref('usage')
			return {my_form, my_form_model, my_form_rules, software_details, software_helps, btn_status, btn_start_run, upLoadProgress, usageHeight, contentHeight, usage_activeName, get_example_data}
		}
	}
</script>

<style lang="less">
	.software-show{
		 position: relative;
		 width: 100%;
		 height: 100%;
		 .form-window{
			 // z-index: 100;
			 .content{
				background-color: white;
				border-radius: 1rem;
				margin: 8px 12px 20px 12px;
				padding: 12px 0;
				box-shadow: var(--el-box-shadow);
				.title{
					font-size: 2rem;
					display: flex;
					justify-content: center;
					margin-bottom: 1rem;
					
				}
				.button{
					display: flex;
					justify-content: center;
					margin-bottom: 1rem;
				}
				.progress{
					display: flex;
					justify-content: center;
					margin-bottom: 1rem;
				}
				.cost{
					display: flex;
					justify-content: center ;
					color: gold;
					margin: 10px 10px;
				}
			 }
			 
		 }
		
		.form-usage{
			position: fixed;
			right: 1.5%;
			background-color: white;
			margin: 8px 0px 20px 12px;
			padding: 12px 0;
			border-radius: 1rem;
			box-shadow: var(--el-box-shadow);
 
			// .demo-image{
			// 	// margin: 1rem auto 1rem auto;
			// 	width: 100%;
			// }
			// .usage{
			// 	border: 0px;
			// 	width: 100%;
			// 	display: flex;
			// 	justify-content: center;
			// }
		}
	}
	
</style>