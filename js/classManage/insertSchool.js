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
			insertSchool();
		};
	});

	//取消
	$("#cancelBtn").click(function() {
		if(confirm("是否确定取消?")) {
			location.href = "schoolList.html";
		}
	})
	$("#schoolName").on('focus blur',function(){
		if($("#schoolShortName").val()==""){
			$("#schoolShortName").val($("#schoolName").val());
		}
	})
	dataValueHelper.GetDictionaryDataList("schoolType", "#schoolType", ".schoolType", '请选择类型');
});

/*
 * 功能：新增学校信息
 * 创建人：Liql
 * 创建时间：2018-09-10
 */
function insertSchool() {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	var jsonstr = dataHelper.setJson(null, "schoolName", $("#schoolName").val()); //学校名称
	jsonstr = dataHelper.setJson(jsonstr, "schoolShortName", $("#schoolShortName").val()); //学校描述
	jsonstr = dataHelper.setJson(jsonstr, "schoolType", $(".schoolType").attr('data-value') == undefined ? '' : $(".schoolType").attr('data-value')); //县id
	jsonstr = dataHelper.setJson(jsonstr, "schoolProvince", $(".province").attr('data-value') == undefined ? '' : $(".province").attr('data-value')); //省id
	jsonstr = dataHelper.setJson(jsonstr, "schoolCity", $(".city").attr('data-value') == undefined ? '' : $(".city").attr('data-value')); //市id
	jsonstr = dataHelper.setJson(jsonstr, "schoolCounty", $(".county").attr('data-value') == undefined ? '' : $(".county").attr('data-value')); //县id
	jsonstr = dataHelper.setJson(jsonstr, "schoolDesc", $("#schoolDesc").val()); //学校描述
	jsonstr = dataHelper.setJson(jsonstr, "schoolAddress", $("#schoolAddress").val()); //学校地址
	jsonstr = dataHelper.setJson(jsonstr, "status", $("#userIsStart").is(":checked") ? "1" : "2"); //是否启用1--启用 2--禁用
	jsonstr = dataHelper.setJson(jsonstr, "schoolCreate", $.cookie("userName")); //创建人为当前用户$.cookie("userName")
	jsonParam.jsonStr = jsonstr;
	console.log(jsonParam);
	classInfoServer.insertSchool(jsonParam, callback_insertSchool);
};
/**
 * 功能：新增学校信息回调
 * 创建人：liql
 * 创建时间：2018-9-11
 * @param {Object} data
 */
function callback_insertSchool(data) {
	console.log(data);
	if(data == undefined || data.rspCode == null || data.rspCode != "000") {
		controlsHelper.alert(data.rspDesc);
	} else {
		controlsHelper.alert("添加学校信息成功", "20%");
		location.href = "schoolList.html";
	}
};