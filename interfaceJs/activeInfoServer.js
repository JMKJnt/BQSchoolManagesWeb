(function(activeInfoServer) {
	//获取用户信息
//	var quanxianAgent = "http://192.168.16.47:8080/activeInfo";
		var quanxianAgent = "http://www.ruischool.com/activeInfo";
	//	var quanxianAgent = "http://localhost:8988/activeInfo";
	var serverUrl = quanxianAgent; //baseDataUrl;
	var cookies = decodeURI(document.cookie);

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
			if(js[i - 1].src.indexOf("activeInfoServer.js") > -1) {
				jsPath = QueryString('secret', js[i - 1].src);
			}
		}
		return jsPath;
	};
	//	var bus_n = getCookie(cookies, 'bus_userNames');
	//	bus_n = bus_n == null ? "" : bus_n;
	//	var mer_n = getCookie(cookies, 'userName');
	//	mer_n = mer_n == null ? "" : encodeURI(mer_n);
	//	var age_n = getCookie(cookies, 'age_userNames');
	//	age_n = age_n == null ? "" : age_n;
	//	var names = '{"bus_n":"' + bus_n + '","mer_n":"' + mer_n + '","age_userName":"' + age_n + '"}';
	//	activeInfoServer.configOption = {
	//		key: GetPath(),
	//		userName: names
	//	};

	/*
	 * 功能：新增活动
	 */
	activeInfoServer.insertActive = function(jsonParam, callback) {
		if(typeof callback === 'function') {
			activeInfoServer.axjsonpPostMvc(serverUrl + "/insertActive", jsonParam, callback);
		}
	};
	/*
	 * 功能：修改活动
	 */
	activeInfoServer.updateActive = function(jsonParam, callback) {
		if(typeof callback === 'function') {
			activeInfoServer.axjsonpPostMvc(serverUrl + "/updateActive", jsonParam, callback);
		}
	};
	/*
	 * 功能：根据id获取活动信息
	 */
	activeInfoServer.getActiveInfoById = function(jsonParam, callback) {
		if(typeof callback === 'function') {
			activeInfoServer.axjsonpPostMvc(serverUrl + "/getActiveInfoById", jsonParam, callback);
		}
	};
	/*
	 * 功能：获取活动列表
	 */
	activeInfoServer.getActiveInfoList = function(jsonParam, callback) {
		if(typeof callback === 'function') {
			activeInfoServer.axjsonpPostMvc(serverUrl + "/getActiveInfoList", jsonParam, callback);
		}
	};
	/*
	 * 功能：获取活动报名信息
	 */
	activeInfoServer.getActiveRegisterInfo = function(jsonParam, callback) {
		if(typeof callback === 'function') {
			activeInfoServer.axjsonpPostMvc(serverUrl + "/getActiveRegisterInfo", jsonParam, callback);
		}
	};
	/*
	 * 功能：获取活动报名列表
	 */
	activeInfoServer.getActiveRegisterList = function(jsonParam, callback) {
		if(typeof callback === 'function') {
			activeInfoServer.axjsonpPostMvc(serverUrl + "/getActiveRegisterList", jsonParam, callback);
		}
	};

	/*
	 * 功能：活动审核状态修改
	 */
	activeInfoServer.updateActiveStatus = function(jsonParam, callback) {
		if(typeof callback === 'function') {
			activeInfoServer.axjsonpPostMvc(serverUrl + "/updateActiveStatus", jsonParam, callback);
		}
	};

	/*
	 * 功能：活动审核状态修改
	 */
	activeInfoServer.updateDetail = function(jsonParam, callback) {
		if(typeof callback === 'function') {
			activeInfoServer.axjsonpPostMvc(serverUrl + "/updateDetail", jsonParam, callback);
		}
	};

	/*
	 * 功能：活动审核状态修改
	 */
	activeInfoServer.getDetailInfoById = function(jsonParam, callback) {
		if(typeof callback === 'function') {
			activeInfoServer.axjsonpPostMvc(serverUrl + "/getDetailInfoById", jsonParam, callback);
		}
	};
	/*
	 * 功能：活动审核状态修改
	 */
	activeInfoServer.getDetailInfoList = function(jsonParam, callback) {
		if(typeof callback === 'function') {
			activeInfoServer.axjsonpPostMvc(serverUrl + "/getDetailInfoList", jsonParam, callback);
		}
	};

	/*
	 * 功能：活动审核状态修改
	 */
	activeInfoServer.insertDetail = function(jsonParam, callback) {
		if(typeof callback === 'function') {
			activeInfoServer.axjsonpPostMvc(serverUrl + "/insertDetail", jsonParam, callback);
		}
	};
	/*
	 * 功能：活动审核状态修改
	 */
	activeInfoServer.updateRegisterStatus = function(jsonParam, callback) {
		if(typeof callback === 'function') {
			activeInfoServer.axjsonpPostMvc(serverUrl + "/updateRegisterStatus", jsonParam, callback);
		}
	};

	activeInfoServer.axjsonpPostMvc = function(url, data, successfn, config, key) {
		/*console.log(dataValueHelper.configOption.key);*/
		console.log(document.domain);
		data = (data == null || data == "" || typeof(data) == "undefined") ? {
			"date": new Date().getTime()
		} : data;
		$.ajax({
			type: "POST",
			url: url,
			data: JSON.stringify(data),
			dataType: "json",
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

	window.activeInfoServer = activeInfoServer;
})(window.activeInfoServer || {});