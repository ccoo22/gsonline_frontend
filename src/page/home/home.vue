<template>
	<el-row>
	    <el-col :span="8">
			<el-card class="gsonline-desc"  style="height: 350px;"  >
				 
				<span class='jianjie'>简介</span>
			    <p class="text-indent-2">天昊云（GSOnline）致力于打造一款供科研人员使用的、功能强大的、易用的、资源丰富的云分析平台。</p>
			    <p class="text-indent-2">我们精心为每一个工具设计了较为完善的图形用户界面、帮助信息、结果预览界面，方便您快速掌握工具的用法，获取理想的分析结果。</p>
			    <p class="text-indent-2">GSOnline包含了任务管理模块，方便您进行任务进度查看、历史结果检索、任务删除等操作。同时也内嵌了任务反馈模块，当任务完成或异常时，我们会及时通过您注册账户时的邮箱通知您。</p>	 
			</el-card>
		</el-col>
		<el-col :span="16" >
			<el-card style="height: 350px;">
				<div class='jianjie flex-middle'>
					<div>热门</div>
				</div>
			<el-row justify='space-around'>
				<el-col :span="6" v-for="(item, index) in softwares" :key="item.id">
					<router-link :to="item.router">
						<el-card :body-style="{ padding: '0px'}" shadow="always">
							<template #header>
								<div class="img-container"> 
									<img :src="item.demo_img" class="image" />
								</div>
							</template>
				
							<div style="padding: 14px">
								<div class='software-name'>{{item.name}}</div>
								<!-- <div class="software-description"> <span :title="item.description">{{item.description}}
				
									</span> </div> -->
				
							<!-- 	<div class="bottom">
									<div class="view-run-info">
										<span title="浏览数">
											<el-icon>
												<View />
											</el-icon>&nbsp;{{item.view}}
										</span>&nbsp;
										<span title="运行数">
											<icon-link-cloud />&nbsp;{{item.run}}
										</span>
									</div>
									<div class='coin'>
										<span title="消耗金币">
											<el-icon><Coin /></el-icon>&nbsp;{{item.price}}
										</span> 
										
									</div>
								</div> -->
							</div>
						</el-card>
				
					</router-link>
				</el-col>
			</el-row>
			</el-card>
		</el-col>
	</el-row>
	
	<el-row>
		<el-col :span='12'>
			<el-card  >
				<div class='jianjie shijian flex-middle'>
					<div>事件</div>
				</div>
				
				  <el-timeline>
				    <el-timeline-item
				      v-for="(bigevent, index) in bigevents"
				      :key="index"
				      :timestamp="bigevent.timestamp"
					  :size="bigevent.size"
					  :type="bigevent.type"
				    >
				      {{ bigevent.content }}
				    </el-timeline-item>
				  </el-timeline>
				  
 			</el-card>
		</el-col>
		<el-col :span='12'>
			<el-card  >
				<div class='jianjie shijian flex-middle'>
					<div>开发者墙</div>
				</div>
				
				  <el-descriptions :column='1' border>
				      <el-descriptions-item label="ganb">
						贡献：GSOnline 前后端设计。生信工具开发规范设计。<br>
						联系：ganb@geneskies.com
					  </el-descriptions-item>
				      <el-descriptions-item label="xuy">
						  贡献：热图、PCA分析、GO/KEGG富集分析等工具的UI开发。<br>
						  联系：xuy@geneskies.com
						</el-descriptions-item>
				    </el-descriptions>
			</el-card>
		</el-col>
	</el-row>
	
	<!-- <el-button color="#247585" @click="get_example_data('otu')">示例&nbsp;<icon-download-one size="18" fill="#fff"/></el-button> -->

</template>

<script>
	import {
		useRoute
	} from 'vue-router'
	import {
		watch,
		ref,
		reactive,
		onMounted,
		getCurrentInstance,
		computed
	} from 'vue'
	
	export default {
		setup() {
			// 路由
			const route = useRoute();
			// 获取vue实例
			const {
				proxy
			} = getCurrentInstance()
	

			var softwares = reactive([])
			// 软件列表下载
			async function get_softwares() {
				// axios获取数据
				const res = await proxy.$my_request.get('/api/tools_hot/4')
				if(res.status === 200){
					if(res.data.status == 0){
						for (var i = 0; i < res.data.data.length; i++) {
							if (res.data.data[i].router === 'normal') {
								res.data.data[i].router = '/tools/all/' + res.data.data[i].software
							}else{
								res.data.data[i].router = '/' + res.data.data[i].software
							}
						}
						// 绑定给 reactive
						softwares.length = 0
						softwares.push(...res.data.data)
					}
					
				}
				
			}
			// 挂载、监听路由
			onMounted(() => {
				get_softwares()
			})
			// watch(() => route.path, (path_new, path_old) => {
			// 	get_softwares()
			// })
			
			// 事件
			const bigevents = [
			  {
			    content: '内部公开测试',
			    timestamp: '2022-12-26',
				size: 'large',
				type: 'primary',
			  },
			  {
			    content: 'GSOnline 项目启动',
			    timestamp: '2022-11-16',
				size: 'large',
				type: 'primary',
			  },
			]

			
			return {softwares, bigevents}
			
		}
	}
</script>

<style scoped lang="less">
	.gsonline-desc{
		background-color: #081f67;
		color: #fff;
		border-radius: 12px;
		size: 2rem;
		font-size: 1rem;
	}
	.jianjie{
		font-size: 2rem;
	}
	 
	.el-card {
		margin: 8px 8px;
		border-radius: 10px;
	}
	
	/* 创建一个正方形容器 */
	.img-container {
		width: 100%;
		height: 0px;
		padding-bottom: 80%;
		overflow: hidden;
		margin: 0;
		position: relative;
	}
	
	/* 采用绝对定位 */
	.img-container img {
		position: absolute;
		max-width: 100%;
		max-height: 100%;
	}
	.bottom{
		display: flex;
		justify-content: space-between;
		.coin{
			color: gold;
		}
		 
		.view-run-info {
			color: var(--el-text-color-placeholder);
			font-size: 1em;
		}
	}
	
	.shijian{
		padding-bottom: 12px;
	}
	
	.flex-middle{
		display: flex;
		justify-content: center ;
	}
</style>