(function(echartHelper) {

	/*
	 * 功能：柱状图形
	 * 参数（dom对象ID名，主题，表头显示(array)，x轴数据(array)，图形数据（array））
	 */
	echartHelper.barEchart = function(domId, title, legend, dataxAixis, seriesData) {
		var myChart = echarts.init(document.getElementById(domId));
		var option = {
			title: {
				text: title
			},
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: 'shadow'
				}
				//				,
				//				formatter: function(params) {
				//					var tar = params[0];
				//					console.log(params);
				//					return tar.name + '<br/>' + tar.seriesName + ":" + tar.value;
				//				}
			},
			legend: {
				data: legend
			},
			xAxis: {
				data: dataxAixis
			},
			yAxis: {},
			series: seriesData
		};
		myChart.setOption(option);
	};

	/*
	 * 功能：饼状图形
	 * 参数（dom对象ID名，主题，表头显示（array），图形提示,图形数据（array））
	 */
	echartHelper.pieEchart = function(domId, title, legend, seriesName, seriesData) {
		var myChart = echarts.init(document.getElementById(domId));
		var option = {
			title: {
				text: title,
				x: 'center'
			},
			tooltip: {
				trigger: 'item',
				formatter: function(params) {
					var tar = params;
					return tar.seriesName + '<br/>' + tar.name + ":" + tar.value + " (" + tar.percent + "%)";
				}
			},
			legend: {
				orient: 'vertical',
				left: 'left',
				data: legend
			},
			series: [{
				name: seriesName,
				type: 'pie',
				radius: '55%',
				center: ['50%', '60%'],
				data: seriesData,
				itemStyle: {
					emphasis: {
						shadowBlur: 10,
						shadowOffsetX: 0,
						shadowColor: 'rgba(0, 0, 0, 0.5)'
					}
				}
			}]
		};
		myChart.setOption(option);
	};

	/*
	 * 功能：堆叠区域图形
	 * 参数（dom对象Id名，主题，表头显示（array）,x轴数据(array)，图形数据（array））
	 */
	echartHelper.lineEchart = function(domId, title, legend, dataxAixis,seriesData) {
		var myChart = echarts.init(document.getElementById(domId));
		var option = {
			title: {
				text: title
			},
			tooltip: {
				trigger: 'axis'
			},
			legend: {
				data: legend
			},
			toolbox: {},
			grid: {
				left: '3%',
				right: '4%',
				bottom: '3%',
				containLabel: true
			},
			xAxis: [{
				type: 'category',
				boundaryGap: false,
				data: dataxAixis
			}],
			yAxis: [{
				type: 'value'
			}],
			series: seriesData
		};

		myChart.setOption(option);
	};

	window.echartHelper = echartHelper;
})(window.echartHelper || {});