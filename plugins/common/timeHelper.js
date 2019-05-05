(function(timeHelper) {
	// 功能：时间处理函数
	timeHelper.addDate = function(date, days) {
		var str = date.toString().replace("-", "/").replace("-", "/"); //字符分割

		var d = new Date(str);

		d.setDate(d.getDate() + days);
		var month = d.getMonth() + 1;
		var day = d.getDate();
		if(month < 10) {
			month = "0" + month;
		}
		if(day < 10) {
			day = "0" + day;
		}

		var val = d.getFullYear().toString() + "-" + month.toString() + "-" + day.toString();
		return val;
	};
	/*
	 * 两个时间差倒计时(倒计时标签，计时器ID，日期，时间)
	 */
	timeHelper.DateTimeCountdown = function(elements, timeInt, willDate, willTime) {
		//	    console.log(element);
		timeInt = setInterval(function() {
			//step1：获得当前时间
			var now = new Date();
			//step2：设定目标时间target：2016/06/11 00:00
			//时间字段要取后台传的最新的
			//			var target = new Date("2016/06/11 20:00");
			var target = new Date(willDate + " " + willTime);
			//step3：
			var ms = target - now;

			if(ms >= 0) {

				var days = Math.floor(ms / 1000 / 3600 / 24);
				//				console.log(days);
				//step4：计算还差多少小时
				var h = Math.floor((ms - days * 1000 * 3600 * 24) / 1000 / 60 / 60);
				//step5：计算还差多少分钟：m,如果<10,不成2位
				var m = Math.floor((ms - days * 1000 * 3600 * 24) / 1000 / 60 - h * 60);
				//step6：计算还差多少秒：s,如果<10,不成2位
				var s = Math.floor((ms - days * 1000 * 3600 * 24) / 1000 - (h * 60 + m) * 60);
				//step7：找countDown元素
				m = m < 10 ? "0" + m : m;
				s = s < 10 ? "0" + s : s;
				//				var secondFootball = document.getElementById("secondFootball");
				if(days < 1) {
					elements.innerHTML = h + "时" + " " + m + "分" + " " + s + "秒";
				} else {
					elements.innerHTML = days + "天" + " " + h + "时" + " " + m + "分" + " " + s + "秒";
				};
			} else {
				clearInterval(timeInt);
			};
		}, 500);
	};
	/*
	 * 时间处理，单秒前边加0处理
	 */
	timeHelper.PlusToDub = function(n) {
		if(n < 10) {
			return "0" + n
		} else {
			return n
		}
	};
	/*@时间插件
	 * 使用方法：
	 * useDRPicker('插件显示在此元素','需要更改的文本','最小可选日期');
	 * 2015/9
	 * @chi.yong
	 * */
	timeHelper.useDRPicker = function(element, changeText, minDate) { //'#customer','.data_time'
		$(element).daterangepicker({
			//startDate: moment().startOf('day'),
			//endDate: moment(),
			//minDate: '01/01/2012',	
			minDate: minDate, //最小时间
			maxDate: moment(), //最大时间
			dateLimit: {
				days: 30
			}, //起止时间的最大间隔
			showDropdowns: true,
			showWeekNumbers: false, //是否显示第几周
			timePicker: false, //是否显示小时和分钟
			timePickerIncrement: 60, //时间的增量，单位为分钟
			timePicker12Hour: false, //是否使用12小时制来显示时间
			opens: 'right', //日期选择框的弹出位置
			buttonClasses: ['btn btn-default'],
			applyClass: 'btn-small btn-primary blue',
			cancelClass: 'btn-small',
			format: 'YYYY-MM-DD', //控件中from和to 显示的日期格式(YYYY-MM-DD HH:mm:ss)
			separator: ' to ',
			locale: {
				applyLabel: '确定',
				cancelLabel: '取消',
				fromLabel: '起始时间',
				toLabel: '结束时间',
				customRangeLabel: '自定义',
				daysOfWeek: ['日', '一', '二', '三', '四', '五', '六'],
				monthNames: ['一月', '二月', '三月', '四月', '五月', '六月',
					'七月', '八月', '九月', '十月', '十一月', '十二月'
				],
				firstDay: 1
			}
		}, function(start, end, label) { //格式化日期显示框
			if(!start._isValid) {
				$(element).val(startDateTemp.format('YYYY-MM-DD'));
			} else {
				$(element).val(start.format('YYYY-MM-DD'));
			}
			if(changeText) {
				$(changeText).text(start.format('YYYY-MM-DD') + ' 至 ' + end.format('YYYY-MM-DD'));
			} else {
				return;
			}
		}).click(function() {
			$(document).keydown(function(e) {
				if(e.keyCode == 17 || e.keyCode == 18) {
					return false;
				}
			});
		});

	};
	/*使用方法：
	 * singleDatePickers('插件显示在此元素','最小可选日期');
	 *
	 */
	timeHelper.singleDatePickers = function(element, minDates) {
		$(element).daterangepicker({
			singleDatePicker: true,
			minDate: minDates
		}, function(start, end, label) { //格式化日期显示框
			if(!start._isValid) {
				$(element).val(startDateTemp.format('YYYY-MM-DD'));
			} else {
				$(element).val(start.format('YYYY-MM-DD'));
			}
		}).click(function() {
			$(document).keydown(function(e) {
				if(e.keyCode == 17 || e.keyCode == 18) {
					return false;
				}
			});
		});
	};

	/*
	 * 功能：对比日期大小(开始时间,结束时间)
	 */
	timeHelper.checkEndDate = function(startDate, endDate) {
		var start = new Date(startDate.replace("-", "/").replace("-", "/"));
		var end = new Date(endDate.replace("-", "/").replace("-", "/"));
		if(end < start) {
			return false;
		}
		return true;
	};
	/*
	 * 功能：n秒倒计时(倒计时标签，秒数，倒计时之前提示语，倒计时后提示语)
	 */
	timeHelper.secondTimeCountdown = function(viewElement, waitTime, beforeTips, afterTips) {
		if(waitTime == 0) {
			$(viewElement).removeAttr('disabled');
			$(viewElement).html(beforeTips);
		} else {
			$(viewElement).attr('disabled', 'disabled');
			$(viewElement).html(afterTips + '(' + waitTime + 's)');
			waitTime--;
			setTimeout(function() {
				timeHelper.secondTimeCountdown(viewElement, waitTime, beforeTips, afterTips);
			}, 1000);
		}
	};

	//日期格式化
	//使用方法
	/*
	//var now = new Date(); 
	//var nowStr = now.format("yyyy-MM-dd hh:mm:ss"); 
	////使用方法2: 
	//var testDate = new Date(); 
	//var testStr = testDate.format("YYYY年MM月dd日hh小时mm分ss秒"); 
	//alert(testStr); 
	////示例： 
	//alert(new Date().Format("yyyy年MM月dd日")); 
	//alert(new Date().Format("MM/dd/yyyy")); 
	//alert(new Date().Format("yyyyMMdd")); 
	//alert(new Date().Format("yyyy-MM-dd hh:mm:ss"));
	*/
	Date.prototype.format = function(format) {
		var o = {
			"M+": this.getMonth() + 1, //month 
			"d+": this.getDate(), //day 
			"h+": this.getHours(), //hour 
			"m+": this.getMinutes(), //minute 
			"s+": this.getSeconds(), //second 
			"q+": Math.floor((this.getMonth() + 3) / 3), //quarter 
			"S": this.getMilliseconds() //millisecond 
		}

		if(/(y+)/.test(format)) {
			format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
		}

		for(var k in o) {
			if(new RegExp("(" + k + ")").test(format)) {
				format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
			}
		}
		return format;
	};
	/**       
	 * 对Date的扩展，将 Date 转化为指定格式的String
	 * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q) 可以用 1-2 个占位符
	 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
	 * eg:
	 * (new Date()).pattern("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
	 * (new Date()).pattern("yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04
	 * (new Date()).pattern("yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04
	 * (new Date()).pattern("yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04
	 * (new Date()).pattern("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18
	 */
	Date.prototype.pattern = function(fmt) {
		var o = {
			"M+": this.getMonth() + 1, //月份           
			"d+": this.getDate(), //日           
			"h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时           
			"H+": this.getHours(), //小时           
			"m+": this.getMinutes(), //分           
			"s+": this.getSeconds(), //秒           
			"q+": Math.floor((this.getMonth() + 3) / 3), //季度           
			"S": this.getMilliseconds() //毫秒           
		};
		var week = {
			"0": "/u65e5",
			"1": "/u4e00",
			"2": "/u4e8c",
			"3": "/u4e09",
			"4": "/u56db",
			"5": "/u4e94",
			"6": "/u516d"
		};
		if(/(y+)/.test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
		}
		if(/(E+)/.test(fmt)) {
			fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f" : "/u5468") : "") + week[this.getDay() + ""]);
		}
		for(var k in o) {
			if(new RegExp("(" + k + ")").test(fmt)) {
				fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
			}
		}
		return fmt;
	};

	window.timeHelper = timeHelper;
})(window.timeHelper || {});