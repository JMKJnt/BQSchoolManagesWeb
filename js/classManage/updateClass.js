var classId;
var studentList = new Array();
/**
 * 页面加载
 * 创建人:liql
 * 创建时间：2018-9-10
 */
$(document).ready(function() {

	classId = dataHelper.QueryString("classId");
	//获取老师下拉
	getUserInfoList();

	fromValidate();
	$("#Determine").click(function() {
		if(fromValidate().form()) {
			if($("#studentList").find("input[type=checkbox][checked=checked]").length <= 0) {
				controlsHelper.alert("请选择学生")
			} else {
				event.preventDefault();
				updateClassInfo();
			}
		};
	});
	//全选
	$("#checkAll").click(function() {
		if($(this).attr('checked') == "checked") {
			$(this).removeAttr('checked');
			$(this).prop('checked', false);
			//处理学生数据
			$("#studentList").find("input[type=checkbox]").removeAttr('checked');
			$("#studentList").find("input[type=checkbox]").prop('checked', false);
		} else {
			$(this).attr('checked', 'checked');
			$(this).prop('checked', true);
			$("#studentList").find("input[type=checkbox]").attr("checked", 'checked');
			$("#studentList").find("input[type=checkbox]").prop('checked', true);
		}
		$(".CheckedCount").text($("#studentList").find("input[type=checkbox][checked=checked]").length);
	});
	//根据学生名称查询
	$("#Viewstudent").click(function() {
		if($("#studentName").val() != "") {
			console.log($("#studentName").val());
			$("#studentList").find("li").each(function() {
				console.log($(this).text());
				if($(this).text().indexOf($("#studentName").val().trim()) >= 0) {
					$(this).show();
				} else {
					$(this).hide();
				}
			})
		} else {
			$("#studentList").find("li").show();
		}
	})

	//取消
	$("#cancelBtn").click(function() {
		if(confirm("是否确定取消?"))
			location.href = "classList.html";
	})
});
/*
 * 功能：获取学生列表
 * 创建人：liql
 * 创建时间：20181031
 */
function getUserInfoStudentList() {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	var jsonstr = dataHelper.setJson(null, "curragePage", "1"); //当前页码
	jsonstr = dataHelper.setJson(jsonstr, "userName", ""); //用户名称
	jsonstr = dataHelper.setJson(jsonstr, "userPhone", ""); //用户手机号
	jsonstr = dataHelper.setJson(jsonstr, "userRole", "3"); //用户角色为学生
	jsonstr = dataHelper.setJson(jsonstr, "isClass", "1"); //是班级选择，只查询没有班级的学生用户
	jsonstr = dataHelper.setJson(jsonstr, "classId", classId); //是班级选择，班级ID
	jsonstr = dataHelper.setJson(jsonstr, "pageSize", "99999999"); //每页显示记录数
	jsonParam.jsonStr = jsonstr;
	console.log(jsonParam);
	userInfoServer.getUserInfoList(jsonParam, callback_getUserInfoStudentList);
};
/*
 * 功能：获取学生列表回调
 * 创建人：liql
 * 创建时间：20181031
 */
function callback_getUserInfoStudentList(data) {
	console.log(data);
	$("#studentList").html('');
	if(data == undefined || data.rspCode != "000" || data.rspCode == null) {
		console.log(data.rspDesc);
		controlsHelper.alert(data.rspDesc);
	} else {
		var template = $("#studentListTemplate").html();
		Mustache.parse(template);
		var rendered = Mustache.render(template, data);
		$("#studentList").append(rendered);
		studentList = data.lists;
		$(".TotalNumber").html(data.total);
		$("#studentList").find("input[type=checkbox]").click(function() {
			if($(this).attr('checked') == "checked") {
				$(this).removeAttr('checked');
				$(this).prop('checked', false);
			} else {
				$(this).attr('checked', 'checked');
				$(this).prop('checked', true);
			}
			$(".CheckedCount").text($("#studentList").find("input[type=checkbox][checked=checked]").length);
		});

	}
	//根据id获取班级信息
	getClassInfoById();
}
/*
 * 功能：获取用户列表
 * 创建人：Liql
 * 创建时间：2018-09-10
 */
