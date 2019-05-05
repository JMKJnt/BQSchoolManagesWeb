var teacherId;
/**
 * 页面加载
 * 创建人:liql
 * 创建时间：2018-9-10
 */
$(document).ready(function() {
	teacherId = dataHelper.QueryString("teacherId");

	fromValidate();
	$("#Determine").click(function() {
		if(fromValidate().form()) {
			event.preventDefault();
			updateFanousTea();
		};
	});
	//性别选择
	$("#isComOrP").find("input[type=radio]").click(function() {
		$("#isComOrP").find("input[type=radio]").removeAttr('checked');
		$("#isComOrP").find("input[type=radio]").prop('checked', false);
		$(this).attr("checked", "checked");
		$(this).prop("checked", true);
	})
	//获取导师信息
	getFanousTeaInfo();

	//取消
	$("#cancelBtn").click(function() {
		if(confirm("是否确定取消?"))
			location.href = "teacherList.html";
	})
});
/*
 * 功能：获取导师信息
 * 创建人：Liql
 * 创建时间：2018-9-11
 */
function getFanousTeaInfo() {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	jsonParam.jsonStr = dataHelper.setJson(null, "teacherId", teacherId); //导师id
	console.log(jsonParam);
	classInfoServer.getFanousTeaInfo(jsonParam, callback_getFanousTeaInfo);
}
/*
 * 功能：获取导师信息回调
 * 创建人：Liql
 * 创建时间：2018-9-11
 */
function callback_getFanousTeaInfo(data) {
	console.log(data);
	if(data == undefined || data.rspCode == null || data.rspCode != "000") {
		controlsHelper.alert(data.rspDesc);
	} else {
		$("#teacherName").val(data.teacherName);
		$("#reservation1").val(data.teacherBirthday);
		$("#teacherPhone").val(data.teacherPhone);
		$("#teacherQualification").val(data.teacherQualification);
		$("#teacherKeyword").val(data.teacherKeyword);

		if(data.status == "1") {
			$("#userIsStart").attr("checked", "checked");
			$("#userIsStart").prop("checked", true);
		} else {
			$("#userIsStart").removeAttr("checked");
			$("#userIsStart").prop("checked", false);
		}
		//性别
		$("#isComOrP").find("input[type=radio]").removeAttr('checked');
		$("#isComOrP").find("input[type=radio]").prop("checked", false);
		$("#isComOrP").find("input[type=radio][value=" + data.teacherSex + "]").attr('checked', 'checked');
		$("#isComOrP").find("input[type=radio][value=" + data.teacherSex + "]").prop("checked", true);
		//图片
		if(data.teacherImg != undefined && data.teacherImg != null && data.teacherImg != "") {
			$("#imgName1").attr("data-filepath", data.teacherImg);
			$("#imgName1").attr("src", data.teacherImg);
			$(".imgName1").attr('src', data.teacherImg);
		}

	}
}
/*
 * 功能：修改导师信息
 * 创建人：Liql
 * 创建时间：2018-09-10
 */
function updateFanousTea() {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	var jsonstr = dataHelper.setJson(null, "teacherId", teacherId); //导师id
	jsonstr = dataHelper.setJson(jsonstr, "teacherName", $("#teacherName").val()); //导师名称
	jsonstr = dataHelper.setJson(jsonstr, "teacherImg", $("#imgName1").attr("src")); //出生日期
	jsonstr = dataHelper.setJson(jsonstr, "teacherBirthday", $("#reservation1").val()); //出生日期
	jsonstr = dataHelper.setJson(jsonstr, "teacherSex", $("#isComOrP").find("input[type=radio][checked=checked]").attr('value')); //班级描述	
	jsonstr = dataHelper.setJson(jsonstr, "teacherPhone", $("#teacherPhone").val()); //手机号
	jsonstr = dataHelper.setJson(jsonstr, "teacherQualification", $("#teacherQualification").val()); //资质说明
	jsonstr = dataHelper.setJson(jsonstr, "teacherKeyword", $("#teacherKeyword").val()); //搜索关键字
	jsonstr = dataHelper.setJson(jsonstr, "status", $("#userIsStart").is(":checked") ? "1" : "2"); //是否启用1--启用 2--禁用
	jsonstr = dataHelper.setJson(jsonstr, "teacherUpdate", $.cookie("userName")); //创建人为当前用户
	jsonParam.jsonStr = jsonstr;
	console.log(jsonParam);
	classInfoServer.updateFanousTea(jsonParam, callback_updateFanousTea);
};
/**
 * 功能：修改导师信息回调
 * 创建人：liql
 * 创建时间：2018-9-11
 * @param {Object} data
 */
function callback_updateFanousTea(data) {
	console.log(data);
	if(data == undefined || data.rspCode == null || data.rspCode != "000") {
		controlsHelper.alert(data.rspDesc);
	} else {
		controlsHelper.alert("修改导师信息成功", "20%");
		location.href = "teacherList.html";
	}
};