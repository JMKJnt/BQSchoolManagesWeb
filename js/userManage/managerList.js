var CurrPage = 1;
var PageSize = 10;
var totalPage; //总页数
var isCreatePage = false;

$(document).ready(function() {
	//查询操作事件
	$("#query").click(function() {
		isCreatePage = false;
		getManageList('1');
	});
	//添加用户操作事件
	$("#UserAdd").click(function() {
		location.href = 'insertManager.html';
	});

	isCreatePage = false;
	getManageList('1');
});

/*
 * 功能：获取用户列表
 * 创建人：Liql
 * 创建时间：2018-09-10
 */
function getManageList(CurrPage) {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	var jsonstr = dataHelper.setJson(null, "curragePage", CurrPage.toString()); //当前页码
	jsonstr = dataHelper.setJson(jsonstr, "manageName", $("#manageName").val()); //用户名称
	jsonstr = dataHelper.setJson(jsonstr, "manageUserName", $("#manageUserName").val()); //用户用户名
	jsonstr = dataHelper.setJson(jsonstr, "managePhone", $("#managePhone").val()); //用户手机号
	jsonstr = dataHelper.setJson(jsonstr, "pageSize", PageSize.toString()); //每页显示记录数
	jsonParam.jsonStr = jsonstr;
	console.log(jsonParam);
	userInfoServer.getManageList(jsonParam, callback_getManageList);
};
/**
 * 功能：获取用户列表回调
 * 创建人：Liql
 * 创建时间：2018-09-10
 * @param {Object} data
 */
function callback_getManageList(data) {
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
//			value = dataHelper.setJson(value, "userRoleName", getRoleName(entry.userRole));
			value = dataHelper.setJson(value, "statusName", entry.status == "1" ? "启用" : "禁用");
			listT.push(jQuery.parseJSON(value));
		});
		data.lists = listT;
		var rendered = Mustache.render(template, data);
		$("#userList").append(rendered);

		$("#infoTatal").html(data.total);
		$(".updateBtn").click(function() {
			location.href = 'updateManager.html?managerId=' + $(this).attr('data-id');
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
					getManageList(CurrPage);
				}
			});
		}

	}

};