function getUserInfoList() {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	var jsonstr = dataHelper.setJson(null, "curragePage", "1"); //当前页码
	jsonstr = dataHelper.setJson(jsonstr, "userName", ""); //用户名称
	jsonstr = dataHelper.setJson(jsonstr, "userPhone", ""); //用户手机号
	jsonstr = dataHelper.setJson(jsonstr, "userRole", "2"); //用户角色ID
	jsonstr = dataHelper.setJson(jsonstr, "pageSize", "99999999"); //每页显示记录数
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
		$("#classTeacher").empty();
		$(".classTeacher").html("请选择老师");
		$(".classTeacher").attr("data-value", "");
		$("#classTeacher").append("<li value=''><a>请选择老师</a></li>");
		$.each(data.lists, function(index, entry) {
			$("#classTeacher").append("<li value=" + entry.userId + "><a>" + entry.userName + "(" + entry.nickName + ") </a></li>");
		});
		//老师点击
		$("#classTeacher").find("li").click(function() {
			$(".classTeacher").html($(this).find("a").html());
			$(".classTeacher").attr("data-value", $(this).attr('value'));
		});
	}
	//获取班级级别
	dataValueHelper.GetDictionaryDataList("classLevel", "", "", '', callback_getclassLevel);

};
/*
 * 功能：获取班级级别回调
 * 创建人：liql
 * 创建时间：2018-12-4
 */
function callback_getclassLevel(data) {
	console.log(data);
	$("#classLevel").empty();
	$(".classLevel").html("请选择级别");
	$("#classLevel").append("<li value=''><a>" + "请选择级别" + "</a></li>");
	$.each(data.lists, function(index, entry) {
		$("#classLevel").append("<li value=" + entry.data_code + "><a>" + entry.data_name + "</a></li>");
	});

	//li改变事件
	$("#classLevel").find('li').click(function() {
		$(".classLevel").attr('data-value', $(this).attr('value'));
		$(".classLevel").html($(this).find('a').html());
	});
	//获取班级划分
	dataValueHelper.GetDictionaryDataList("classDivision", "", "", '', callback_getclassDivision);
}
/*
 * 功能：获取班级划分会滴
 * 创建人：liql
 * 创建时间：2018-12-4
 */
function callback_getclassDivision(data) {
	console.log(data);
	$("#classDivision").empty();
	$(".classDivision").html("请选择年段");
	$("#classDivision").append("<li value=''><a>" + "请选择年段" + "</a></li>");
	$.each(data.lists, function(index, entry) {
		$("#classDivision").append("<li value=" + entry.data_code + "><a>" + entry.data_name + "</a></li>");
	});

	//li改变事件
	$("#classDivision").find('li').click(function() {
		$(".classDivision").attr('data-value', $(this).attr('value'));
		$(".classDivision").html($(this).find('a').html());
	});
	getSchoolList();
}
/*
 * 功能：获取学校列表
 * 创建人：Liql
 * 创建时间：2018-09-10
 */
function getSchoolList() {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	var jsonstr = dataHelper.setJson(null, "curragePage", "1"); //当前页码
	jsonstr = dataHelper.setJson(jsonstr, "schoolName", ""); //班级名称
	jsonstr = dataHelper.setJson(jsonstr, "schoolProvince", ""); //省id
	jsonstr = dataHelper.setJson(jsonstr, "schoolCity", ""); //市id
	jsonstr = dataHelper.setJson(jsonstr, "schoolCounty", ""); //县id
	jsonstr = dataHelper.setJson(jsonstr, "status", "1"); //老师
	jsonstr = dataHelper.setJson(jsonstr, "pageSize", "9999999"); //每页显示记录数
	jsonParam.jsonStr = jsonstr;
	console.log(jsonParam);
	classInfoServer.getSchoolList(jsonParam, callback_getSchoolList);
};
/**
 * 功能：获取学校列表回调
 * 创建人：Liql
 * 创建时间：2018-09-10
 * @param {Object} data
 */
function callback_getSchoolList(data) {
	console.log(data);
	if(data == undefined || data.rspCode != "000" || data.rspCode == null) {
		console.log(data.rspDesc);
		controlsHelper.alert(data.rspDesc);
	} else {
		$("#school").empty();
		$(".school").html("请选择学校");
		$(".school").attr("data-value", "");
		$("#school").append("<li value=''><a>请选择学校</a></li>");
		$.each(data.lists, function(index, entry) {
			$("#school").append("<li value=" + entry.schoolId + " data-address =" + entry.schoolAddress + " ><a>" + entry.schoolName + " </a></li>");
		});
		//老师点击
		$("#school").find("li").click(function() {
			$(".school").html($(this).find("a").html());
			$(".school").attr("data-value", $(this).attr('value'));
			$("#classSchoolAddress").val($(this).attr('data-address'));
		});
	}
	getUserInfoStudentList();
};
/*
 * 功能：根据id查询班级信息
 * 创建人：Liql
 * 创建时间：2018-9-11
 */
