var CurrPage = 1;
var PageSize = 10;
var totalPage; //总页数
var isCreatePage = false;
var detailCateList = new Array(); //活动类型
var detailTeacherList = new Array(); //活动状态
var activeId;

$(document).ready(function() {
	//查询操作事件
	$("#query").click(function() {
		isCreatePage = false;
		getDetailInfoList('1');
	});
	//添加用户操作事件
	$("#detailAdd").click(function() {
		location.href = 'insertDetail.html';
	});
	//获取角色列表 码表
	dataValueHelper.GetDictionaryDataList("detailCate", "", "", '', callback_getdetailCate);

});

/**
 * 功能：获取码表 活动类型列表回调
 * 创建人：liql
 * 创建时间：20148-9-17
 * @param {Object} data
 */
function callback_getdetailCate(data) {
	console.log(data);
	if(data == undefined || data.rspCode != "000" || data.rspCode == null) {
		controlsHelper.alert(data.rspDesc);
	} else {
		detailCateList = data.lists;
		$("#detailCate").append("<li value='' ><a>全部</a></li>");
		$.each(data.lists, function(index, entry) {
			$("#detailCate").append("<li value=" + entry.data_code + "><a>" + entry.data_name + "</a></li>");
		});
		$("#detailCate").find('li').click(function() {
			$(".detailCate").attr('data-value', $(this).attr('value'));
			$(".detailCate").html($(this).find('a').html());
		});
	}
	getFanousTeaList();
}

/*
 * 功能：获取导师列表
 * 创建人：Liql
 * 创建时间：2018-09-10
 */
function getFanousTeaList() {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	var jsonstr = dataHelper.setJson(null, "curragePage", "1"); //当前页码
	jsonstr = dataHelper.setJson(jsonstr, "teacherName", ""); //导师名称
	jsonstr = dataHelper.setJson(jsonstr, "status", "1"); //启用
	jsonstr = dataHelper.setJson(jsonstr, "pageSize", "9999999"); //每页显示记录数
	jsonParam.jsonStr = jsonstr;
	console.log(jsonParam);
	classInfoServer.getFanousTeaList(jsonParam, callback_getFanousTeaList);
};
/**
 * 功能：获取导师列表回调
 * 创建人：Liql
 * 创建时间：2018-09-10
 * @param {Object} data
 */
function callback_getFanousTeaList(data) {
	console.log(data);
	$("#teacherList").html('');
	if(data == undefined || data.rspCode != "000" || data.rspCode == null) {
		console.log(data.rspDesc);
		controlsHelper.alert(data.rspDesc);
	} else {
		detailTeacherList=data.lists;
		$("#detailTeacher").empty();
		$(".detailTeacher").html("全部");
		$(".detailTeacher").attr("data-value", "");
		$("#detailTeacher").append("<li value=''><a>全部</a></li>");
		$.each(data.lists, function(index, entry) {
			$("#detailTeacher").append("<li value=" + entry.teacherId + "><a>" + entry.teacherName + " </a></li>");
		});
		//老师点击
		$("#detailTeacher").find("li").click(function() {
			$(".detailTeacher").html($(this).find("a").html());
			$(".detailTeacher").attr("data-value", $(this).attr('value'));
		});
	}
};
/*
 * 功能：获取活动列表
 * 创建人：Liql
 * 创建时间：2018-09-10
 */
function getDetailInfoList(CurrPage) {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	var jsonstr = dataHelper.setJson(null, "curragePage", CurrPage.toString()); //当前页码
	jsonstr = dataHelper.setJson(jsonstr, "detailTheme", $("#detailTheme").val()); //活动主题
	jsonstr = dataHelper.setJson(jsonstr, "detailStartTime", $("#activeStartTime").val()); //活动开始日期
	jsonstr = dataHelper.setJson(jsonstr, "detailEndTime", $("#activeEndTime").val()); //活动结束日期
	jsonstr = dataHelper.setJson(jsonstr, "detailTeacherId", $(".detailTeacher").attr('data-value')); //适用于角色
	jsonstr = dataHelper.setJson(jsonstr, "detailCate", $(".detailCate").attr('data-value')); //活动类型
	jsonstr = dataHelper.setJson(jsonstr, "pageSize", PageSize.toString()); //每页显示记录数
	jsonParam.jsonStr = jsonstr;
	console.log(jsonParam);
	activeInfoServer.getDetailInfoList(jsonParam, callback_getDetailInfoList);
};
/**
 * 功能：获取活动列表回调
 * 创建人：Liql
 * 创建时间：2018-09-10
 * @param {Object} data
 */
function callback_getDetailInfoList(data) {
	console.log(data);
	$("#detailList").html('');
	if(data == undefined || data.rspCode != "000" || data.rspCode == null) {
		console.log(data.rspDesc);
		controlsHelper.alert(data.rspDesc);
	} else {
		var template = $("#detailListTemplate").html();
		Mustache.parse(template);
		var listT = new Array();
		$.each(data.lists, function(index, entry) {
			var value = JSON.stringify(entry);
			value = dataHelper.setJson(value, "detailTime", entry.detailStartTime.substr(0, 10) + "至" + entry.detailEndTime.substr(0, 10));
			var name=detailTeacherList.find(o=>o.teacherId==entry.detailTeacherId);
			value = dataHelper.setJson(value, "detailTeacherName", dataHelper.isEmpty(name)?"":name.teacherName);
			value = dataHelper.setJson(value, "detailCateName", getDataName(detailCateList, entry.detailCate));
			value = dataHelper.setJson(value, "detailIsPublicName", entry.detailIsPublic == "1" ? "是" : "否");
			value = dataHelper.setJson(value, "statusName", entry.status == "1" ? "启用" : "禁用");
			listT.push(jQuery.parseJSON(value));
		});
		data.lists = listT;
		var rendered = Mustache.render(template, data);
		$("#detailList").append(rendered);

		$("#infoTatal").html(data.total);
		$(".updateBtn").click(function() {
			location.href = 'updateDetail.html?detailId=' + $(this).attr('data-id');
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
					getDetailInfoList(CurrPage);
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
