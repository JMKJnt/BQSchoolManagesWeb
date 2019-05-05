var schoolId;
/**
 * 页面加载
 * 创建人:liql
 * 创建时间：2018-9-10
 */
$(document).ready(function() {
	fromValidate();
	schoolId = dataHelper.QueryString("schoolId");
	$("#Determine").click(function() {
		if(fromValidate().form()) {
			event.preventDefault();
			updateSchool();
		};
	});

	//取消
	$("#cancelBtn").click(function() {
		if(confirm("是否确定取消?")) {
			location.href = "schoolList.html";
		}
	})
	$("#schoolName").on('focus blur', function() {
		if($("#schoolShortName").val() == "") {
			$("#schoolShortName").val($("#schoolName").val());
		}
	})
	dataValueHelper.GetDictionaryDataList("schoolType", "#schoolType", ".schoolType", '请选择类型');
	setTimeout(function() {
		getSchoolInfo();
	}, 200)

});
/**
 * 功能：获取学校信息
 * 创建人：liql
 * 创建时间：2018-11-9
 */
function getSchoolInfo() {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	jsonParam.jsonStr = dataHelper.setJson(null, "schoolId", schoolId); //学校id
	console.log(jsonParam);
	classInfoServer.getSchoolInfo(jsonParam, callback_getSchoolInfo);
}
/*
 * 功能：获取学校信息回调
 * 创建人：liql
 * 创建时间：2018-1-9
 */
function callback_getSchoolInfo(data) {
	console.log(data);
	if(data == undefined || data.rspCode == null || data.rspCode != "000") {
		controlsHelper.alert(data.rspDesc);
	} else {
		$("#schoolName").val(data.schoolName);
		$("#schoolShortName").val(data.schoolShortName);
		if(data.schoolProvince) {
			$(".province").attr('data-value', data.schoolProvince);
			$('.province').text($("#province").find("li[value=" + data.schoolProvince + "] a").text());
			$("#province").find("li[value=" + data.schoolProvince + "]").click();
		} else {
			$('.province').html('省');
		};
		if(data.schoolCity) {
			$(".city").attr('data-value', data.schoolCity);
			$('.city').text($("#city").find("li[value=" + data.schoolCity + "] a").text());
			$("#city").find("li[value=" + data.schoolCity + "]").click();
		} else {
			$('.city').html('市');
		};
		if(data.schoolCounty) {
			$(".county").attr('data-value', data.schoolCounty);
			$('.county').text($("#county").find("li[value=" + data.schoolCounty + "] a").text());
		} else {
			$('.county').html('县');
		}

		if(dataHelper.isEmpty(data.schoolType)) {
			$('.schoolType').text("请选择类型");
			$(".schoolType").attr('data-value', "");
		} else {
			$(".schoolType").attr('data-value', data.schoolType);
			$('.schoolType').text($("#schoolType").find("li[value=" + data.schoolType + "] a").text());
		}
		$("#schoolAddress").val(data.schoolAddress);
		$("#schoolDesc").val(data.schoolDesc);
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
 * 功能：修改学校信息
 * 创建人：Liql
 * 创建时间：2018-09-10
 */
function updateSchool() {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	var jsonstr = dataHelper.setJson(null, "schoolId", schoolId); //学校id
	jsonstr = dataHelper.setJson(jsonstr, "schoolShortName", $("#schoolShortName").val()); //学校描述
	jsonstr = dataHelper.setJson(jsonstr, "schoolType", $(".schoolType").attr('data-value') == undefined ? '' : $(".schoolType").attr('data-value')); //县id
	jsonstr = dataHelper.setJson(jsonstr, "schoolName", $("#schoolName").val()); //学校名称
	jsonstr = dataHelper.setJson(jsonstr, "schoolProvince", $(".province").attr('data-value') == undefined ? '' : $(".province").attr('data-value')); //省id
	jsonstr = dataHelper.setJson(jsonstr, "schoolCity", $(".city").attr('data-value') == undefined ? '' : $(".city").attr('data-value')); //市id
	jsonstr = dataHelper.setJson(jsonstr, "schoolCounty", $(".county").attr('data-value') == undefined ? '' : $(".county").attr('data-value')); //县id
	jsonstr = dataHelper.setJson(jsonstr, "schoolDesc", $("#schoolDesc").val()); //学校描述
	jsonstr = dataHelper.setJson(jsonstr, "schoolAddress", $("#schoolAddress").val()); //学校地址
	jsonstr = dataHelper.setJson(jsonstr, "status", $("#userIsStart").is(":checked") ? "1" : "2"); //是否启用1--启用 2--禁用
	jsonstr = dataHelper.setJson(jsonstr, "schoolUpdate", $.cookie("userName")); //创建人为当前用户$.cookie("userName")
	jsonParam.jsonStr = jsonstr;
	console.log(jsonParam);
	classInfoServer.updateSchool(jsonParam, callback_updateSchool);
};
/**
 * 功能：修改学校信息回调
 * 创建人：liql
 * 创建时间：2018-9-11
 * @param {Object} data
 */
function callback_updateSchool(data) {
	console.log(data);
	if(data == undefined || data.rspCode == null || data.rspCode != "000") {
		controlsHelper.alert(data.rspDesc);
	} else {
		controlsHelper.alert("修改学校信息成功", "20%");
		location.href = "schoolList.html";
	}
};