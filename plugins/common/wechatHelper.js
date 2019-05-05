(function(wechatHelper) {
	var wechatUrl = "http://118.144.88.26:80/changeFunction";
	//微信注册菜单项
	//	wechatHelper.jsApiList = [];
	//	//微信隐藏菜单项
	//	wechatHelper.hideMenuList = [];
	//	//分享参数变量
	//	wechatHelper.shareAppDataList = {};
	//	//隐藏菜单参数变量
	//	wechatHelper.hideMenuDataList = {};
	/*分享参数
	 *参数(debug,主题，说明，分享链接，分享图片链接)
	 */
	wechatHelper.shareAppData = function(debug, title, desc, shareLink, shareImgUrl) {
		return {
			debug: false,
			title: title,
			desc: desc,
			link: shareLink,
			imgUrl: shareImgUrl,
			success: function() {
				controlsHelper.alert('分享成功');
			},
			cancel: function() {
				// 用户取消分享后执行的回调函数
			}
		};
	};
	/*功能：批量隐藏菜单栏选项
	 * 参数（隐藏list,成功提示语）
	 */
	wechatHelper.hideMenuItemsData = function(menuList, successTips) {
		return {
			menuList: menuList,
			success: function(res) {
				controlsHelper.alert(successTips);
			},
			fail: function(res) {
				controlsHelper.alert(JSON.stringify(res));
			}
		};
	};
	/* 功能：注册微信调用接口列表
	 * 参数（appid,回调函数）
	 */
	wechatHelper.Get_WinXinCfg = function(Appid, callback) { //添加json数据 
		var myjsonStr = {};
		var configUrl = wechatUrl + "/getSignPackage?appid=" + Appid
		if(typeof callback === 'function') {
			wechatHelper.axjsonp(configUrl, myjsonStr, callback);
		}
	};
	/*
	 * 功能：注册事件
	 * 参数（配置参数，debug）
	 */
	wechatHelper.wxConfig = function(config, wechatConfig) {
		config.debug = false; //调试模式
		if(wechatConfig != null && wechatConfig != undefined) {
			config.hideMenuList = wechatConfig.hideMenuList; //需要隐藏的菜单
		}
		wx.config(config);
		wx.ready(function() {
			//分享接口调用
			if(wechatConfig != null && wechatConfig != undefined) {
				wx.onMenuShareTimeline(wechatConfig.shareAppDataList);
				wx.onMenuShareAppMessage(wechatConfig.shareAppDataList);
				wx.onMenuShareQQ(wechatConfig.shareAppDataList);
				wx.onMenuShareWeibo(wechatConfig.shareAppDataList);
				wx.onMenuShareQZone(wechatConfig.shareAppDataList);
				//批量隐藏菜单选项
				if($.inArray("hideMenuItems", config.jsApiList) >= 0) {
					wx.hideOptionMenu(wechatConfig.hideMenuList);
				}
			}
			//隐藏右上角菜单
			if($.inArray("hideOptionMenu", config.jsApiList) >= 0) {
				wx.hideOptionMenu();
			}

			//关闭当前窗口
			//			wx.closeWindow();
			//隐藏所有非基本菜单项
			if($.inArray("hideAllNonBaseMenuItem", config.jsApiList) >= 0) {
				wx.hideAllNonBaseMenuItem({
					success: function() {
						controlsHelper.alert('已隐藏所有非基本菜单项');
					}
				});
			}

		});
		wx.error(function(res) { //通过error接口处理失败验证
			controlsHelper.alert(res.errMsg);
		});
	};
	/*
	 *功能：获取微信用户信息
	 * 参数（微信服务url,微信商户appid,微信生成code,用户公众号openid,回调函数名称）
	 */
	wechatHelper.GetWechatUserInfo = function(appid, code, openid, callback) {
		var url = wechatUrl + "/getUserInfo";
		var jsonParam = {
			"jsonStr": ""
		};
		var jsonstr = dataHelper.setJson(null, "app_id", appid);
		jsonstr = dataHelper.setJson(jsonstr, "code", code);
		jsonstr = dataHelper.setJson(jsonstr, "openid", openid);
		jsonParam.jsonStr = jsonstr;
		console.log(jsonstr);

		if(typeof callback === 'function') {
			wechatHelper.axjsonp(url, jsonParam, callback);
		}
	};
	/*
	 * 功能：微信订单支付
	 * 参数（微信后台服务url,微信appid,订单ID，用户微信公众号openid,订单价格，产品名称,回调函数）
	 */
	wechatHelper.wechatOrdePay = function(wechatAppid, orderid, wechatOpenid, price, productName, callback) {
		var pay_send_data = {
			"app_id": wechatAppid,
			"total_fee": (parseFloat(price) * 100).toString(),
			"body": productName,
			"out_trade_no": orderid,
			"openid": wechatOpenid
		};
		var apiUrl = wechatUrl + "/weixinForPay?jsonStr=" + JSON.stringify(pay_send_data);
		if(typeof callback === 'function') {
			wechatHelper.axjsonp(url, jsonParam, callback);
		}
	};

	/**
	 * ajax封装
	 * Jsonp格式，用于跨域调用
	 * url 发送请求的地址
	 * data 发送到服务器的数据，数组存储，如：{"date": new Date().getTime(), "state": 1}
	 * successfn 成功回调函数
	 */
	wechatHelper.axjsonp = function(url, data, successfn, config) {
		data = (data == null || data == "" || typeof(data) == "undefined") ? {
			"date": new Date().getTime()
		} : data;
		$.ajax({

			//提交数据的类型 POST GET
			type: "POST",
			//async:false,  
			//提交的网址
			url: url,
			//提交的数据
			data: data,
			//返回数据的格式
			dataType: "jsonp", //"xml", "html", "script", "json", "jsonp", "text".
			jsonp: "callbackparam", //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
			jsonpCallback: "success_jsonpCallback", //自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名
			//在请求之前调用的函数
			beforeSend: function() {
				//				$("#btn_loading").css('display', '');
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
				//				$("#btn_loading").css('display', 'none');
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

	window.wechatHelper = wechatHelper;
})(window.wechatHelper || {});