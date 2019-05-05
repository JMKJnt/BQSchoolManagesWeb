var familyId; //用户id
/**
 * 页面加载
 * 创建人:liql
 * 创建时间：2018-9-10
 */
$(document).ready(function() {
	familyId = dataHelper.QueryString("familyId");
	//查询用户信息
	//获取角色下拉框数据  码表
	dataValueHelper.GetDictionaryDataList("familyCate", "", "", '', callback_getfamilyCate);
	setTimeout(function() {
		getUserInfoById(userId);
	}, 200);

	fromValidate();
	$("#Determine").click(function() {
		if(fromValidate().form()) {
			event.preventDefault();
			updateFamily();
		};
	});
	//取消
	$("#cancelBtn").click(function() {
		if(confirm("是否确定取消?"))
			location.href = "familyList.html";
	})
});
/*
 * 功能：获取亲属关系下拉框
 * 创建人：liql
 * 创建时间：2018-11-30
 */
function callback_getfamilyCate(data) {
	console.log(data);
	if(data == undefined || data.rspCode == null || data.rspCode != "000") {
		controlsHelper.alert(data.rspDesc);
	} else {
		$("#familyCate").empty();
		$.each(data.lists, function(index, entry) {
			$("#familyCate").append("<li data-value='" + entry.data_code + "'><a>" + entry.data_name + "</a>　</li>");
		});
		//li改变事件
		$("#familyCate").find('li').click(function() {
			$(".familyCate").attr('data-value', $(this).attr('data-value'));
			$(".familyCate").html($(this).find('a').text().trim());
		});

	}
	//获取用户列表
	getUserInfoList();
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
	jsonstr = dataHelper.setJson(jsonstr, "userName", ''); //用户名称
	jsonstr = dataHelper.setJson(jsonstr, "userPhone", ''); //用户手机号
	jsonstr = dataHelper.setJson(jsonstr, "userRole", '3'); //用户角色ID
	jsonstr = dataHelper.setJson(jsonstr, "pageSize", '9999999'); //每页显示记录数
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
	if(data == undefined || data.rspCode != "000" || data.rspCode == null) {
		console.log(data.rspDesc);
		controlsHelper.alert(data.rspDesc);
	} else {
		$("#familyUserId").empty();
		$("#familyUserId").append("<li data-value=''><a>请选择关系人</a></li>");
		$.each(data.lists, function(index, entry) {
			$("#familyUserId").append("<li data-value='" + entry.userId + "'><a>" + entry.userName + "（" + entry.nickName + "） </a>　</li>");
		});
		//li改变事件
		$("#familyUserId").find('li').click(function() {
			$(".familyUserId").attr('data-value', $(this).attr('data-value'));
			$(".familyUserId").html($(this).find('a').text().trim());
		});
	}
	getFamilyInfo(familyId);
};
/*
 * 功能：根据id查询用户信息
 * 创建人：Liql
 * 创建时间：2018-9-10
 */
function getFamilyInfo(familyid) {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	jsonParam.jsonStr = dataHelper.setJson(null, "familyId", familyid); //昵称
	console.log(jsonParam);
	userInfoServer.getFamilyInfo(jsonParam, callback_getFamilyInfo);
}
/*
 * 功能：根据id查询用户信息回调
 * 创建人：Liql
 * 创建时间：2018-9-10
 */
function callback_getFamilyInfo(data) {
	console.log(data);
	if(data == undefined || data.rspCode == null || data.rspCode != "000") {
		controlsHelper.alert(data.rspDesc);
	} else {
		$("#familyName").val(data.familyName);
		$("#familyPhone").val(data.familyPhone);
		$("#familyEmail").val(data.familyEmail);
		$("#familyAddress").val(data.familyAddress);
		if(data.status == "1") {
			$("#userIsStart").attr("checked", "checked");
			$("#userIsStart").prop("checked", true);
		} else {
			$("#userIsStart").removeAttr("checked");
			$("#userIsStart").prop("checked", false);
		}
		//角色
		if(!dataHelper.isEmpty(data.familyCate)) {
			$("#familyCate").find('li[data-value=' + data.familyCate + ']').click();
		}
		if(!dataHelper.isEmpty(data.familyUserId)) {
			$("#familyUserId").find('li[data-value=' + data.familyUserId + ']').click();
		}

	}
}
/*
 * 功能：修改家庭信息
 * 创建人：Liql
 * 创建时间：2018-09-10
 */
function updateFamily() {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	var jsonstr = dataHelper.setJson(null, "familyId", familyId); //昵称
	jsonstr = dataHelper.setJson(jsonstr, "familyName", $("#familyName").val()); //昵称
	jsonstr = dataHelper.setJson(jsonstr, "familyPhone", $("#familyPhone").val()); //姓名(用户名称)
	jsonstr = dataHelper.setJson(jsonstr, "familyCate", $(".familyCate").attr('data-value')); //手机号
	jsonstr = dataHelper.setJson(jsonstr, "familyUserId", $(".familyUserId").attr('data-value')); //手机号
	jsonstr = dataHelper.setJson(jsonstr, "familyEmail", $("#familyEmail").val()); //邮箱
	jsonstr = dataHelper.setJson(jsonstr, "familyAddress", $("#familyAddress").val()); //家庭住址
	jsonstr = dataHelper.setJson(jsonstr, "status", $("#userIsStart").is(":checked") ? "1" : "2"); //是否启用1--启用 2--禁用
	jsonstr = dataHelper.setJson(jsonstr, "userCreate", dataHelper.isEmpty($.cookie("userName")) ? 'admin' : ""); //创建人为当前用户$.cookie("userName")
	jsonParam.jsonStr = jsonstr;
	console.log(jsonParam);
	userInfoServer.updateFamily(jsonParam, callback_updateFamily);
};

function callback_updateFamily(data) {
	console.log(data);
	if(data == undefined || data.rspCode == null || data.rspCode != "000") {
		controlsHelper.alert(data.rspDesc);
	} else {
		controlsHelper.alert("修改家庭信息成功", "20%");
		location.href = "familyList.html";
	}
};