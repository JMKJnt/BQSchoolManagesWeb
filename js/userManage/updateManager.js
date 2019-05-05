var managerId;
/**
 * 页面加载
 * 创建人:liql
 * 创建时间：2018-9-10
 */
$(document).ready(function() {
	//管理员id
	managerId = dataHelper.QueryString("managerId");

	fromValidate();
	$("#Determine").click(function() {
		if(fromValidate().form()) {
			event.preventDefault();
			updateUserManage();
		};
	});
	//获取管理员信息
	getManageInfo(managerId);
	//取消
	$("#cancelBtn").click(function() {
		if(confirm("是否确定取消?"))
			location.href = "managerList.html";
	})
});
/*
 * 功能：根据id查询用户信息
 * 创建人：Liql
 * 创建时间：2018-9-10
 */
function getManageInfo(userid) {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	jsonParam.jsonStr = dataHelper.setJson(null, "manageId", userid); //昵称
	console.log(jsonParam);
	userInfoServer.getManageInfo(jsonParam, callback_getManageInfo);
}
/*
 * 功能：根据id查询用户信息回调
 * 创建人：Liql
 * 创建时间：2018-9-10
 */
function callback_getManageInfo(data) {
	console.log(data);
	if(data == undefined || data.rspCode == null || data.rspCode != "000") {
		controlsHelper.alert(data.rspDesc);
	} else {
		$("#manageUserName").val(data.manageUserName);
		$("#manageName").val(data.manageName);
		$("#managePhone").val(data.managePhone);
		if(data.status == "1") {
			$("#userIsStart").attr("checked", "checked");
			$("#userIsStart").prop("checked", true);
		} else {
			$("#userIsStart").removeAttr("checked");
			$("#userIsStart").prop("checked", false);
		}
	}
}
/*
 * 功能：新增用户信息
 * 创建人：Liql
 * 创建时间：2018-09-10
 */
function updateUserManage() {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	var jsonstr = dataHelper.setJson(null, "manageId", managerId); //id 
	jsonstr = dataHelper.setJson(jsonstr, "manageUserName", $("#manageUserName").val()); //昵称
	jsonstr = dataHelper.setJson(jsonstr, "manageName", $("#manageName").val()); //姓名(用户名称)
	jsonstr = dataHelper.setJson(jsonstr, "managePhone", $("#managePhone").val()); //手机号
	jsonstr = dataHelper.setJson(jsonstr, "password", '111111'); //用户密码
	jsonstr = dataHelper.setJson(jsonstr, "status", $("#userIsStart").is(":checked") ? "1" : "2"); //是否启用1--启用 2--禁用
	jsonstr = dataHelper.setJson(jsonstr, "manageCreate", 'admin'); //创建人为当前用户$.cookie("userName")
	jsonParam.jsonStr = jsonstr;
	console.log(jsonParam);
	userInfoServer.updateUserManage(jsonParam, callback_updateUserManage);
};
/*
 * 功能：新增管理员信息回调
 * 创建人：liql
 * 创建时间：2018-09-11
 */
function callback_updateUserManage(data) {
	console.log(data);
	if(data == undefined || data.rspCode == null || data.rspCode != "000") {
		controlsHelper.alert(data.rspDesc);
	} else {
		controlsHelper.alert("修改信息成功", "20%");
		location.href = "managerList.html";
	}
};