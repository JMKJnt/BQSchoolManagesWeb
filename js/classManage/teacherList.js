var CurrPage = 1;
var PageSize = 10;
var totalPage; //总页数
var isCreatePage = false;

$(document).ready(function() {
	//查询操作事件
	$("#query").click(function() {
		isCreatePage = false;
		getFanousTeaList('1');
	});
	//添加导师操作事件
	$("#UserAdd").click(function() {
		location.href = 'insertTeacher.html';
	});
	isCreatePage = false;
	getFanousTeaList('1');
});

/*
 * 功能：获取导师列表
 * 创建人：Liql
 * 创建时间：2018-09-10
 */
function getFanousTeaList(CurrPage) {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	var jsonstr = dataHelper.setJson(null, "curragePage", CurrPage.toString()); //当前页码
	jsonstr = dataHelper.setJson(jsonstr, "teacherName", $("#teacherName").val()); //导师名称
	jsonstr = dataHelper.setJson(jsonstr, "teacherKeyword", $("#teacherKeyword").val()); //搜索关键字
	jsonstr = dataHelper.setJson(jsonstr, "teacherPhone", $("#teacherPhone").val()); //导师电话
	jsonstr = dataHelper.setJson(jsonstr, "teacherQualification", $("#teacherQualification").val()); //资质说明
	jsonstr = dataHelper.setJson(jsonstr, "pageSize", PageSize.toString()); //每页显示记录数
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
		var template = $("#teacherListTemplate").html();
		Mustache.parse(template);
		var listT = new Array();
		$.each(data.lists, function(index, entry) {
			var value = JSON.stringify(entry);
			value = dataHelper.setJson(value, "statusName", entry.status == "1" ? "启用" : "禁用");
			listT.push(jQuery.parseJSON(value));
		});
		data.lists = listT;
		var rendered = Mustache.render(template, data);
		$("#teacherList").append(rendered);

		$("#infoTatal").html(data.total);
		$(".updateBtn").click(function() {
			location.href = 'updateTeacher.html?teacherId=' + $(this).attr('data-id');
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
					getClassInfoList(CurrPage);
				}
			});
		}

	}

};