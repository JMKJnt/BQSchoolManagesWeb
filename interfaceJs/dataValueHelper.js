(function(dataValueHelper) {

//	var yewuPosUrl = "http://192.168.16.47:8080/dicDataInfo"; //业务posurl
	var yewuPosUrl = "http://www.ruischool.com/dicDataInfo"; //业务posurl
//	var yewuPosUrl = "http://localhost:8988/dicDataInfo"; //业务posurl
	var cookies = decodeURI(document.cookie);
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
	var getCookie = function(cookies, name) {
		var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
		if(arr = cookies.match(reg))
			return decodeURI(arr[2]);
		else
			return null;
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
	//	var bus_n = getCookie(cookies, 'bus_userNames');
	//	bus_n = bus_n == null ? "" : bus_n;
	//	var mer_n = getCookie(cookies, 'userName');
	//	mer_n = mer_n == null ? "" :encodeURI(mer_n) ;
	//	var age_n = getCookie(cookies, 'age_userNames');
	//	age_n = age_n == null ? "" : age_n;
	//	var names = '{"bus_n":"' + bus_n + '","mer_n":"' + mer_n + '","age_userName":"' + age_n + '"}';
	//	dataValueHelper.configOption = {
	//		key: GetPath(),
	//		userName:names
	//	};
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

	/*
	 * 功能：新增码表主表
	 */
	dataValueHelper.insertDictionaryInfo = function(jsonParam, callback) {
		if(typeof callback === 'function') {
			dataValueHelper.axjsonpPostMvc(serverUrl + "/insertDictionaryInfo", jsonParam, callback);
		}
	};

	/*
	 * 功能：修改码表主表
	 */
	dataValueHelper.updateDictionaryInfo = function(jsonParam, callback) {
		if(typeof callback === 'function') {
			dataValueHelper.axjsonpPostMvc(serverUrl + "/updateDictionaryInfo", jsonParam, callback);
		}
	};

	/*
	 * 功能：获取码表主表列表
	 */
	dataValueHelper.getDictionaryInfoList = function(jsonParam, callback) {
		if(typeof callback === 'function') {
			dataValueHelper.axjsonpPostMvc(serverUrl + "/getDictionaryInfoList", jsonParam, callback);
		}
	};

	/*
	 * 功能：根据id获取码表主表信息
	 */
	dataValueHelper.getDictionaryInfoByid = function(jsonParam, callback) {
		if(typeof callback === 'function') {
			dataValueHelper.axjsonpPostMvc(serverUrl + "/getDictionaryInfoByid", jsonParam, callback);
		}
	};

	/*
	 * 功能：根据id获取码表子表信息
	 */
	dataValueHelper.getDictionaryDataInfoByid = function(jsonParam, callback) {
		if(typeof callback === 'function') {
			dataValueHelper.axjsonpPostMvc(serverUrl + "/getDictionaryDataInfoByid", jsonParam, callback);
		}
	};
	/*
	 * 功能：新增码表子表信息
	 */
	dataValueHelper.insertDictionaryDataInfo = function(jsonParam, callback) {
		if(typeof callback === 'function') {
			dataValueHelper.axjsonpPostMvc(serverUrl + "/insertDictionaryDataInfo", jsonParam, callback);
		}
	};

	/*
	 * 功能：修改码表子表信息
	 */
	dataValueHelper.updateDictionaryDataInfo = function(jsonParam, callback) {
		if(typeof callback === 'function') {
			dataValueHelper.axjsonpPostMvc(serverUrl + "/updateDictionaryDataInfo", jsonParam, callback);
		}
	};

	/*
	 * 功能：获取码表子表列表
	 */
	dataValueHelper.getDictionaryDataInfoList = function(jsonParam, callback) {
		if(typeof callback === 'function') {
			dataValueHelper.axjsonpPostMvc(serverUrl + "/getDictionaryDataInfoList", jsonParam, callback);
		}
	};

	dataValueHelper.axjsonpPostMvc = function(url, data, successfn, config, key) {

		data = (data == null || data == "" || typeof(data) == "undefined") ? {
			"date": new Date().getTime()
		} : data;
		$.ajax({
			type: "POST",
			url: url,
			data: JSON.stringify(data),
			//			xhrFields: {
			//				withCredentials: true
			//			},
			headers: {
				'Content-Type': 'application/json'
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

	window.dataValueHelper = dataValueHelper;

})(window.dataValueHelper || {});