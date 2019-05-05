(function(dataValueHelper) {

	var yewuPosUrl = "http://192.168.15.155:8180/businessManage"; //业务posurl
	// 例子调用：
	//dataValueHelper.GetDictionaryDataList("activeStatus","#channelCode",".channelCode",'全部');
	/*
	 * 功能：根据地址查询键值
	 */
	var QueryString = function(val, src) {
		if(src != '' && src != undefined && src != null) {
			var searchStr = src.substr(1); //将searchStr字符串分割成数组，数组中的每一个元素为一个参数和参数值 
			var searchs = searchStr.split("?"); //获得第一个参数和值 
			for(var item in searchs) {
				var parms = searchs[item].split("=");
				if(parms[0] == val) {
					return parms[1];
				}
			}
		}
		return "";
	};
	/*
	 * 功能：取当前js的引用路径
	 */
	var GetPath = function() {
		var js = document.scripts || document.getElementsByTagName("script");
		var jsPath = '';
		for(var i = js.length; i > 0; i--) {
			if(js[i - 1].src.indexOf("dataValueHelper.js") > -1) {
				jsPath = QueryString('secret', js[i - 1].src);
			}
		}
		return jsPath;
	};

	dataValueHelper.configOption = {
		key: GetPath()
	};
	var serverUrl = yewuPosUrl;
	/*
	 * 功能：根据主表code获取子 码表列表
	 * 参数（主表code,ul标签，展示btn标签，默认显示文本,回调函数）
	 */
	dataValueHelper.GetDictionaryDataList = function(dictCode, elements, elementsBtn, defaultText, callback) {
		console.log(dataValueHelper.configOption)
		var config = {
			"elements": elements,
			"elementsBtn": elementsBtn,
			"defaultText": defaultText
		};
		var jsonParam = {
			"marked": "getDictionaryDataList",
			"code": "10002",
			"version": "1.0",
			"jsonStr": {}
		};
		jsonParam.jsonStr = dataHelper.setJson(null, "Dictionary_code", dictCode);
		if(typeof callback === 'function') {
			dataValueHelper.axjsonpPostMvc(serverUrl + "/getDictionaryDataList", jsonParam, callback);
		} else {
			dataValueHelper.axjsonpPostMvc(serverUrl + "/getDictionaryDataList", jsonParam, callback_GetDictionaryDataList, config);
		}
	};
	/*
	 * 功能：获取码表数据回调函数
	 * 创建人：liql
	 * 创建时间：2016-12-16
	 */
	function callback_GetDictionaryDataList(data, config) {
		console.log(data);
		$(config.elements).empty();
		if(config.defaultText != '') {
			$(config.elementsBtn).html(config.defaultText);
			$(config.elements).append("<li value=''><a>" + config.defaultText + "</a></li>");
		}
		$.each(data.lists, function(index, entry) {
			$(config.elements).append("<li value=" + entry.data_code + "><a>" + entry.data_name + "</a></li>");
		});

		//li改变事件
		$(config.elements).find('li').click(function() {
			$(config.elementsBtn).attr('data-value', $(this).attr('value'));
			$(config.elementsBtn).html($(this).find('a').html());
		});
	};

	dataValueHelper.axjsonpPostMvc = function(url, data, successfn, config, key) {

		data = (data == null || data == "" || typeof(data) == "undefined") ? {
			"date": new Date().getTime()
		} : data;
		$.ajax({
			type: "POST",
			url: url,
			data: JSON.stringify(data),
			headers: {
				'Content-Type': 'application/json',
				'certificateId': document.domain,
				'secret': dataValueHelper.configOption.key
			},
			async: false,
			//在请求之前调用的函数
			beforeSend: function() {
				$("#btn_loading").css('display', '');
			},
			//成功返回之后调用的函数             
			success: function(data) {
				if(config != null && config != undefined && config != '') {
					successfn(data, config);
				} else {
					successfn(data);
				}
			},
			//调用执行后调用的函数
			complete: function(XMLHttpRequest, textStatus) {
				$("#btn_loading").css('display', 'none');
			},
			//调用出错执行的函数
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				console.log(XMLHttpRequest.status);
				console.log(textStatus);
				//				console.log(textStatus);
				if(XMLHttpRequest.status != '200') {
					alert("AJAX请求错误：请求状态码：" + XMLHttpRequest.status + " readyState:" + XMLHttpRequest.readyState + "错误：" + textStatus);
				}
			}
		});
	};
	//	/*
	//	 * 功能：根据datacode码取对应码表名称
	//	 * 参数（）
	//	 */
	//	dataValueHelper.GeDataNameByDataCode=function(dictCode,dataCode,callback)
	//	{
	//		dataValueHelper.GetDictionaryDataList(dictCode,'','','',callback_)
	//	};
	window.dataValueHelper = dataValueHelper;

})(window.dataValueHelper || {});