function getClassInfoById() {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	jsonParam.jsonStr = dataHelper.setJson(null, "classId", classId); //班级id
	console.log(jsonParam);
	classInfoServer.getClassInfoById(jsonParam, callback_getClassInfoById);
}
/*
 * 功能：根据id查询班级信息回调
 * 创建人：Liql
 * 创建时间：2018-9-11
 */
function callback_getClassInfoById(data) {
	console.log(data);
	if(data == undefined || data.rspCode == null || data.rspCode != "000") {
		controlsHelper.alert(data.rspDesc);
	} else {
		$("#className").val(data.className);
		$("#classDesc").val(data.classDesc);
		$("#classSchoolAddress").val(data.classSchoolAddress);
		if(data.status == "1") {
			$("#userIsStart").attr("checked", "checked");
			$("#userIsStart").prop("checked", true);
		} else {
			$("#userIsStart").removeAttr("checked");
			$("#userIsStart").prop("checked", false);
		}
		//班主任
		$(".classTeacher").attr('data-value', data.classTeacher);
		$(".classTeacher").html($("#classTeacher").find("li[value=" + data.classTeacher + "]").find("a").html());

		//班级级别
		$(".classLevel").attr('data-value', data.classLevel);
		$(".classLevel").html($("#classLevel").find("li[value=" + data.classLevel + "]").find("a").html());

		//班级划分
		$(".classDivision").attr('data-value', data.classDivision);
		$(".classDivision").html($("#classDivision").find("li[value=" + data.classDivision + "]").find("a").html());

		//学校
		$(".school").attr('data-value', data.classSchool);
		$(".school").html($("#school").find("li[value=" + data.classSchool + "]").find("a").html());

		$.each(data.studentList, function(index, entry) {
			$("#studentList").find("input[type=checkbox][data-id=" + entry.studentId + "]").attr("checked", 'checked');
			$("#studentList").find("input[type=checkbox][data-id=" + entry.studentId + "]").prop('checked', true);
		});
		$(".CheckedCount").text($("#studentList").find("input[type=checkbox][checked=checked]").length);
	}
}
/*
 * 功能：修改班级信息
 * 创建人：Liql
 * 创建时间：2018-09-10
 */
function updateClassInfo() {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	var jsonstr = dataHelper.setJson(null, "classId", classId); //班级id
	jsonstr = dataHelper.setJson(jsonstr, "className", $("#className").val()); //班级名称
	jsonstr = dataHelper.setJson(jsonstr, "classSchool", $(".school").attr('data-value')); //学校名称
	jsonstr = dataHelper.setJson(jsonstr, "classDesc", $("#classDesc").val()); //班级描述
	jsonstr = dataHelper.setJson(jsonstr, "classTeacher", $(".classTeacher").attr('data-value')); //老师id
	jsonstr = dataHelper.setJson(jsonstr, "classSchoolAddress", $("#classSchoolAddress").val()); //学校地址
	jsonstr = dataHelper.setJson(jsonstr, "classLevel", $(".classLevel").attr('data-value')); //老师id
	jsonstr = dataHelper.setJson(jsonstr, "classDivision", $(".classDivision").attr('data-value')); //老师id
	jsonstr = dataHelper.setJson(jsonstr, "status", $("#userIsStart").is(":checked") ? "1" : "2"); //是否启用1--启用 2--禁用
	jsonstr = dataHelper.setJson(jsonstr, "classUpdate", $.cookie("userName")); //创建人为当前用户$.cookie("userName")
	jsonstr = dataHelper.setJson(jsonstr, "studentList", getStudentList());
	jsonParam.jsonStr = jsonstr;
	console.log(jsonParam);
	classInfoServer.updateClassInfo(jsonParam, callback_updateClassInfo);
};
/**
 * 功能：修改班级信息回调
 * 创建人：liql
 * 创建时间：2018-9-11
 * @param {Object} data
 */
function callback_updateClassInfo(data) {
	console.log(data);
	if(data == undefined || data.rspCode == null || data.rspCode != "000") {
		controlsHelper.alert(data.rspDesc);
	} else {
		controlsHelper.alert("修改班级信息成功", "20%");
		location.href = "classList.html";
	}
};
/*
 * 功能：获取所选择的的学生信息
 * 创建人：liql
 * 创建时间：20181031
 */
function getStudentList() {
	var list = new Array();
	$("#studentList").find("input[type=checkbox][checked=checked]").each(function() {
		var value = dataHelper.setJson(null, "studentId", $(this).attr("data-id"));
		list.push(jQuery.parseJSON(value));
	})
	return list;
}