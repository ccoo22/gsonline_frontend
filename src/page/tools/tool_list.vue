<template>
	<el-container style=" height: 100%;">
		<el-header height='40px' class="header">
			<div class='title'>
				<div class="order" > 
				
					<el-radio-group v-model="order" class="ml-4">
				      <el-radio-button label="id" size="default">默认</el-radio-button>
				      <el-radio-button label="name" size="default">名称<el-icon><Top /></el-icon></el-radio-button>
				      <el-radio-button label="view" size="default">浏览量<el-icon><Bottom /></el-icon></el-radio-button>
				      <el-radio-button label="run" size="default">运行量<el-icon><Bottom /></el-icon></el-radio-button>
				      <el-radio-button label="date_created" size="default">发布日期<el-icon><Bottom /></el-icon></el-radio-button>
				      <el-radio-button label="date_last_modified" size="default">最近更新<el-icon><Bottom /></el-icon></el-radio-button>
					</el-radio-group>
				</div>
				<div><el-input v-model="search" size="default"  style="width: 200px" placeholder="搜索" clearable  /> </div> 
			</div>
		</el-header>
		<el-main>
			<el-row>
				<el-col :span="span_per_item" v-for="(item, index) in filterSoftwares" :key="item.id">
					<router-link :to="item.router" target="_blank">
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
									<div v-if="item.price > 0" class='coin'>
										<span title="消耗金币">
											<el-icon><Coin /></el-icon>&nbsp;{{item.price}}
										</span> 
									</div>
									<div v-else>
										<el-tag class="ml-2" type="success" effect="dark" >免费</el-tag>
									</div>
									<div v-if="item.is_active == false" class='online'>
										未上线
									</div>
								</div>
							</div>
						</el-card>
				
					</router-link>
				</el-col>
			</el-row>
			
			<!-- 分页 -->
			<el-pagination 
			  background 
			  layout="total, sizes, prev, pager, next, jumper" 
			  :page-sizes="itemcount_per_page"
			  v-model:current-page="currentPage"
			  v-model:page-size="pageSize"
			  prev-text='上一页'
			  next-text='下一页'
			  hide-on-single-page
			  :total="totalItemCount" />
			  
		</el-main>
		
	</el-container>
</template>

<script>
	import {
		useRoute
	} from 'vue-router'
 import {ElMessage } from 'element-plus'
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
			const itemcount_per_page = [itemcount_per_column * 3, itemcount_per_column * 6, itemcount_per_column * 10, itemcount_per_column * 20]
			// 每个软件占据的宽度 (务必保证能够整除)
			const span_per_item = layout_width / itemcount_per_column

			// 当前的挑选的工具
			const tag = ref('')
			var softwares = reactive([])
			// 软件列表下载
			async function get_softwares() {
				// axios获取数据
				const res = await proxy.$my_request.get('/api/tools_list/'+tag.value)
				if(res.status === 200){
					if(res.data.status == 0){
						for (var i = 0; i < res.data.data.length; i++) {
							if (res.data.data[i].router === 'normal') {
								res.data.data[i].router = '/tools/' + tag.value + '/' + res.data.data[i].software
							}else{
								res.data.data[i].router = '/' + res.data.data[i].software
							}
						}
						// 绑定给 reactive
						softwares.length = 0
						softwares.push(...res.data.data)
						// 排序
						sortSoftwares(order.value)
					}else{
						ElMessage({type: 'error', message: res.data.msg})
					}
				}
			}
			// 挂载、监听路由
			onMounted(() => {
				tag.value = route.params.tag
				// 修改网页标题
				document.title = "类别 " + tag.value
				get_softwares()
			})
			// all/plot/statistic 三个路由之间切换时，不会触发挂载事件（因为他们调用了同一个vue），只会触发watch，因此，这里也要添加数据更新
			watch(() => route.path, (path_new, path_old) => {
				tag.value = route.params.tag
				// 修改网页标题
				document.title = "类别 " + tag.value
				// 去掉排序标签、默认排序
				localStorage.removeItem('order')
				order.value= 'id'
				get_softwares()
			})
			
			// 搜索
			const search = ref('')
			const pageSize  = ref(itemcount_per_page[0]) // 每页显示数量
			const currentPage = ref(1)  // 当前页码
			const totalItemCount = ref(100)
			const filterSoftwares = computed(() =>{
				// 搜索筛选
				const res = softwares.filter(
			    (data) =>
			      !search.value ||
			      data.name.toLowerCase().includes(search.value.toLowerCase()) || data.software.toLowerCase().includes(search.value.toLowerCase()) || data.description.toLowerCase().includes(search.value.toLowerCase()) || data.tag.join().toLowerCase().includes(search.value.toLowerCase())
			  )
				// 分页
				totalItemCount.value = res.length
				const index_start = (currentPage.value - 1) * pageSize.value
				var index_end = currentPage.value * pageSize.value - 1
				if(index_end >= res.length){
				    index_end = res.length - 1
				}
				// 返回当前分页数据
				return res.slice(index_start, index_end + 1)
			  }
				
			)
			
			// 排序
			const order = ref('id')
			// 获取已选中的排序标签
			const order_last = localStorage.getItem('order')
			if(order_last){
				order.value = order_last
			} 
			// 排序事件watch激活
			watch(order, (new_val, old_val) => {
				localStorage.setItem('order', new_val)
				sortSoftwares(new_val)
			})
			// 工具排序
			function sortSoftwares(val){
				switch(val){
					case 'id':
						softwares.sort(sortBy('id',1))
						break
					case 'name':
						softwares.sort(sortBy('name',1))
						break
					case 'view':
						softwares.sort(sortBy('view', -1))
						break
					case 'run':
						softwares.sort(sortBy('run', -1))
						break
					case 'date_created':
						softwares.sort(sortBy('date_created', -1))
						break
					case 'date_last_modified':
						softwares.sort(sortBy('date_last_modified', -1))
						break
				}
			}
			
			//attr：根据该属性排序；rev：升序1或降序-1，不填则默认为1
			function sortBy(attr,rev){
			    if( rev==undefined ){ rev=1 }else{ (rev)?1:-1; }
			    return function (a,b){
			        a=a[attr];
			        b=b[attr];
			        if(a<b){ return rev*-1}
			        if(a>b){ return rev* 1 }
			        return 0;
			    }
			}
			

			
			return {
				filterSoftwares,
				span_per_item,
				search,
				order,
				currentPage,
				pageSize,
				totalItemCount,
				itemcount_per_page
				
				
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
		margin: 2px auto;
		left: 0;
		right: 0;
	}

	// 卡片头部边距初始化
	:deep(.el-card__header)  {
		margin: 0;
		padding: 0;
		z-index: 1000;
	}

	// 软件名称
	.software-name {
		color: var(--el-text-color-primary);
		font-size: 1em;
		margin-bottom: 0.5em;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
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
		font-size: 0.8em;
	}
	
	.bottom{
		display: flex;
		justify-content: space-between;
		.coin{
			color: gold;
		}
		.online{
			font-weight: bold;
			color: red;
		}
	}
	
	.title{
		 display: flex;
		 justify-content: space-between;
	}
</style>
