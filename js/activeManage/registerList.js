var CurrPage = 1;
var PageSize = 10;
var totalPage; //总页数
var isCreatePage = false;
var roleTypeList = new Array(); //用户角色
var activeSourceList = new Array(); //活动来源
var progressStatusList = new Array(); //活动参与状态
var activeStatusList = new Array(); //活动状态
var approveStatusList = new Array(); //活动审核状态
var registerId="";

$(document).ready(function() {
	//查询操作事件
	$("#query").click(function() {
		isCreatePage = false;
		getActiveRegisterList('1');
	});
	//审核通过
	$("#btnPass").click(function() {
		updateRegisterStatus(registerId, $(this).attr('data-status'));
	});
	//审核驳回
	$("#ResetPassbtn").click(function() {
		//判断驳回理由是否为空
		updateRegisterStatus(registerId, $(this).attr('data-status'));
	});
	//获取角色列表 码表
	dataValueHelper.GetDictionaryDataList("roleType", "", "", '', callback_getRoleList);

});
/*
 * 功能：获取码表角色列表
 * 创建人：Liql
 * 创建时间：2018-9-13
 */
function callback_getRoleList(data) {
	console.log(data);
	if(data == undefined || data.rspCode != "000" || data.rspCode == null) {
		controlsHelper.alert(data.rspDesc);
	} else {
		roleTypeList = data.lists;
		$("#activeApplicableRole").append("<li value='' ><a>全部</a></li>");
		$.each(data.lists, function(index, entry) {
			$("#activeApplicableRole").append("<li value=" + entry.data_code + "><a>" + entry.data_name + "</a></li>");
		});
		$("#activeApplicableRole").find('li').click(function() {
			$(".activeApplicableRole").attr('data-value', $(this).attr('value'));
			$(".activeApplicableRole").html($(this).find('a').html());
		});
	}
	//获取活动审核状态
	dataValueHelper.GetDictionaryDataList("approveStatus", "", "", '', callback_getapproveStatus);
};
/**
 * 功能：获取码表 活动审核状态列表回调
 * 创建人：liql
 * 创建时间：20148-9-17
 * @param {Object} data
 */
function callback_getapproveStatus(data) {
	console.log(data);
	if(data == undefined || data.rspCode != "000" || data.rspCode == null) {
		controlsHelper.alert(data.rspDesc);
	} else {
		approveStatusList = data.lists;
		$("#registerApproveStatus").append("<li value='' ><a>全部</a></li>");
		$.each(data.lists, function(index, entry) {
			$("#registerApproveStatus").append("<li value=" + entry.data_code + "><a>" + entry.data_name + "</a></li>");
		});
		$("#registerApproveStatus").find('li').click(function() {
			$(".registerApproveStatus").attr('data-value', $(this).attr('value'));
			$(".registerApproveStatus").html($(this).find('a').html());
		});
	}
	dataValueHelper.GetDictionaryDataList("source", "", "", '', callback_getregisterSource);
}

/**
 * 功能：获取码表 活动来源列表回调
 * 创建人：liql
 * 创建时间：20148-9-17
 * @param {Object} data
 */
function callback_getregisterSource(data) {
	console.log(data);
	if(data == undefined || data.rspCode != "000" || data.rspCode == null) {
		controlsHelper.alert(data.rspDesc);
	} else {
		activeSourceList = data.lists;
		$("#registerSource").append("<li value='' ><a>全部</a></li>");
		$.each(data.lists, function(index, entry) {
			$("#registerSource").append("<li value=" + entry.data_code + "><a>" + entry.data_name + "</a></li>");
		});
		$("#registerSource").find('li').click(function() {
			$(".registerSource").attr('data-value', $(this).attr('value'));
			$(".registerSource").html($(this).find('a').html());
		});
	}
	dataValueHelper.GetDictionaryDataList("activeStatus", "", "", '', callback_getactiveStatus);
}
/*
 * 功能：获取码表 活动状态回调
 * 创建人：liql
 * 创建时间20181101
 */
function callback_getactiveStatus(data) {
	console.log(data);
	if(data == undefined || data.rspCode != "000" || data.rspCode == null) {
		controlsHelper.alert(data.rspDesc);
	} else {
		activeStatusList = data.lists;
	}
	//获取活动状态
	dataValueHelper.GetDictionaryDataList("processStatus", "", "", '', callback_getprocessStatus);
};
/**
 * 功能：获取码表 活动动态列表回调
 * 创建人：liql
 * 创建时间：20148-9-17
 * @param {Object} data
 */
function callback_getprocessStatus(data) {
	console.log(data);
	if(data == undefined || data.rspCode != "000" || data.rspCode == null) {
		controlsHelper.alert(data.rspDesc);
	} else {
		progressStatusList = data.lists;
	}
}
/*
 * 功能：获取活动列表
 * 创建人：Liql
 * 创建时间：2018-09-10
 */
