var CurrPage = 1;
var PageSize = 10;
var totalPage; //总页数
var userId; //用户id
var isCreatePage = false;
var cateList = new Array(); //用户角色列表

$(document).ready(function() {

	//查询操作事件
	$("#query").click(function() {
		isCreatePage = false;
		getFamilyList('1');
	});
	//添加用户操作事件
	$("#familyAdd").click(function() {
		location.href = 'insertFamily.html';
	});
	getUserInfoList();
});
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
	jsonstr = dataHelper.setJson(jsonstr, "userName", ''); //用户名称
	jsonstr = dataHelper.setJson(jsonstr, "userPhone", ''); //用户手机号
	jsonstr = dataHelper.setJson(jsonstr, "userRole", '3'); //用户角色ID
	jsonstr = dataHelper.setJson(jsonstr, "pageSize", '9999999'); //每页显示记录数
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
	if(data == undefined || data.rspCode != "000" || data.rspCode == null) {
		console.log(data.rspDesc);
		controlsHelper.alert(data.rspDesc);
	} else {
		$("#familyUserId").empty();
		$("#familyUserId").append("<li data-value=''><a>全部</a></li>");
		$.each(data.lists, function(index, entry) {
			$("#familyUserId").append("<li data-value='" + entry.userId + "'><a>" + entry.userName + "（" + entry.nickName + "） </a>　</li>");
		});
		//li改变事件
		$("#familyUserId").find('li').click(function() {
			$(".familyUserId").attr('data-value', $(this).attr('data-value'));
			$(".familyUserId").html($(this).find('a').text().trim());
		});
	}
	dataValueHelper.GetDictionaryDataList("familyCate", "", "", '', callback_getfamilyCate);
};
/*
 * 功能：获取家庭关系
 * 创建人：liql
 * 创建时间：2019-04-02
 */
function callback_getfamilyCate(data) {
	console.log(data);
	if(data == undefined || data.rspCode != "000" || data.rspCode == null) {
		console.log(data.rspDesc);
		controlsHelper.alert(data.rspDesc);
	} else {
		cateList = data.lists;
	}
}
/*
 * 功能：获取用户列表
 * 创建人：Liql
 * 创建时间：2018-09-10
 */
function getFamilyList(CurrPage) {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	var jsonstr = dataHelper.setJson(null, "curragePage", CurrPage.toString()); //当前页码
	jsonstr = dataHelper.setJson(jsonstr, "familyName", $("#familyName").val()); //用户名称
	jsonstr = dataHelper.setJson(jsonstr, "familyPhone", $("#familyPhone").val()); //用户手机号
	jsonstr = dataHelper.setJson(jsonstr, "familyUserId", $(".familyUserId").attr('data-value')); //用户角色ID
	jsonstr = dataHelper.setJson(jsonstr, "pageSize", PageSize.toString()); //每页显示记录数
	jsonParam.jsonStr = jsonstr;
	console.log(jsonParam);
	userInfoServer.getFamilyList(jsonParam, callback_getFamilyList);
};
/**
 * 功能：获取用户列表回调
 * 创建人：Liql
 * 创建时间：2018-09-10
 * @param {Object} data
 */
function callback_getFamilyList(data) {
	console.log(data);
	$("#familyList").html('');
	if(data == undefined || data.rspCode != "000" || data.rspCode == null) {
		console.log(data.rspDesc);
		controlsHelper.alert(data.rspDesc);
	} else {
		var template = $("#familyListTemplate").html();
		Mustache.parse(template);
		var listT = new Array();
		$.each(data.lists, function(index, entry) {
			var value = JSON.stringify(entry);
			var familyCateName = getDataName(entry.familyCate);
			value = dataHelper.setJson(value, "familyCateName", familyCateName);
			value = dataHelper.setJson(value, "statusName", entry.status == "1" ? "启用" : "禁用");
			listT.push(jQuery.parseJSON(value));
		});
		data.lists = listT;
		var rendered = Mustache.render(template, data);
		$("#familyList").append(rendered);

		$("#infoTatal").html(data.total);
		$(".updateBtn").click(function() {
			location.href = 'updateFamily.html?familyId=' + $(this).attr('data-id');
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
					getFamilyList(CurrPage);
				}
			});
		}

	}

};
/*
 * 功能：根据code获取角色名称
 */
function getDataName(code) {
	var name = "";
	$.each(cateList, function(index, entry) {
		if(entry.data_code==code) {
			name = entry.data_name;
		}
	});
	return name;
}