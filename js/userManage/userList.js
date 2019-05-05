var CurrPage = 1;
var PageSize = 10;
var totalPage; //总页数
var userId; //用户id
var isCreatePage = false;
var roleList = new Array(); //用户角色列表

$(document).ready(function() {

	//获取角色列表 码表
	dataValueHelper.GetDictionaryDataList("roleType", "#roleType", ".roleType", '选择角色', callback_getroleType);

	//查询操作事件
	$("#query").click(function() {
		isCreatePage = false;
		getUserInfoList('1');
	});
	//添加用户操作事件
	$("#UserAdd").click(function() {
		location.href = 'insertUser.html';
	});

	isCreatePage = false;
	getUserInfoList('1');
});
/*
 * 功能：获取角色类型回调
 * 创建人liql
 * 创建时间：2018-12-1
 */
function callback_getroleType(data) {
	console.log(data);
	if(data == undefined || data.rspCode != "000" || data.rspCode == null) {
		controlsHelper.alert(data.rspDesc);
	} else {
		roleList = data.lists;
		$("#roleType").append("<li value='' ><a>全部</a></li>");
		$.each(data.lists, function(index, entry) {
			$("#roleType").append("<li value=" + entry.data_code + "><a>" + entry.data_name + "</a></li>");
		});
		$("#roleType").find('li').click(function() {
			$(".roleType").attr('data-value', $(this).attr('value'));
			$(".roleType").html($(this).find('a').html());
		});
	}
}
/*
 * 功能：获取用户列表
 * 创建人：Liql
 * 创建时间：2018-09-10
 */
function getUserInfoList(CurrPage) {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	var jsonstr = dataHelper.setJson(null, "curragePage", CurrPage.toString()); //当前页码
	jsonstr = dataHelper.setJson(jsonstr, "userName", $("#userName").val()); //用户名称
	jsonstr = dataHelper.setJson(jsonstr, "userPhone", $("#userPhone").val()); //用户手机号
	jsonstr = dataHelper.setJson(jsonstr, "userRole", $(".roleType").attr('data-value')); //用户角色ID
	jsonstr = dataHelper.setJson(jsonstr, "pageSize", PageSize.toString()); //每页显示记录数
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
		var template = $("#userListTemplate").html();
		Mustache.parse(template);
		var listT = new Array();
		$.each(data.lists, function(index, entry) {
			var value = JSON.stringify(entry);
			var roleName = getRoleName(entry.userRole);
			value = dataHelper.setJson(value, "userRoleName", roleName);
			value = dataHelper.setJson(value, "statusName", entry.status == "1" ? "启用" : "禁用");
			value = dataHelper.setJson(value, "countActive", dataHelper.isEmpty(entry.countActive) ? "0" : entry.countActive);
			listT.push(jQuery.parseJSON(value));
		});
		data.lists = listT;
		var rendered = Mustache.render(template, data);
		$("#userList").append(rendered);

		$("#infoTatal").html(data.total);
		$(".updateBtn").click(function() {
			location.href = 'updateUser.html?userId=' + $(this).attr('data-id');
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
					getUserInfoList(CurrPage);
				}
			});
		}

	}

};
/*
 * 功能：根据code获取角色名称
 */
function getRoleName(code) {
	var name = "";
	var codeList = new Array();
	if(code.indexOf(",") >= 0) {
		codeList = code.split(",");
	} else {
		codeList = [code];
	}
	$.each(codeList, function(index, entry) {
		var data = roleList.find(o => o.data_code == entry);
		if(data != undefined && data != null) {
			name += data.data_name + ",";
		}
	});
	return name.length > 0 ? name.substr(0, (name.length - 1)) : name;
}