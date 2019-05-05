var CurrPage = 1;
var PageSize = 10;
var totalPage; //总页数
var isCreatePage = false;
var divisionList = new Array();

$(document).ready(function() {
	//查询操作事件
	$("#query").click(function() {
		isCreatePage = false;
		getClassInfoList('1');
	});
	//添加用户操作事件
	$("#UserAdd").click(function() {
		location.href = 'insertClass.html';
	});
	//获取班级划分
	dataValueHelper.GetDictionaryDataList("classDivision", "", "", '', callback_getclassDivision);

});
/*
 * 功能：获取班级划分会滴
 * 创建人：liql
 * 创建时间：2018-12-4
 */
function callback_getclassDivision(data) {
	console.log(data);
	if(data == undefined || data.rspCode != "000" || data.rspCode == null) {
		console.log(data.rspDesc);
		controlsHelper.alert(data.rspDesc);
	} else {
		divisionList = data.lists;
	}
	//获取老师  角色为2
	getUserInfoList();
}
/*
 * 功能：获取用户列表
 * 创建人：Liql
 * 创建时间：2018-09-10
 */
function getUserInfoList() {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	var jsonstr = dataHelper.setJson(null, "curragePage", "1"); //当前页码
	jsonstr = dataHelper.setJson(jsonstr, "userName", ""); //用户名称
	jsonstr = dataHelper.setJson(jsonstr, "userPhone", ""); //用户手机号
	jsonstr = dataHelper.setJson(jsonstr, "userRole", "2"); //用户角色ID
	jsonstr = dataHelper.setJson(jsonstr, "pageSize", "99999999"); //每页显示记录数
	jsonParam.jsonStr = jsonstr;
	console.log(jsonParam);
	userInfoServer.getUserInfoList(jsonParam, callback_getUserInfoList);
};
/**
 * 功能：获取用户列表回调
 * 创建人：Liql
 * 创建时间：2018-09-10
 * @param {Object} data
 */
function callback_getUserInfoList(data) {
	console.log(data);
	$("#userList").html('');
	if(data == undefined || data.rspCode != "000" || data.rspCode == null) {
		console.log(data.rspDesc);
		controlsHelper.alert(data.rspDesc);
	} else {
		$("#classTeacher").empty();
		$(".classTeacher").html("全部");
		$(".classTeacher").attr("data-value", "");
		$("#classTeacher").append("<li value=''><a>全部</a></li>");
		$.each(data.lists, function(index, entry) {
			$("#classTeacher").append("<li value=" + entry.userId + "><a>" + entry.userName + "</a></li>");
		});
	}
	isCreatePage = false;
	getClassInfoList('1');
};
/*
 * 功能：获取班级列表
 * 创建人：Liql
 * 创建时间：2018-09-10
 */
function getClassInfoList(CurrPage) {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	var jsonstr = dataHelper.setJson(null, "curragePage", CurrPage.toString()); //当前页码
	jsonstr = dataHelper.setJson(jsonstr, "className", $("#className").val()); //班级名称
	jsonstr = dataHelper.setJson(jsonstr, "classSchool", $("#classSchool").val()); //学校名称
	jsonstr = dataHelper.setJson(jsonstr, "classTeacher", $(".classTeacher").attr('data-value') == undefined || $(".classTeacher").attr('data-value') == null ? "" : $(".classTeacher").attr('data-value')); //老师
	jsonstr = dataHelper.setJson(jsonstr, "pageSize", PageSize.toString()); //每页显示记录数
	jsonParam.jsonStr = jsonstr;
	console.log(jsonParam);
	classInfoServer.getClassInfoList(jsonParam, callback_getClassInfoList);
};
/**
 * 功能：获取班级列表回调
 * 创建人：Liql
 * 创建时间：2018-09-10
 * @param {Object} data
 */
function callback_getClassInfoList(data) {
	console.log(data);
	$("#classList").html('');
	if(data == undefined || data.rspCode != "000" || data.rspCode == null) {
		console.log(data.rspDesc);
		controlsHelper.alert(data.rspDesc);
	} else {
		var template = $("#classListTemplate").html();
		Mustache.parse(template);
		var listT = new Array();
		$.each(data.lists, function(index, entry) {
			var value = JSON.stringify(entry);
			value = dataHelper.setJson(value, "classLevelName", entry.classLevel == "1" ? "初级" : entry.classLevel == "2" ? "中级" : entry.classLevel == "3" ? "高级" : "无");
			value = dataHelper.setJson(value, "classDivisionName", getDivisionName(entry.classDivision));
			//			value = dataHelper.setJson(value, "userRoleName", getRoleName(entry.userRole));
			value = dataHelper.setJson(value, "statusName", entry.status == "1" ? "启用" : "禁用");
			listT.push(jQuery.parseJSON(value));
		});
		data.lists = listT;
		var rendered = Mustache.render(template, data);
		$("#classList").append(rendered);

		$("#infoTatal").html(data.total);
		$(".updateBtn").click(function() {
			location.href = 'updateClass.html?classId=' + $(this).attr('data-id');
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
					getClassInfoList(CurrPage);
				}
			});
		}

	}
};

function getDivisionName(division) {
	var name = "";
	$.each(divisionList, function(index, entry) {
		if(entry.data_code == division) {
			name = entry.data_name;
		}
	});
	return name;
}