	/**
	 *获得数据,组装数据
	 *@author:waterbear
	 */

	//发送请求获取数据
	var getjson = function(method,url,data,successfn,errorfn) {
		$.ajax({
			url:url,
			type:method,
			data:data,
			dataType:'json',
			success:successfn,
			error:errorfn
		});
	};

	//标签过滤函数
	var htmlfilter = function(content) {
		if(!content) {
			return;
		}
		var regx = /<\/?[^>]*>/g;
		if(typeof content === "string") {
			content = content.replace(regx,'');
		}
		if(typeof content === 'object') {
			for(var key in content) {
                if(!content[key]){
					continue;
				}
				content[key] = content[key].replace(regx,'');
			}
		}
		return content;
	};