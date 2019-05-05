var userId; //用户id
/**
 * 页面加载
 * 创建人:liql
 * 创建时间：2018-9-10
 */
$(document).ready(function() {
	userId = dataHelper.QueryString("userId");
	//查询用户信息
	//获取角色下拉框数据  码表
	dataValueHelper.GetDictionaryDataList("roleType", "", "", '', callback_getroleType);
	setTimeout(function() {
		getUserInfoById(userId);
	}, 200);

	fromValidate();
	$("#Determine").click(function() {
		if(fromValidate().form()) {
			if($("#userRoleId").find('input[type=checkbox][checked=checked]').length <= 0) {
				controlsHelper.alert("请选择角色");
			} else {
				event.preventDefault();
				updateUserInfo();
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
 * 功能：根据id查询用户信息
 * 创建人：Liql
 * 创建时间：2018-9-10
 */
function getUserInfoById(userid) {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	jsonParam.jsonStr = dataHelper.setJson(null, "userId", userid); //昵称
	console.log(jsonParam);
	userInfoServer.getUserInfoById(jsonParam, callback_getUserInfoById);
}
/*
 * 功能：根据id查询用户信息回调
 * 创建人：Liql
 * 创建时间：2018-9-10
 */
function callback_getUserInfoById(data) {
	console.log(data);
	if(data == undefined || data.rspCode == null || data.rspCode != "000") {
		controlsHelper.alert(data.rspDesc);
	} else {
		$("#nickName").val(data.nickName);
		$("#userName").val(data.userName);
		$("#userPhone").val(data.userPhone);
		$("#userEmail").val(data.userEmail);
		$("#userAddress").val(data.userAddress);
		if(data.status == "1") {
			$("#userIsStart").attr("checked", "checked");
			$("#userIsStart").prop("checked", true);
		} else {
			$("#userIsStart").removeAttr("checked");
			$("#userIsStart").prop("checked", false);
		}
		//角色
		var roleList = dataHelper.isEmpty(data.userRole) ? [] : data.userRole.split(',');
		if(roleList.length > 0) {
			$.each(roleList, function(index, entry) {
				$("#userRoleId").find("input[type=checkbox][data-value=" + entry + "]").attr('checked', "checked");
				$("#userRoleId").find("input[type=checkbox][data-value=" + entry + "]").prop('checked', true);
			});
		}

	}
}
/*
 * 功能：新增用户信息
 * 创建人：Liql
 * 创建时间：2018-09-10
 */
function updateUserInfo() {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	var jsonstr = dataHelper.setJson(null, "userId", userId); //id
	jsonstr = dataHelper.setJson(jsonstr, "nickName", $("#nickName").val()); //昵称
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
	jsonstr = dataHelper.setJson(jsonstr, "userUpdate", dataHelper.isEmpty($.cookie("userName")) ? 'admin' : $.cookie("userName")); //创建人为当前用户
	jsonParam.jsonStr = jsonstr;
	console.log(jsonParam);
	userInfoServer.updateUserInfo(jsonParam, callback_updateUserInfo);
};

function callback_updateUserInfo(data) {
	console.log(data);
	if(data == undefined || data.rspCode == null || data.rspCode != "000") {
		controlsHelper.alert(data.rspDesc);
	} else {
		controlsHelper.alert("修改用户信息成功", "20%");
		location.href = "userList.html";
	}
};