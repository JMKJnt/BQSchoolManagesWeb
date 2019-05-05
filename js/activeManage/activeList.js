var CurrPage = 1;
var PageSize = 10;
var totalPage; //总页数
var isCreatePage = false;
var activeCateList = new Array(); //活动类型
var activeStatusList = new Array(); //活动状态
var activeId;

$(document).ready(function() {
	//查询操作事件
	$("#query").click(function() {
		isCreatePage = false;
		getActiveInfoList('1');
	});
	//添加用户操作事件
	$("#activeAdd").click(function() {
		location.href = 'insertActive.html';
	});
	//审核通过
	$("#btnPass").click(function() {
		updateActiveStatus(activeId, $(this).attr('data-status'));
	});
	//审核驳回
	$("#ResetPassbtn").click(function() {
		//判断驳回理由是否为空
		updateActiveStatus(activeId, $(this).attr('data-status'));
	});
	//获取角色列表 码表
	dataValueHelper.GetDictionaryDataList("activeStatus", "", "", '', callback_getActiveStatus);

});

/**
 * 功能：获取码表 活动动态列表回调
 * 创建人：liql
 * 创建时间：20148-9-17
 * @param {Object} data
 */
function callback_getActiveStatus(data) {
	console.log(data);
	if(data == undefined || data.rspCode != "000" || data.rspCode == null) {
		controlsHelper.alert(data.rspDesc);
	} else {
		activeStatusList = data.lists;
		$("#activeStatus").append("<li value='' ><a>全部</a></li>");
		$.each(data.lists, function(index, entry) {
			$("#activeStatus").append("<li value=" + entry.data_code + "><a>" + entry.data_name + "</a></li>");
		});
		$("#activeStatus").find('li').click(function() {
			$(".activeStatus").attr('data-value', $(this).attr('value'));
			$(".activeStatus").html($(this).find('a').html());
		});
	}
	dataValueHelper.GetDictionaryDataList("activeCate", "", "", '', callback_getActiveCate);
}
/**
 * 功能：获取码表 活动类型列表回调
 * 创建人：liql
 * 创建时间：20148-9-17
 * @param {Object} data
 */
function callback_getActiveCate(data) {
	console.log(data);
	if(data == undefined || data.rspCode != "000" || data.rspCode == null) {
		controlsHelper.alert(data.rspDesc);
	} else {
		activeCateList = data.lists;
		$("#activeCate").append("<li value='' ><a>全部</a></li>");
		$.each(data.lists, function(index, entry) {
			$("#activeCate").append("<li value=" + entry.data_code + "><a>" + entry.data_name + "</a></li>");
		});
		$("#activeCate").find('li').click(function() {
			$(".activeCate").attr('data-value', $(this).attr('value'));
			$(".activeCate").html($(this).find('a').html());
		});
	}
}
/*
 * 功能：获取活动列表
 * 创建人：Liql
 * 创建时间：2018-09-10
 */
function getActiveInfoList(CurrPage) {
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
	jsonstr = dataHelper.setJson(jsonstr, "activeCate", $(".activeCate").attr('data-value')); //活动类型
	jsonstr = dataHelper.setJson(jsonstr, "activeStatus", $(".activeStatus").attr('data-value')); //活动状态
	jsonstr = dataHelper.setJson(jsonstr, "pageSize", PageSize.toString()); //每页显示记录数
	jsonParam.jsonStr = jsonstr;
	console.log(jsonParam);
	activeInfoServer.getActiveInfoList(jsonParam, callback_getActiveInfoList);
};
/**
 * 功能：获取活动列表回调
 * 创建人：Liql
 * 创建时间：2018-09-10
 * @param {Object} data
 */
function callback_getActiveInfoList(data) {
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
//			value = dataHelper.setJson(value, "activeTime", entry.activeStartTime.substr(0, 10) + "至" + entry.activeEndTime.substr(0, 10));
//			value = dataHelper.setJson(value, "activeRoleName", getRoleName(entry.activeApplicableRole));
			value = dataHelper.setJson(value, "activeCateName", getDataName(activeCateList, entry.activeCate));
			value = dataHelper.setJson(value, "activeStatusName", getDataName(activeStatusList, entry.activeStatus));
			value = dataHelper.setJson(value, "activeIsApproveName", entry.activeIsApprove == "1" ? "是" : "否");
			value = dataHelper.setJson(value, "statusName", entry.status == "1" ? "启用" : "禁用");
			listT.push(jQuery.parseJSON(value));
		});
		data.lists = listT;
		var rendered = Mustache.render(template, data);
		$("#activeList").append(rendered);

		$("#infoTatal").html(data.total);
		$(".updateBtn").click(function() {
			location.href = 'updateActive.html?activeId=' + $(this).attr('data-id');
		});
		//审核按钮显示
		$("#activeList").find("span.approveBtn").each(function() {
			if(!($(this).attr("data-isApprove") == "1" && $(this).attr("data-astatus") == "1")) {
				$(this).css("display", "none");
			}
		})
		$(".approveBtn").click(function() {
			//审核弹框
			HideSlider();
			$("#ReasonRetion").show();
			activeId = $(this).attr('data-id');
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
					getActiveInfoList(CurrPage);
				}
			});
		}

	}

};

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
function updateActiveStatus(id, status) {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	var jsonstr = dataHelper.setJson(null, "activeId", id); //活动id
	jsonstr = dataHelper.setJson(jsonstr, "activeStatus", status); //活动状态
	jsonParam.jsonStr = jsonstr;
	console.log(jsonParam);
	activeInfoServer.updateActiveStatus(jsonParam, callback_updateActiveStatus);
}
/*
 * 功能：修改活动状态回调
 * 创建人：Liql
 * 创建时间：20181111
 */
function callback_updateActiveStatus(data) {
	console.log(data);
	if(data == undefined || data.rspCode != "000" || data.rspCode == null) {
		controlsHelper.alert(data.rspDesc);
	} else {
		controlsHelper.alert("操作成功");
		isCreatePage = false;
		getActiveInfoList('1');
	}
}