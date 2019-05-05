/**
 * 页面加载
 * 创建人:liql
 * 创建时间：2018-9-10
 */
$(document).ready(function() {

	fromValidate();
	$("#Determine").click(function() {
		if(fromValidate().form()) {
			event.preventDefault();
			insertUserManage();
		};
	});

	//取消
	$("#cancelBtn").click(function() {
		if(confirm("是否确定取消?"))
			location.href = "managerList.html";
	})
});
/*
 * 功能：新增用户信息
 * 创建人：Liql
 * 创建时间：2018-09-10
 */
function insertUserManage() {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	var jsonstr = dataHelper.setJson(null, "manageUserName", $("#manageUserName").val()); //昵称
	jsonstr = dataHelper.setJson(jsonstr, "manageName", $("#manageName").val()); //姓名(用户名称)
	jsonstr = dataHelper.setJson(jsonstr, "managePhone", $("#managePhone").val()); //手机号
	jsonstr = dataHelper.setJson(jsonstr, "password", '111111'); //用户密码
	jsonstr = dataHelper.setJson(jsonstr, "status", $("#userIsStart").is(":checked") ? "1" : "2"); //是否启用1--启用 2--禁用
	jsonstr = dataHelper.setJson(jsonstr, "manageCreate", "admin"); //创建人为当前用户$.cookie("userName"))
	jsonParam.jsonStr = jsonstr;
	console.log(jsonParam);
	userInfoServer.insertUserManage(jsonParam, callback_insertUserManage);
};
/*
 * 功能：新增管理员信息回调
 * 创建人：liql
 * 创建时间：2018-09-11
 */
function callback_insertUserManage(data) {
	console.log(data);
	if(data == undefined || data.rspCode == null || data.rspCode != "000") {
		controlsHelper.alert(data.rspDesc);
	} else {
		controlsHelper.alert("添加信息成功", "20%");
		location.href = "managerList.html";
	}
};