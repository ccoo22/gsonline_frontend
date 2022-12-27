import { ref, reactive} from 'vue'

// 表单值、表单规则初始化
export function form_value_and_rules_initialization(ui){
	const my_form_model = reactive({})
	const my_form_rules = reactive({}) 
	ui.forEach((item, index)=>{
			if(item['type'] !== 'placeholder'){
				if('default' in item){
					my_form_model[item.name] = item.default
				}else{
					if(item.type === 'upload'){
						// upload 必须给列表
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
	return {my_form_model, my_form_rules}
}

// 表单数据打包
export function form_pack(ui, form_model){
	// 打包数据
	var formData = new FormData()
	ui.forEach((item, index)=>{
		// 参数名称
		const param_name = item['name']
		if(item['type'] !== 'placeholder'){
			if(item['type'] === 'upload'){
				// 文件打包
				if(form_model[param_name].length > 0){
					form_model[param_name].forEach((file_obj, file_index)=>{
						formData.append(param_name, file_obj.raw)
					})
				}
			}else{
				// 其他参数
				if(form_model[param_name] instanceof Array){
					// 数组
					form_model[param_name].forEach((value, value_index)=>{
						formData.append(param_name, value)
					})
				}else{
					// 普通
					formData.append(param_name, form_model[param_name])
				}
			}
		}
	})
	return formData
}

// 按钮状态修改
export function set_btn_status(btn_status, model){
	if(model === 'start'){
		btn_status.msg = "开始分析"
		btn_status.loading = false
		btn_status.disabled = false
	}
	if(model === 'upload'){
		btn_status.msg = "数据上传中"
		btn_status.loading = true
		btn_status.disabled = true
	}
}


// 运行状态，特效
export function status_tag(status){
				switch(status){
					case 'queue':
						return ''
						break
					case 'running':
						return 'warning'
						break
					case 'error':
						return 'danger'
						break
					case 'complete':
						return 'success'
						break
					default:
						return ''
				}
			}