function getActiveRegisterList(CurrPage) {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	var jsonstr = dataHelper.setJson(null, "curragePage", CurrPage.toString()); //当前页码
	jsonstr = dataHelper.setJson(jsonstr, "activeName", $("#activeName").val()); //活动名称
	jsonstr = dataHelper.setJson(jsonstr, "activeTheme", $("#activeTheme").val()); //活动主题
	jsonstr = dataHelper.setJson(jsonstr, "signStartTime", $("#signStartTime").val()); //报名开始日期
	jsonstr = dataHelper.setJson(jsonstr, "signEndTime", $("#signEndTime").val()); //报名结束日期
	jsonstr = dataHelper.setJson(jsonstr, "registerSource", $(".registerSource").attr('data-value') == undefined || $(".registerSource").attr('data-value') == null ?
		"" : $(".registerSource").attr('data-value')); //活动类型
	jsonstr = dataHelper.setJson(jsonstr, "registerApproveStatus", $(".registerApproveStatus").attr('data-value') == undefined ||
		$(".registerApproveStatus").attr('data-value') == null ? "" : $(".registerApproveStatus").attr('data-value')); //活动状态
	jsonstr = dataHelper.setJson(jsonstr, "pageSize", PageSize.toString()); //每页显示记录数
	jsonParam.jsonStr = jsonstr;
	console.log(jsonParam);
	activeInfoServer.getActiveRegisterList(jsonParam, callback_getActiveRegisterList);
};
/**
 * 功能：获取活动列表回调
 * 创建人：Liql
 * 创建时间：2018-09-10
 * @param {Object} data
 */
function callback_getActiveRegisterList(data) {
	console.log(data);
	$("#activeList").html('');
	if(data == undefined || data.rspCode != "000" || data.rspCode == null) {
		console.log(data.rspDesc);
		controlsHelper.alert(data.rspDesc);
	} else {
		var template = $("#activeListTemplate").html();
		Mustache.parse(template);
		var listT = new Array();
		$.each(data.lists, function(index, entry) {
			var value = JSON.stringify(entry);
			value = dataHelper.setJson(value, "signTime", entry.signStartTime.substr(0, 10) + "至" + entry.signEndTime.substr(0, 10));
			value = dataHelper.setJson(value, "approveStatusName", getDataName(approveStatusList, entry.approveStatus));
			value = dataHelper.setJson(value, "activeStatusName", getDataName(activeStatusList, entry.activeStatus));
			value = dataHelper.setJson(value, "progressStatusName", getDataName(progressStatusList, entry.registerProgressStatus));
			value = dataHelper.setJson(value, "userRoleName", getDataName(roleTypeList, entry.userRole));
			value = dataHelper.setJson(value, "activeIsApproveName", entry.activeIsApprove == "1" ? "是" : "否");
			value = dataHelper.setJson(value, "statusName", entry.status == "1" ? "启用" : "禁用");
			listT.push(jQuery.parseJSON(value));
		});
		data.lists = listT;
		var rendered = Mustache.render(template, data);
		$("#activeList").append(rendered);

		$("#infoTatal").html(data.total);
		//		$(".updateBtn").click(function() {
		//			location.href = 'updateActive.html?activeId=' + $(this).attr('data-id');
		//		});
		//审核按钮显示
		$("#activeList").find("span.approveBtn").each(function() {
			if(!($(this).attr("data-isApprove") == "1" )) {
				$(this).css("display", "none");
			}
		})
		$(".approveBtn").click(function() {
			//审核弹框
			HideSlider();
			$("#ReasonRetion").show();
			registerId = $(this).attr('data-id');
		});
		$(".total").text(data.total);
		if(!isCreatePage) {
			isCreatePage = true;
			$('.pagination').jqPagination({
				link_string: 'page={page_number}',
				max_page: Math.ceil(data.total / PageSize),
				paged: function(page) {
					console.log("第" + page + "页");
					CurrPage = page;
					//增加一页调用刷新一次
					getActiveRegisterList(CurrPage);
				}
			});
		}

	}

};
/*
 * 功能：获取角色类型
 * 创建人：liql
 * 创建时间：2018-9-14
 */
function getRoleName(code) {
	var name = "";
	var list = code.split(',');
	if(list.length > 0) {
		$.each(list, function(index, entry) {
			$.each(roleTypeList, function(index1, entry1) {
				if(entry == entry1.data_code) {
					name += entry1.data_name + ","
				}
			});
		});
	}
	name = name.length > 0 ? name.substr(0, name.length - 1) : name;
	return name;
}
/*
 * 功能：获取活码表名称
 * 创建人：liql
 * 创建时间：2018-9-14
 */
function getDataName(list, code) {
	var name = "";
	$.each(list, function(index, entry) {
		if(code == entry.data_code) {
			name = entry.data_name;
		}
	})
	return name;
}
/*
 * 功能：修改活动状态
 * 创建人：Liql
 * 创建时间：20181111
 */
function updateRegisterStatus(id, status) {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	var jsonstr = dataHelper.setJson(null, "registerId", id); //活动id
	jsonstr = dataHelper.setJson(jsonstr, "registerApproveStatus", status); //活动状态
	jsonParam.jsonStr = jsonstr;
	console.log(jsonParam);
	activeInfoServer.updateRegisterStatus(jsonParam, callback_updateRegisterStatus);
}
/*
 * 功能：修改活动状态回调
 * 创建人：Liql
 * 创建时间：20181111
 */
function callback_updateRegisterStatus(data) {
	console.log(data);
	if(data == undefined || data.rspCode != "000" || data.rspCode == null) {
		controlsHelper.alert(data.rspDesc);
	} else {
		controlsHelper.alert("操作成功");
		isCreatePage = false;
		getActiveRegisterList('1');
	}
}