var CurrPage = 1;
var PageSize = 10;
var totalPage; //总页数
var isCreatePage = false;

$(document).ready(function() {
	//查询操作事件
	$("#query").click(function() {
		isCreatePage = false;
		getSchoolList('1');
	});
	//添加学校操作事件
	$("#UserAdd").click(function() {
		location.href = 'insertSchools.html';
	});

});
/*
 * 功能：获取学校列表
 * 创建人：Liql
 * 创建时间：2018-09-10
 */
function getSchoolList(CurrPage) {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	var jsonstr = dataHelper.setJson(null, "curragePage", CurrPage.toString()); //当前页码
	jsonstr = dataHelper.setJson(jsonstr, "schoolName", $("#schoolName").val()); //班级名称
	jsonstr = dataHelper.setJson(jsonstr, "schoolProvince", $(".province").attr('data-value') == undefined ? '' : $(".province").attr('data-value')); //省id
	jsonstr = dataHelper.setJson(jsonstr, "schoolCity", $(".city").attr('data-value') == undefined ? '' : $(".city").attr('data-value')); //市id
	jsonstr = dataHelper.setJson(jsonstr, "schoolCounty", $(".county").attr('data-value') == undefined ? '' : $(".county").attr('data-value')); //县id
	jsonstr = dataHelper.setJson(jsonstr, "status", ""); //老师
	jsonstr = dataHelper.setJson(jsonstr, "pageSize", PageSize.toString()); //每页显示记录数
	jsonParam.jsonStr = jsonstr;
	console.log(jsonParam);
	classInfoServer.getSchoolList(jsonParam, callback_getSchoolList);
};
/**
 * 功能：获取学校列表回调
 * 创建人：Liql
 * 创建时间：2018-09-10
 * @param {Object} data
 */
function callback_getSchoolList(data) {
	console.log(data);
	$("#schoolList").html('');
	if(data == undefined || data.rspCode != "000" || data.rspCode == null) {
		console.log(data.rspDesc);
		controlsHelper.alert(data.rspDesc);
	} else {
		var template = $("#schoolListTemplate").html();
		Mustache.parse(template);
		var listT = new Array();
		$.each(data.lists, function(index, entry) {
			var value = JSON.stringify(entry);
			value = dataHelper.setJson(value, "schoolProvinceName", regionHelper.getNameById(entry.schoolProvince, 1));
			value = dataHelper.setJson(value, "schoolCityName", regionHelper.getNameById(entry.schoolCity, 2));
			value = dataHelper.setJson(value, "schoolCountyName", regionHelper.getNameById(entry.schoolCounty, 3));
			value = dataHelper.setJson(value, "statusName", entry.status == "1" ? "启用" : "禁用");
			value = dataHelper.setJson(value, "schoolTypeName", entry.schoolType == "1" ? "城市" : entry.schoolType == "2" ? "农村" : "无");
			console.log(value);
			listT.push(jQuery.parseJSON(value));
		});
		data.lists = listT;
		var rendered = Mustache.render(template, data);
		$("#schoolList").append(rendered);

		$("#infoTatal").html(data.total);
		$(".updateBtn").click(function() {
			location.href = 'updateSchool.html?schoolId=' + $(this).attr('data-id');
		});
		$(".total").text(data.total);
		if(!isCreatePage) {
			isCreatePage = true;
			$('.pagination').jqPagination({
				link_string: 'page={page_number}',
				max_page: Math.ceil(data.total / PageSize),
				paged: function(page) {
					console.log("第" + page + "页");
					CurrPage = page;
					//增加一页调用刷新一次
					getSchoolList(CurrPage);
				}
			});
		}

	}
};