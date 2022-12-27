<template>
	<div>
		<el-tabs type="border-card" @tab-click="choose_tab">
			<div v-for="(item, index) in result" :key="index">
				<!-- 下载模块 -->
				<el-tab-pane :label="item.type" v-if="item.type === 'download'">
					<template #label>
						<el-icon><Download /></el-icon> 下载
					</template>
					
					<el-tag type="success" size='large' effect='light' round v-for="(item_value, index_value) in item.value" :key="index_value" >
						<el-link  :href="item_value.file" target="_blank" :underline="false" type="default"> {{item_value.name}} </el-link>
						 
					</el-tag>
				</el-tab-pane>
				
				<!-- 预览图模块 -->
				<el-tab-pane :label="item.type" v-if="item.type === 'img'">
					<template #label>
						<el-icon><Picture /></el-icon> 绘图预览
					</template>
					
					<div v-for="(item_img, index_img) in item.value" :key="index_img" >
						<el-tag class="ml-2" type="success" size='large'  effect='light' round>{{ item_img.name }}</el-tag>
						<br>
						<!-- png/jpeg图 -->
						<el-image style="height: 500px" :src="item_img.file" fit="contain" v-if="item_img.file_type !== 'pdf'" />
					</div>
				</el-tab-pane>
				
				<!-- 预览文件模块 -->
				<el-tab-pane :label="item.type" v-if="item.type === 'txt'">
					<template #label>
						<el-icon><Document /></el-icon> 数据预览
					</template>
					
					<!-- 只有一个表格 -->
					<div v-if='item.value.length === 1'>
						<el-tag class="ml-2" type="success" size='large'  effect='light' round>{{ item.value[0].name }}</el-tag>
							<el-table :data="item.value[0].value" style="width: 100%" stripe >
							<el-table-column v-for="(item_title, title_index) in item.value[0].title" :key='title_index' :prop="item_title" :label="item_title"/>
							</el-table>
					</div>
					
					<!-- 有多个表格 -->
					<el-tabs tab-position="left" v-if='item.value.length > 1'>
					    <el-tab-pane :label="item_table.name" v-for="(item_table, index_table) in item.value" :key='index_table'>
							<el-table :data="item_table.value" style="width: 100%" stripe >
							    <el-table-column v-for="(item_title, title_index) in item_table.title" :key='title_index' :prop="item_title" :label="item_title"/>
							  </el-table>
						</el-tab-pane>
					     
					</el-tabs>
					 
				</el-tab-pane>
				
				<!-- 预览后台运行日志 -->
				<el-tab-pane :label="item.type" v-if="item.type === 'log'">
					<template #label>
						<el-icon><Memo /></el-icon> 后台运行日志
					</template>
					<el-input
					    v-model="log_txt"
					    :autosize='true'
					    type="textarea"
					    placeholder=" "
						readonly
					  />
 
				</el-tab-pane>
			</div>

		</el-tabs>
	</div>
	
</template>

<script>
	import { ref, computed, getCurrentInstance} from 'vue'
	
	// import VuePdfEmbed from 'vue-pdf-embed'
	export default{
		name: 'ShowResult',
		props: ['result'],
		// components:{VuePdfEmbed,},
		setup(props){
			const {
				proxy
			} = getCurrentInstance()
			
			const result = computed(()=> {
				const result_filter = []
				// 使用props传参中对象中的 download/img/txt/log 元素
				if('img' in props.result && props.result.img.length > 0){
					result_filter.push({'type': 'img', 'value': props.result.img})
				}
				if('txt' in props.result && props.result.txt.length > 0){
					result_filter.push({'type': 'txt', 'value': props.result.txt})
				}
				if('download' in props.result && props.result.download.length > 0){
					result_filter.push({'type': 'download', 'value': props.result.download})
				}
				if('log' in props.result ){
					result_filter.push({'type': 'log', 'value': props.result.log})
					get_log_text(props.result.log)
				}
				return result_filter
			})
			
			// 读入日志文本
			const log_txt = ref('')
			const get_log_text = async function(url){
				const res = await proxy.$my_request.get(url, {params:{ nowtime:new Date().getTime()}}  )
				if(res.status == 200){
					log_txt.value = res.data
				}
			}

			const choose_tab = (pane, ev)=>{
				if(pane.props.label === 'log'){
					get_log_text(props.result.log)
				}
			}
			
			
			return{result, choose_tab, log_txt}
		}
	}
</script>

<style scoped>
	 
</style>