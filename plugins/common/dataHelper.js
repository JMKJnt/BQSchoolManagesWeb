(function(dataHelper) {
	/*
	 * 根据分割符取键对应值
	 */
	dataHelper.QueryParamer = function(value, strPath, splitStr) {
		var searchStr = strPath; // location.search; //由于searchStr属性值包括参数 splitStr，所以除去该字符 
		searchStr = searchStr.substr(1); //将searchStr字符串分割成数组，数组中的每一个元素为一个参数和参数值 
		var searchs = searchStr.split(splitStr); //获得第一个参数和值 
		for(var item in searchs) {
			var parms = searchs[item].split("=");
			if(parms[0] == val) {
				return parms[1];
			}
		}
		return "";
	};
	/*
	 * 从地址中获取键对应值
	 */
	dataHelper.QueryString = function(val) {
		var searchStr = location.search; //由于searchStr属性值包括“?”，所以除去该字符 
		searchStr = searchStr.substr(1); //将searchStr字符串分割成数组，数组中的每一个元素为一个参数和参数值 
		var searchs = searchStr.split("&"); //获得第一个参数和值 
		for(var item in searchs) {
			var parms = searchs[item].split("=");
			if(parms[0] == val) {
				return parms[1];
			}
		}
		return "";
	};
	dataHelper.isEmpty = function(str) {
		var isEmpty = false;
		if(str == undefined || str == null || str == "") {
			return true;
		}
		return isEmpty;

	};
	/*在光标处插入字符串
	 * obj 文本框对象
	 * str 要插入的值
	 */
	dataHelper.insertText = function(obj, str) {
		if(document.selection) {
			var sel = document.selection.createRange();
			sel.text = str;
		} else if(typeof obj.selectionStart === 'number' && typeof obj.selectionEnd === 'number') {
			var startPos = obj.selectionStart,
				endPos = obj.selectionEnd,
				cursorPos = startPos,
				tmpStr = obj.value;
			obj.value = tmpStr.substring(0, startPos) + str + tmpStr.substring(endPos, tmpStr.length);
			cursorPos += str.length;
			obj.selectionStart = obj.selectionEnd = cursorPos;
		} else {
			obj.value += str;
		}
	};
	/*
	 * 添加或者修改json数据
	 */
	dataHelper.setJson = function(jsonStr, name, value) {
		if(!jsonStr) jsonStr = "{}";
		var jsonObj = JSON.parse(jsonStr);
		jsonObj[name] = value;
		return JSON.stringify(jsonObj);
	};
	/*
	 * 删除json数据
	 */
	dataHelper.deleteJson = function(jsonStr, name) {
		if(!jsonStr) return null;
		var jsonObj = JSON.parse(jsonStr);
		delete jsonObj[name];
		return JSON.stringify(jsonObj);
	};
	/*
	 * JSON集合排序(降序)
	 */
	dataHelper.sortDownJson = function(json, key) {
		for(var i = 0; i < json.length; i++) {
			for(var j = 0; j < json.length - 1; j++) {
				if(json[j][key] < json[j + 1][key]) {
					var temp = json[j];
					json[j] = json[j + 1];
					json[j + 1] = temp;
				};
			};
		};
		return json;
	};
	/*
	 * JSON集合排序(升序)
	 */
	dataHelper.sortUpJson = function(json, key) {
		for(var i = 0; i < json.length; i++) {
			for(var j = 0; j < json.length - 1; j++) {
				if(json[j][key] > json[j + 1][key]) {
					var temp = json[j];
					json[j] = json[j + 1];
					json[j + 1] = temp;
				};
			};
		};
		return json;
	};
	/*
	 * 功能：随机生成数字
	 * 创建人：Liql
	 */
	dataHelper.fRandomBy = function(under, over) {
		switch(arguments.length) {
			case 1:
				return parseInt(Math.random() * under + 1);
			case 2:
				return parseInt(Math.random() * (over - under + 1) + under);
			default:
				return 0;
		}
	};
	/*
	 * 功能；随机生成位数字
	 * 创建人：liql
	 * 参数（随机位数，返回类型）
	 */
	dataHelper.fRandomNumber = function(bits, type) {
		var arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
		var timestamp = new Date().getTime();
		var num = (Math.random() * timestamp.toString().substr(6, 7)).toString().replace('.', '') + timestamp.toString().substr(6, 7);
		switch(type) {
			case 'int':
				if(bits < 14) {
					var random = parseInt(Math.random() * 9);
					return parseInt(num.substr(random, bits));
				} else if(bits <= 32) {
					var random = (Math.random() * parseInt(num.substr(parseInt(Math.random() * 9), 15))).toString().replace('.', '');
					random = (random + num + random).substr(parseInt(Math.random() * 9), bits);
					return parseInt(random);
				}
				break;
			case 'string':
				var str = '';
				for(var i = 0; i < bits; i++) {
					pos = Math.round(Math.random() * (arr.length - 1));
					str += arr[pos];
				}
				return str;
				break;
		}

	};
	/*
	 * 功能：替换星期
	 * 创建人：liql
	 * 创建时间：2016-5-20
	 */
	dataHelper.replaceWeek = function(week) {
		var result = '';
		switch(week) {
			case 1:
				return '星期日';
			case 2:
				return '星期一';
			case 3:
				return '星期二';
			case 4:
				return '星期三';
			case 5:
				return '星期四';
			case 6:
				return '星期五';
			case 7:
				return '星期六';
			default:
				break;
		}
		return result;
	};
	//float转换
	dataHelper.toFloat = function(str) {
		var result;
		if(str != undefined && str != null && str != '') {
			var vals = parseFloat(str) * 1000000000000;
			result = vals / 1000000000000;
		} else {
			result = 0;
		}
		return result;
	};
	//分转元
	dataHelper.minuteToYuan = function(price) {
		var result;
		if(price != undefined && price != null && price != '') {
			var vals = parseFloat(price) * 1000000000000;
			result = vals / 10000000000;
		} else {
			result = 0;
		}
		return result;
	};

	window.dataHelper = dataHelper; //给全局变量赋值初始化

})(window.dataHelper || {});