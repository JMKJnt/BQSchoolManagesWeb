(function(controlsHelper) {

	var $body = $('body');
	/*
	 * 功能：手机弹出框
	 */
	controlsHelper.alert = function(message, widthSize) {
		var $alert = $('#lh-alert');
		if(!$alert.length) {
			$alert = $('<div id="lh-alert" class="alert"><p></p></div>').css({
				'top': '30%',
				//				'width': '60%',
				'width': widthSize,
				'left': '50%',
				'z-index': '9999',
				'color': '#fff',
				'background-color': 'rgba(0, 0, 0, 0.75)',
				'-webkit-transform': 'translate(-50%, -50%)',
				'-moz-transform': 'translate(-50%,-50%)',
				'-ms-transform': 'translate(-50%,-50%)',
				'transform': 'translate(-50%, -50%)',
				'-webkit-border-radius': '10px',
				'-moz-border-radius': '10px',
				'-ms-border-radius': '10px',
				'border-radius': '10px',
				'position': 'fixed'
			});
			$alert.hide();
			$alert.on('tap', function() {
				$alert.hide();
			});
			$body.append($alert);
		};
		clearTimeout($alert.data('timer'));
		$alert.find('p').css({
			"text-align": "center",
			'font-size': '16px',
			'padding': '20px'
		});
		$alert.find('p').text(message);
		$alert.show();

		$alert.data('timer', setTimeout(function() {
			$alert.animate({
				opacity: 0
			}, 300, function() {
				$alert.css({
					opacity: '1',
					display: 'none'
				});
			});
		}, 1500));

	};
	//显示图表鼠标移上提示
	controlsHelper.showTooltip = function(x, y, contents) {
		$('<div id="Tooltip">' + contents + '</div>').css({
			position: 'absolute',
			display: 'none',
			padding: '8px 8px',
			'border-radius': '2px',
			'background-color': '#f0ae7e',
			color: 'white',
			'font-size': '12px',
			top: y - 35,
			left: x - 25
		}).appendTo("body").fadeIn(200);
	};
	/*
	 * 功能：下拉框（单个） 针对ul li标签
	 * 参数（默认文本，数据list,ul标签，展示btn标签）
	 */
	controlsHelper.downBoxUlLi = function(defaultText, dataList, elements, elementsBtn) {
		$(elements).empty();
		if(defaultText != undefined && defaultText != null && defaultText != '') {
			$(elementsBtn).html(defaultText);
			$(elements).append("<li value=''><a>" + defaultText + "</a></li>");
		}
		$.each(dataList, function(index, entry) {
			$(elements).append("<li value=" + entry.value + "><a>" + entry.name + "</a></li>");
		});

		//li改变事件
		$(elements).find('li').click(function() {
			$(elementsBtn).attr('data-value', $(this).attr('value'));
			$(elementsBtn).html($(this).find('a').html());
		});
	};
	/*
	 * 功能：下拉框（单个） 针对ul li标签
	 * 参数（默认文本，数据list,ul标签，展示btn标签）
	 */
	controlsHelper.downBoxUlLiFilter = function(defaultText, dataList, elements, elementsSpan) {
		$(elements).empty();
		if(defaultText != undefined && defaultText != null && defaultText != '') {
			$(elements).append('<li class="filter-item items" data-filter="' + defaultText + '" data-value="">' + defaultText + "</li>");
		}
		$.each(dataList, function(index, entry) {
			$(elements).append('<li class="filter-item items" data-filter="' + entry.name + '" data-value="' + entry.value + '">' + entry.name + '</li>');
		});

		//li改变事件
		$(elements).find('li').click(function() {
			$(elementsSpan).attr('data-value', $(this).attr('data-value'));
		});
	};
	/*
	 * 功能：下拉框（联动） 针对ul li标签
	 * 参数（默认文本，数据list,子级ul标签，父级ul标签，子级展示btn标签，父级展示btn标签,子级默认文本）
	 */
	controlsHelper.downBoxLinkageUlLi = function(defaultText, dataList, elementsC, elementsP, elementsCBtn, elementsPBtn, defaultTextC) {
		$(elementsC).empty();
		$(elementsP).empty();
		if(defaultText != undefined && defaultText != null && defaultText != '') {
			$(elementsC).append("<li value='' parentValue=''><a>" + defaultText + "</a></li>");
			$(elementsP).append("<li value=''><a>" + defaultText + "</a></li>");
			$(elementsCBtn).html(defaultText);
			$(elementsPBtn).html(defaultText);
		}
		if(defaultTextC != undefined && defaultTextC != null && defaultTextC != '') {
			$(elementsC).append("<li value='' parentValue=''><a>" + defaultTextC + "</a></li>");
			$(elementsCBtn).html(defaultText);
		}
		//处理数据
		var parentList = new Array();
		var childList = new Array();
		if(dataList.length > 0) {
			$.each(dataList, function(index, entry) {
				var values = dataHelper.setJson(null, 'value', entry.value);
				values = dataHelper.setJson(values, 'name', entry.name);
				if(entry.parentValue != '' && entry.parentValue != undefined && entry.parentValue != null) {
					values = dataHelper.setJson(values, 'parentValue', entry.parentValue);
					childList.push(jQuery.parseJSON(values));
				} else {
					parentList.push(jQuery.parseJSON(values));
				}
			});
		}

		//下拉框绑定
		$.each(parentList, function(index, entry) {
			$(elementsP).append("<li value=" + entry.value + "><a>" + entry.name + "</a></li>");
		});
		//父级选择事件
		$(elementsP).find('li').click(function() {
			$(elementsPBtn).attr('data-value', $(this).attr('value'));
			$(elementsCBtn).attr('data-value', '');
			$(elementsCBtn).html(defaultText);
			$(elementsC).empty();

			if(defaultText != undefined && defaultText != null && defaultText != '') {
				$(elementsC).append("<li value='' parentValue=''><a>" + defaultText + "</a></li>");
				$(elementsCBtn).html(defaultText);
			}
			if(defaultTextC != undefined && defaultTextC != null && defaultTextC != '') {
				$(elementsC).append("<li value='' parentValue=''><a>" + defaultText + "</a></li>");
				$(elementsCBtn).html(defaultText);
			}
			var values = $(this).attr('value');
			$.each(childList, function(index, entry) {
				if(values == entry.parentValue) {
					$(elementsC).append("<li value=" + entry.value + " parentValue=" + entry.parentValue + "><a>" + entry.name + "</a></li>");
				}
			});
			//子级选择事件
			$(elementsC).find('li').click(function() {
				$(elementsCBtn).attr('data-value', $(this).attr('value'));
			});
		});

	};
	/*
	 * 功能：微信类目
	 * 参数（子级select标签，父级select标签）
	 */
	controlsHelper.wechatCategoryUl = function(elementsC, elementsP, elementsCBtn, elementsPBtn) {
		$(elementsP).empty();
		$(elementsC).append("<li value='0' parentValue='0'><a>请选择子类目</a></li>");
		var dataParent = [
			["请选择主类目"],
			["美食"],
			["基础设施"],
			["医疗保健"],
			["生活服务"],
			["休闲娱乐"],
			["购物"],
			["运动健身"],
			["汽车"],
			["酒店宾馆"],
			["旅游景点"],
			["文化场馆"],
			["教育学校"],
			["银行金融"],
			["地名地址"],
			["房产小区"],
			["丽人"],
			["结婚"],
			["亲子"],
			["公司企业"],
			["机构团体"]
		];
		var subCategory = [
			["请选择子类目"],
			["江浙菜", "粤菜", "川菜", "湘菜", "东北菜", "徽菜", "闽菜", "鲁菜", "台湾菜", "西北菜", "东南亚菜", "西餐", "日韩菜", "火锅", "清真菜", "小吃快餐", "海鲜", "烧烤", "自助餐", "面包甜点", "茶餐厅", "咖啡厅", "其它美食"],
			["交通设施", "公共设施", "道路附属", "其它基础设施"],
			["专科医院", "综合医院", "诊所", "急救中心", "药房药店", "疾病预防", "其它医疗保健"],
			["家政", "宠物服务", "旅行社", "摄影冲印", "洗衣店", "票务代售", "邮局速递", "通讯服务", "彩票", "报刊亭", "自来水营业厅", "电力营业厅", "教练", "生活服务场所", "信息咨询中心", "招聘求职", "中介机构", "事务所", "丧葬", "废品收购站", "福利院养老院", "测字风水", "家装", "其它生活服务"],
			["洗浴推拿足疗", "KTV", "酒吧", "咖啡厅", "茶馆", "电影院", "棋牌游戏", "夜总会", "剧场音乐厅", "度假疗养", "户外活动", "网吧", "迪厅", "演出票务", "其它娱乐休闲"],
			["综合商场", "便利店", "超市", "花鸟鱼虫", "家具家居建材", "体育户外", "服饰鞋包", "图书音像", "眼镜店", "母婴儿童", "珠宝饰品", "化妆品", "食品烟酒", "数码家电", "农贸市场", "小商品市场", "旧货市场", "商业步行街", "礼品", "摄影器材", "钟表店", "拍卖典当行", "古玩字画", "自行车专卖", "文化用品", "药店", "品牌折扣店", "其它购物"],
			["健身中心", "游泳馆", "瑜伽", "羽毛球馆", "乒乓球馆", "篮球场", "足球场", "壁球场", "马场", "高尔夫场", "保龄球馆", "溜冰", "跆拳道", "海滨浴场", "网球场", "橄榄球", "台球馆", "滑雪", "舞蹈", "攀岩馆", "射箭馆", "综合体育场馆", "其它运动健身"],
			["加油站", "停车场", "4S 店", "汽车维修", "驾校", "汽车租赁", "汽车配件销售", "汽车保险", "摩托车", "汽车养护", "洗车场", "汽车俱乐部", "汽车救援", "二手车交易市场", "车辆管理机构", "其它汽车"],
			["星级酒店", "经济型酒店", "公寓式酒店", "度假村", "农家院", "青年旅社", "酒店宾馆", "旅馆招待所", "其它酒店宾馆"],
			["公园", "其它旅游景点", "风景名胜", "植物园", "动物园", "水族馆", "城市广场", "世界遗产", "国家级景点", "省级景点", "纪念馆", "寺庙道观", "教堂", "海滩"],
			["博物馆", "图书馆", "美术馆", "展览馆", "科技馆", "天文馆", "档案馆", "文化宫", "会展中心", "其它文化场馆"],
			["小学", "幼儿园", "其它教育学校", "培训", "大学", "中学", "职业技术学校", "成人教育"],
			["银行", "自动提款机", "保险公司", "证券公司", "财务公司", "其它银行金融"],
			["交通地名", "地名地址信息", "道路名", "自然地名", "行政地名", "门牌信息", "其它地名地址"],
			["住宅区", "产业园区", "商务楼宇", "它房产小区"],
			["美发", "美容", "SPA", "瘦身纤体", "美甲", "写真", "其它"],
			["婚纱摄影", "婚宴", "婚戒首饰", "婚纱礼服", "婚庆公司", "彩妆造型", "司仪主持", "婚礼跟拍", "婚车租赁", "婚礼小商品", "婚房装修", "其它"],
			["亲子摄影", "亲子游乐", "亲子购物", "孕产护理"],
			["农林牧渔基地", "企业/工厂", "其它公司企业"],
			["公检法机构", "外国机构", "工商税务机构", "政府机关", "民主党派", "社会团体", "传媒机构", "文艺团体", "科研机构", "其它机构团体"]
		];
		for(var i = 0; i < dataParent.length; i++) {
			$(elementsP).append("<li value=" + i + "><a>" + dataParent[i] + "</a></li>");
		};
		//父级选择事件
		$(elementsP).find('li').click(function() {
			$(elementsPBtn).attr('data-value', $(this).attr('value'));
			$(elementsC).empty();
			$(elementsCBtn).html('请选择子类目');
			$(elementsCBtn).attr('data-value', '');
			var i = $(this).val();
			for(var j = 0; j < subCategory[i].length; j++) {
				$(elementsC).append("<li value=" + j + " parentValue=" + i + "><a>" + subCategory[i][j] + "</a></li>");
			}
			//子级选择事件
			$(elementsC).find('li').click(function() {
				$(elementsCBtn).attr('data-value', $(this).attr('value'));
			});
		});

	};
	/*
	 * 功能：下拉框（单个）(默认显示文本，数据集合(name,value)，选择框标签（select）)select标签
	 */
	controlsHelper.downBoxSelect = function(defaultText, dataList, elements, elementsInput) {
		$(elements).empty();
		$(elements).append("<option data-value=''>" + defaultText + "</option>");
		$.each(dataList, function(index, entry) {
			$(elements).append("<option data-value=" + entry.value + ">" + entry.name + "</option>");
		});
		//option改变事件
		$(elements).change(function() {
			$(elementsInput).val($(elements).find("option:selected").attr('data-value'));
			$(elementsInput).attr('data-value', $(elements).find("option:selected").attr('data-value'));
			console.log($(elements).find("option:selected").text());
		});
	};
	/*
	 * 功能：下拉框（联动两级）select标签
	 * 参数(默认显示文本，数据集合(name,value,parentVlaue(可为空))，选择框标签子集（select），选择框标签父级)
	 */
	controlsHelper.downBoxLinkageSelect = function(defaultText, dataList, elementsC, elementsP) {
		$(elementsC).empty();
		$(elementsP).empty();
		$(elementsC).append("<option value='' parentValue=''>" + defaultText + "</option>");
		$(elementsP).append("<option value=''>" + defaultText + "</option>");
		//处理数据
		var parentList = new Array();
		var childList = new Array();
		if(dataList.length > 0) {
			$.each(dataList, function(index, entry) {
				var values = dataHelper.setJson(null, 'value', entry.value);
				values = dataHelper.setJson(values, 'name', entry.name);
				if(entry.parentValue != '' && entry.parentValue != undefined && entry.parentValue != null) {
					values = dataHelper.setJson(values, 'parentValue', entry.parentValue);
					childList.push(jQuery.parseJSON(values));
				} else {
					parentList.push(jQuery.parseJSON(values));
				}
			});
		}
		//下拉框绑定
		$.each(parentList, function(index, entry) {
			$(elementsP).append("<option value=" + entry.value + ">" + entry.name + "</option>");
		});
		//父级事件
		$(elementsP).change(function() {
			$(elementsC).empty();
			$(elementsC).append("<option value='' parentValue=''>" + defaultText + "</option>");
			var values = $(this).attr('value');
			$.each(childList, function(index, entry) {
				if(values == entry.parentValue) {
					$(elementsC).append("<option value=" + entry.value + " parentValue=" + entry.parentValue + ">" + entry.name + "</option>");
				}
			}); //子级改变事件
			$(elementsC).change(function() {
				console.log($(elementsC).find("option:selected").text());
			});
		});

	};
	/*
	 * 功能：微信类目
	 * 参数（子级select标签，父级select标签）
	 */
	controlsHelper.wechatCategory = function(elementsC, elementsP) {
		$(elementsP).empty();
		$(elementsC).append("<option value='0' parentValue='0'>请选择子类目</option>");
		var dataParent = [
			["请选择主类目"],
			["美食"],
			["基础设施"],
			["医疗保健"],
			["生活服务"],
			["休闲娱乐"],
			["购物"],
			["运动健身"],
			["汽车"],
			["酒店宾馆"],
			["旅游景点"],
			["文化场馆"],
			["教育学校"],
			["银行金融"],
			["地名地址"],
			["房产小区"],
			["丽人"],
			["结婚"],
			["亲子"],
			["公司企业"],
			["机构团体"]
		];
		var subCategory = [
			["请选择子类目"],
			["江浙菜", "粤菜", "川菜", "湘菜", "东北菜", "徽菜", "闽菜", "鲁菜", "台湾菜", "西北菜", "东南亚菜", "西餐", "日韩菜", "火锅", "清真菜", "小吃快餐", "海鲜", "烧烤", "自助餐", "面包甜点", "茶餐厅", "咖啡厅", "其它美食"],
			["交通设施", "公共设施", "道路附属", "其它基础设施"],
			["专科医院", "综合医院", "诊所", "急救中心", "药房药店", "疾病预防", "其它医疗保健"],
			["家政", "宠物服务", "旅行社", "摄影冲印", "洗衣店", "票务代售", "邮局速递", "通讯服务", "彩票", "报刊亭", "自来水营业厅", "电力营业厅", "教练", "生活服务场所", "信息咨询中心", "招聘求职", "中介机构", "事务所", "丧葬", "废品收购站", "福利院养老院", "测字风水", "家装", "其它生活服务"],
			["洗浴推拿足疗", "KTV", "酒吧", "咖啡厅", "茶馆", "电影院", "棋牌游戏", "夜总会", "剧场音乐厅", "度假疗养", "户外活动", "网吧", "迪厅", "演出票务", "其它娱乐休闲"],
			["综合商场", "便利店", "超市", "花鸟鱼虫", "家具家居建材", "体育户外", "服饰鞋包", "图书音像", "眼镜店", "母婴儿童", "珠宝饰品", "化妆品", "食品烟酒", "数码家电", "农贸市场", "小商品市场", "旧货市场", "商业步行街", "礼品", "摄影器材", "钟表店", "拍卖典当行", "古玩字画", "自行车专卖", "文化用品", "药店", "品牌折扣店", "其它购物"],
			["健身中心", "游泳馆", "瑜伽", "羽毛球馆", "乒乓球馆", "篮球场", "足球场", "壁球场", "马场", "高尔夫场", "保龄球馆", "溜冰", "跆拳道", "海滨浴场", "网球场", "橄榄球", "台球馆", "滑雪", "舞蹈", "攀岩馆", "射箭馆", "综合体育场馆", "其它运动健身"],
			["加油站", "停车场", "4S 店", "汽车维修", "驾校", "汽车租赁", "汽车配件销售", "汽车保险", "摩托车", "汽车养护", "洗车场", "汽车俱乐部", "汽车救援", "二手车交易市场", "车辆管理机构", "其它汽车"],
			["星级酒店", "经济型酒店", "公寓式酒店", "度假村", "农家院", "青年旅社", "酒店宾馆", "旅馆招待所", "其它酒店宾馆"],
			["公园", "其它旅游景点", "风景名胜", "植物园", "动物园", "水族馆", "城市广场", "世界遗产", "国家级景点", "省级景点", "纪念馆", "寺庙道观", "教堂", "海滩"],
			["博物馆", "图书馆", "美术馆", "展览馆", "科技馆", "天文馆", "档案馆", "文化宫", "会展中心", "其它文化场馆"],
			["小学", "幼儿园", "其它教育学校", "培训", "大学", "中学", "职业技术学校", "成人教育"],
			["银行", "自动提款机", "保险公司", "证券公司", "财务公司", "其它银行金融"],
			["交通地名", "地名地址信息", "道路名", "自然地名", "行政地名", "门牌信息", "其它地名地址"],
			["住宅区", "产业园区", "商务楼宇", "它房产小区"],
			["美发", "美容", "SPA", "瘦身纤体", "美甲", "写真", "其它"],
			["婚纱摄影", "婚宴", "婚戒首饰", "婚纱礼服", "婚庆公司", "彩妆造型", "司仪主持", "婚礼跟拍", "婚车租赁", "婚礼小商品", "婚房装修", "其它"],
			["亲子摄影", "亲子游乐", "亲子购物", "孕产护理"],
			["农林牧渔基地", "企业/工厂", "其它公司企业"],
			["公检法机构", "外国机构", "工商税务机构", "政府机关", "民主党派", "社会团体", "传媒机构", "文艺团体", "科研机构", "其它机构团体"]
		];
		for(var i = 0; i < dataParent.length; i++) {
			$(elementsP).append("<option value=" + i + ">" + dataParent[i] + "</option>");
		};
		$(elementsP).change(function() {
			$(elementsC).empty();
			var i = $(this).val();
			for(var j = 0; j < subCategory[i].length; j++) {
				$(elementsC).append("<option value=" + j + " parentValue=" + i + ">" + subCategory[i][j] + "</option>");
			}
			//子级选择框选择事件
			$(elementsC).change(function() {

			});
		});
	};
	/*
	 * 功能：上传文件插件
	 * 参数（上传文件服务地址，上传操作标签，文件展示标签,文件验证正则，文件验证正则验证错误提示语,显示为文件名的标签,显示图片）
	 */
	controlsHelper.FileUploadControl = function(fileUploadUrl, elementUpload, elementFileView, acceptFileTypes, typeErrorTip, elementView, elementImgView) {
		'use strict';
		var strUri = window.location.href.toString();
		if(strUri.indexOf("#") > 0) {
			strUri = strUri.substring(0, strUri.indexOf("#"));
		}
		strUri = strUri.replace(/\/[^\/]*$/, '').replace(/\/[^\/]*$/, '');
		// Change this to the location of your server-side upload handler:
		var url = fileUploadUrl + '?redirect=' + strUri.replace(/\/[^\/]*$/, '/uploadresult.html');
		//"http://192.168.16.98:8020/CouponsManagement/html/uploadresult.html";//
		$(elementUpload).fileupload({
				add: function(e, data) {
					$(this).parent().parent().parent().find('.progress').addClass('.active');
					$(this).parent().parent().parent().find('.progress .progress-bar').css('width', '10%');
					if(elementView != undefined && elementView != null && elementView != '') {
						$(elementView).text(data.originalFiles[0].name);
					}
					var uploadErrors = [];

					var filesType = data.originalFiles[0]['type'] == '' ? data.originalFiles[0].name : data.originalFiles[0]['type'];
					var filesName = data.originalFiles[0].name == '' ? data.originalFiles[0]['type'] : data.originalFiles[0].name;
					//						var acceptFileTypes = /^image\/(jpe?g|png)$/i;
					//  /^application\/(x-pkcs12)$/i
					if(filesType == "" || (filesType.length && !acceptFileTypes.test(filesType))) {
						//							uploadErrors.push('上传的文件类型不符合要求，请上传jpg，jpeg，png类型的文件');
						if(filesType == "" || (filesType.length && !acceptFileTypes.test(filesName))) {
							uploadErrors.push(typeErrorTip);
						}
					}
					if(data.originalFiles[0].size > 1000000) {
						uploadErrors.push('文件尺寸过大，限制文件大小1M');
					}
					if(uploadErrors.length > 0) {
						alert(uploadErrors.join("\n"));
					} else {
						data.submit();
					}
				},
				forceIframeTransport: true,
				url: url,
				dataType: 'json',
				done: function(e, data) {
					var imgIndex = parseInt($(this).attr("data-index"));
					console.log(data);
					$.each(data.result.files, function(index, file) {
						$(elementFileView).eq(imgIndex).attr('data-filepath', file.name);
						if($(elementFileView).eq(imgIndex)[0].nodeName == 'INPUT') {
							$(elementFileView).eq(imgIndex).val(file.name);
						}
						$(elementFileView).eq(imgIndex).attr('src', file.url);
						if(elementImgView != undefined && elementImgView != null && elementImgView != '') {
							$(elementImgView).eq(imgIndex).attr('data-filepath', file.name);
							$(elementImgView).eq(imgIndex).attr('src', file.url);
						}
					});
					$(this).parent().parent().parent().find('.progress').removeClass('.active');
					$(this).parent().parent().parent().find('.progress .progress-bar').css('width', '100%');
				}
			}).prop('disabled', !$.support.fileInput)
			.parent().addClass($.support.fileInput ? undefined : 'disabled');

	};
	/*
	 * 功能：上传文件插件
	 * 参数（上传文件服务地址，上传操作标签，文件展示标签,文件验证正则，文件验证正则验证错误提示语,显示为文件名的标签,显示图片）
	 */
	controlsHelper.FileUploadControlZfb = function(fileUploadUrl, elementUpload, elementFileView, acceptFileTypes, typeErrorTip, elementView, elementImgView, success) {
		'use strict';
		var strUri = window.location.href.toString();
		if(strUri.indexOf("#") > 0) {
			strUri = strUri.substring(0, strUri.indexOf("#"));
		}
		strUri = strUri.replace(/\/[^\/]*$/, '').replace(/\/[^\/]*$/, '');
		// Change this to the location of your server-side upload handler:
		var url = fileUploadUrl + '?redirect=' + strUri.replace(/\/[^\/]*$/, '/uploadresult.html');
		//"http://192.168.16.98:8020/CouponsManagement/html/uploadresult.html";//
		$(elementUpload).fileupload({
				add: function(e, data) {
					$(this).parent().parent().parent().find('.progress').addClass('.active');
					$(this).parent().parent().parent().find('.progress .progress-bar').css('width', '10%');
					if(elementView != undefined && elementView != null && elementView != '') {
						$(elementView).text(data.originalFiles[0].name);
					}
					var uploadErrors = [];

					var filesType = data.originalFiles[0]['type'] == '' ? data.originalFiles[0].name : data.originalFiles[0]['type'];
					var filesName = data.originalFiles[0].name == '' ? data.originalFiles[0]['type'] : data.originalFiles[0].name;
					//						var acceptFileTypes = /^image\/(jpe?g|png)$/i;
					//  /^application\/(x-pkcs12)$/i
					if(filesType == "" || (filesType.length && !acceptFileTypes.test(filesType))) {
						//							uploadErrors.push('上传的文件类型不符合要求，请上传jpg，jpeg，png类型的文件');
						if(filesType == "" || (filesType.length && !acceptFileTypes.test(filesName))) {
							uploadErrors.push(typeErrorTip);
						}
					}
					if(data.originalFiles[0].size > 1000000) {
						uploadErrors.push('文件尺寸过大，限制文件大小1M');
					}
					if(uploadErrors.length > 0) {
						alert(uploadErrors.join("\n"));
					} else {
						data.submit();
					}
				},
				forceIframeTransport: true,
				url: url,
				dataType: 'json',
				done: function(e, data) {
					var imgIndex = parseInt($(this).attr("data-index"));
					console.log(data);
					$.each(data.result.files, function(index, file) {
						$(elementFileView).eq(imgIndex).attr('data-filepath', file.name);
						if($(elementFileView).eq(imgIndex)[0].nodeName == 'INPUT') {
							$(elementFileView).eq(imgIndex).val(file.name);
						}
						$(elementFileView).eq(imgIndex).attr('src', file.url);
						if(elementImgView != undefined && elementImgView != null && elementImgView != '') {
							$(elementImgView).eq(imgIndex).attr('data-filepath', file.name);
							$(elementImgView).eq(imgIndex).attr('src', file.url);
						}
						//上传图片后上传支付宝
						if(typeof success === 'function') {
							success(file.url, $(elementImgView).eq(imgIndex));
						}
					});
					$(this).parent().parent().parent().find('.progress').removeClass('.active');
					$(this).parent().parent().parent().find('.progress .progress-bar').css('width', '100%');

				}
			}).prop('disabled', !$.support.fileInput)
			.parent().addClass($.support.fileInput ? undefined : 'disabled');

	};
	/*
	 * 功能：给列表设置序号
	 * 参数（table对象，每页记录数，当前页）
	 */
	controlsHelper.setSequenceToList = function(elements, pageSize, current) {
		var currentCount = parseInt(pageSize) * (parseInt(current) - 1);
//		console.log(currentCount);
		currentCount = currentCount == 0 ? 1 : currentCount+1;
		for(var i = 0; i < pageSize; i++) {
			$(elements).find('tr:eq(' + i + ') td:first').text(currentCount + i);
		}
	};
	/*
	 * 功能：文件图片转base64
	 * 参数（图片dom,选择文件dom对象）
	 */
	controlsHelper.readAsDataURLBase64 = function(result, file) {
		//检验是否为图像文件  
		var base64Str = '';
		var isImage = false;
		if(/image\/\w+/.test(file.type)) {
			isImage = true;
		}
		var reader = new FileReader();
		//将文件以Data URL形式读入页面  
		reader.readAsDataURL(file);
		reader.onload = function(e) {
			//显示文件  
			console.log(result);
			if(isImage) {
				result.src = this.result;
			}
			base64Str = this.result;
		}
		return base64Str;
	};

	window.controlsHelper = controlsHelper;
})(window.controlsHelper || {});