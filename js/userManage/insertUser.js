/**
 * 页面加载
 * 创建人:liql
 * 创建时间：2018-9-10
 */
$(document).ready(function() {
	//获取角色下拉框数据  码表
	dataValueHelper.GetDictionaryDataList("roleType", "", "", '', callback_getroleType);

	fromValidate();
	$("#Determine").click(function() {
		if(fromValidate().form()) {
			if($("#userRoleId").find('input[type=checkbox][checked=checked]').length <= 0) {
				controlsHelper.alert("请选择角色");
			} else {
				event.preventDefault();
				insertUserInfo();
			}
		};
	});
	//取消
	$("#cancelBtn").click(function() {
		if(confirm("是否确定取消?"))
			location.href = "userList.html";
	})
});
/*
 * 功能：获取角色下拉框
 * 创建人：liql
 * 创建时间：2018-11-30
 */
function callback_getroleType(data) {
	console.log(data);
	if(data == undefined || data.rspCode == null || data.rspCode != "000") {
		controlsHelper.alert(data.rspDesc);
	} else {
		$("#userRoleId").empty();
		$.each(data.lists, function(index, entry) {
			$("#userRoleId").append("<label><input type='checkbox' data-value='" + entry.data_code + "' name='s'/>" + entry.data_name + "　</label>");
		});
		//li改变事件
		$("#userRoleId").find('input[type=checkbox]').click(function() {
			if($(this).attr('checked') == "checked") {
				$(this).removeAttr('checked');
				$(this).prop('checked', false);
			} else {
				$(this).attr('checked', 'checked');
				$(this).prop('checked', true);
			}
		});

	}
}
/*
 * 功能：新增用户信息
 * 创建人：Liql
 * 创建时间：2018-09-10
 */
function insertUserInfo() {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	var jsonstr = dataHelper.setJson(null, "nickName", $("#nickName").val()); //昵称
	jsonstr = dataHelper.setJson(jsonstr, "userName", $("#userName").val()); //姓名(用户名称)
	jsonstr = dataHelper.setJson(jsonstr, "userPhone", $("#userPhone").val()); //手机号
	jsonstr = dataHelper.setJson(jsonstr, "userEmail", $("#userEmail").val()); //邮箱
	jsonstr = dataHelper.setJson(jsonstr, "userAddress", $("#userAddress").val()); //家庭住址
	var userRolelist = "";
	$("#userRoleId").find('input[type=checkbox]').each(function() {
		if($(this).attr('checked') == 'checked') {
			userRolelist += $(this).attr('data-value') + ",";
		}
	});
	jsonstr = dataHelper.setJson(jsonstr, "userRole", userRolelist.substring(0, userRolelist.length - 1)); //角色ID
	jsonstr = dataHelper.setJson(jsonstr, "passWord", '111111'); //用户密码
	jsonstr = dataHelper.setJson(jsonstr, "status", $("#userIsStart").is(":checked") ? "1" : "2"); //是否启用1--启用 2--禁用
	jsonstr = dataHelper.setJson(jsonstr, "userCreate", $.cookie("userName")); //创建人为当前用户
	jsonParam.jsonStr = jsonstr;
	console.log(jsonParam);
	userInfoServer.insertUserInfo(jsonParam, callback_insertUserInfo);
};

function callback_insertUserInfo(data) {
	console.log(data);
	if(data == undefined || data.rspCode == null || data.rspCode != "000") {
		controlsHelper.alert(data.rspDesc);
	} else {
		controlsHelper.alert("添加用户信息成功", "20%");
		location.href = "userList.html";
	}
};