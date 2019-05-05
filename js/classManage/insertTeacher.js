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
			insertFanousTea();
		};
	});
	$("#isComOrP").find("input[type=radio]").click(function() {
		$("#isComOrP").find("input[type=radio]").removeAttr('checked');
		$("#isComOrP").find("input[type=radio]").prop('checked', false);
		$(this).attr("checked", "checked");
		$(this).prop("checked", true);
	})
	//取消
	$("#cancelBtn").click(function() {
		if(confirm("是否确定取消?"))
			location.href = "teacherList.html";
	})
});

/*
 * 功能：新增导师信息
 * 创建人：Liql
 * 创建时间：2018-09-10
 */
function insertFanousTea() {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	var jsonstr = dataHelper.setJson(null, "teacherName", $("#teacherName").val()); //导师名称
	jsonstr = dataHelper.setJson(jsonstr, "teacherImg", $("#imgName1").attr("src")); //出生日期
	jsonstr = dataHelper.setJson(jsonstr, "teacherBirthday", $("#reservation1").val()); //出生日期
	jsonstr = dataHelper.setJson(jsonstr, "teacherSex", $("#isComOrP").find("input[type=radio][checked=checked]").attr('value')); //班级描述	
	jsonstr = dataHelper.setJson(jsonstr, "teacherPhone", $("#teacherPhone").val()); //手机号
	jsonstr = dataHelper.setJson(jsonstr, "teacherQualification", $("#teacherQualification").val()); //资质说明
	jsonstr = dataHelper.setJson(jsonstr, "teacherKeyword", $("#teacherKeyword").val()); //搜索关键字
	jsonstr = dataHelper.setJson(jsonstr, "status", $("#userIsStart").is(":checked") ? "1" : "2"); //是否启用1--启用 2--禁用
	jsonstr = dataHelper.setJson(jsonstr, "teacherCreate", $.cookie("userName")); //创建人为当前用户
	jsonParam.jsonStr = jsonstr;
	console.log(jsonParam);
	classInfoServer.insertFanousTea(jsonParam, callback_insertFanousTea);
};
/**
 * 功能：新增导师信息回调
 * 创建人：liql
 * 创建时间：2018-9-11
 * @param {Object} data
 */
function callback_insertFanousTea(data) {
	console.log(data);
	if(data == undefined || data.rspCode == null || data.rspCode != "000") {
		controlsHelper.alert(data.rspDesc);
	} else {
		controlsHelper.alert("添加导师信息成功", "20%");
		location.href = "teacherList.html";
	}
};