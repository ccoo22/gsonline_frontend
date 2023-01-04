<template>
	<el-row>
		<el-col :span="span_per_item" v-for="(item, index) in softwares" :key="item.id">
			<router-link :to="item.router">
				<el-card :body-style="{ padding: '0px'}" shadow="always">
					<template #header>
						<div class="img-container">
							<img :src="item.demo_img" class="image" />
						</div>
					</template>

					<div style="padding: 14px">
						<div class='software-name'>{{item.name}}</div>
						<div class="software-description"> <span :title="item.description">{{item.description}}

							</span> </div>

						<div class="bottom">
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
						</div>
					</div>
				</el-card>

			</router-link>
		</el-col>
	</el-row>

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
			// 布局：宽度 24 固定
			const layout_width = 24
			// 每行展示的软件个数
			const itemcount_per_column = 6
			// 每个软件占据的宽度 (务必保证能够整除)
			const span_per_item = layout_width / itemcount_per_column

			// 当前的挑选的工具
			const software_type = ref('')
			var softwares = reactive([])
			// 软件列表下载
			async function get_softwares() {
				// axios获取数据
				const res = await proxy.$my_request.get('/api/tools_list/'+software_type.value)
				if(res.status === 200){
					if(res.data.status == 0){
						for (var i = 0; i < res.data.data.length; i++) {
							if (res.data.data[i].router === 'normal') {
								res.data.data[i].router = '/' + software_type.value + '/' + res.data.data[i].software
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
				software_type.value = route.name
				get_softwares()
			})
			// all/plot/statistic 三个路由之间切换时，不会触发挂载事件（因为他们调用了同一个vue），只会触发watch，因此，这里也要添加数据更新
			watch(() => route.path, (path_new, path_old) => {
				software_type.value = route.name
				get_softwares()
			})


			return {
				softwares,
				span_per_item
			}
		}
	}
</script>

<style lang="less" scoped>
	// 卡片圆角
	.el-card {
		margin: 8px 8px;
		border-radius: 10px;
	}

	// 卡片悬停动作
	.el-card:hover {
		box-shadow: var(--el-box-shadow-dark);
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

	// 卡片头部边距初始化
	:deep(.el-card__header)  {
		margin: 0;
		padding: 0;
	}

	// 软件名称
	.software-name {
		color: var(--el-text-color-primary);
		font-size: 1em;
		margin-bottom: 0.5em;
	}

	// 描述字符
	.software-description {
		color: var(--el-text-color-regular);
		font-size: 0.7em;
		width: 100%;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		margin-bottom: 0.5rem;
	}

	// 浏览数、使用数
	.view-run-info {
		color: var(--el-text-color-placeholder);
		font-size: 1em;
	}
	
	.bottom{
		display: flex;
		justify-content: space-between;
		.coin{
			color: gold;
		}
	}
</style>
