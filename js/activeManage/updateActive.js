var CurrPage = 1;
var PageSize = 10;
var isCreatePage = false;
var totalPage; //总页数
var detailCateList = new Array(); //角色
var detailList = new Array(); //导师
var activeId; //活动id

$(document).ready(function() {
	$.validator.setDefaults({
		debug: true
	});

	activeId = dataHelper.QueryString("activeId");

	//查看导师
	$("#ViewDetail").click(function() {
		//根据门店名称搜索，内部搜索
		$("#teacherList").find('tr').each(function() {
			var sName = $(this).find('td:eq(1)').html();
			if(sName.indexOf($('#detailTheme').val().trim()) < 0) {
				$(this).hide();
			} else {
				$(this).show();
			}
		})
	});
	//导师全选
	$("#allChecked").click(function() {
		if(!$(this).prop('checked')) {
			$(this).prop('checked', false);
			$(this).removeAttr('checked');
			$("#detailList").find('input[type=checkbox]').removeAttr('checked');
			$("#detailList").find('input[type=checkbox]').prop('checked', false);
			$("#detailList").find('input[type=checkbox]').attr('data-value', '0');
		} else {
			$(this).prop('checked', true);
			$(this).attr('checked', 'checked');
			$("#detailList").find('input[type=checkbox]').attr('checked', 'checked');
			$("#detailList").find('input[type=checkbox]').prop('checked', true);
			$("#detailList").find('input[type=checkbox]').attr('data-value', '1');
		}
		//显示已选择家数
		$("#detailCheckedCount").html($("#detailList").find('input[type=checkbox][checked=checked]').length);
	});
	//导航
	$(".box-nav>div").click(function() {
		//切换时判断必填项验证
		switch($(this).attr('data-value')) {
			case '2':
			case '3':
				if(fromValidate1().form()) {
					if($("#activeClassNum").find("input[type=checkbox][checked=checked]").length <= 0) {
						controlsHelper.alert("请选择活动适用班级");
					} else if(!timeHelper.checkEndDate($("#signStartTime").val(), $("#signEndTime").val())) {
						controlsHelper.alert("报名开始日期不能大于截止日期");
					} else {
						$(".box-header>div").hide();
						$(".box-header div[data-value=" + $(this).attr('data-value') + "]").show();
					}
				}
				break;
			default:
				$(".box-header>div").hide();
				$(".box-header div[data-value=" + $(this).attr('data-value') + "]").show();
				break;
		}

	})
	//下一步1 基本信息
	$(".nextBtn").click(function() {
		if(fromValidate1().form()) {
			if($("#activeClassNum").find("input[type=checkbox][checked=checked]").length <= 0) {
				controlsHelper.alert("请选择活动适用班级");
			} else if(!timeHelper.checkEndDate($("#signStartTime").val(), $("#signEndTime").val())) {
				controlsHelper.alert("报名开始日期不能大于截止日期");
			} else {
				nextTab($(this));
			}
		}
	});

	//保存新增发券
	$("#saveBtnAll").click(function() {
		//判断是否选择活动门店
		if(parseInt($("#detailCheckedCount").text()) <= 0) {
			controlsHelper.alert('请选择活动细目');
		} else {
			$("#saveBtnAll").attr('disabled', 'disabled');
			updateActive();
		}
	})
	//取消
	$("#cancelBtnAll").click(function() {
		if(confirm("是否确定取消?"))
			location.href = "activeList.html";
	})
	//获取活动类型  线上  线下
	dataValueHelper.GetDictionaryDataList("activeCate", "", "", '', callback_getactiveCateData);

	fromValidate1();
});
/*
 * 功能:基本信息验证
 * 创建人：liql
 * 创建时间：2016-12-21
 */
function fromValidate1() {
	return $("#signupForm1").validate({
		/* 设置验证规则 */
		rules: {
			activeName: {
				required: true
			},
			activeTheme: {
				required: true
			},
			activeDetail: {
				required: true
			},
			signStartTime: {
				required: true
			},
			signEndTime: {
				required: true
			},
			activeSeq: {
				required: true,
				isInteger: true
			},
			activeNumCy: {
				required: true,
				isInteger: true
			}
		},
		/**/
		/* 设置错误信息 */
		messages: {
			activeName: {
				required: "请输入活动名称"
			},
			activeTheme: {
				required: "请输入活动主题"
			},
			activeDetail: {
				required: "请输入活动详情"
			},
			signStartTime: {
				required: "请选择报名开始时间"
			},
			signEndTime: {
				required: "请选择报名结束时间"
			},
			activeSeq: {
				required: "请输入活动顺序",
				isInteger: "只能输入整数"
			},
			activeNumCy: {
				required: "请输入活动顺序",
				isInteger: "只能输入整数"
			}
		},
		/* 设置错误信息提示DOM */
		errorPlacement: function(error, element) {
			error.appendTo(element.parent());
		},
	});
};

/*
 * 功能：下一步切换
 * 创建人：Liql
 * 创建时间：2017-12-7
 */
function nextTab(elem) {
	var values = parseInt(elem.attr('data-value')) + 1;
	console.log(values);
	$(".box-header>div").hide();
	$(".box-header div[data-value=" + values + "]").show();
	$(".box-nav div[data-value=" + values + "]").addClass('nav-select');
	$(".box-nav div[data-value=" + values + "]").prev().find('div.nav-tail').addClass('nav-select')
	$(".box-nav div[data-value=" + values + "]").find('span').addClass('nav-tail-select');
}
/*
 * 功能：获取活动类型码表回调
 * 创建人：liql
 * 创建时间：2018-9-12
 */
function callback_getactiveCateData(data) {
	console.log(data);
	if(data.rspCode == null || data.rspCode == undefined || data.rspCode != '000') {
		controlsHelper.alert('获取活动类别失败:' + data.rspDesc);
	} else {
		$("#activeCate").empty();
		$.each(data.lists, function(index, entry) {
			$("#activeCate").append("<label for='level1'><input type='radio' name='optionsRadios' value='" + entry.data_code +
				"' >" + entry.data_name + "&nbsp;&nbsp </label>");
		});

		//活动类型选择事件
		$("#activeCate").find("input[type=radio]").click(function() {
			$("#activeCate").find("input[type=radio]").removeAttr('checked');
			$("#activeCate").find("input[type=radio]").prop('checked', false);
			$(this).attr("checked", "checked");
			$(this).prop("checked", true);
		});
		$("#activeCate").find("input[type=radio]").eq(0).click();
	}
	//获取班级年段
	dataValueHelper.GetDictionaryDataList("classDivision", "", "", '', callback_getclassDivision);
}
/*
 * 功能：班级回调
 * 创建人：liql
 * 创建时间：2019-04-03
 */
function callback_getclassDivision(data) {
	console.log(data);
	if(data.rspCode == null || data.rspCode == undefined || data.rspCode != '000') {
		controlsHelper.alert('获取班级年段信息失败:' + data.rspDesc);
	} else {
		$.each(data.lists, function(index, entry) {
			$("#activeClassNum").append("<input type=checkbox name=optionsRadios data-value='" + entry.data_code + "' > " + entry.data_name + "  &nbsp;&nbsp;");
		})

		//改变事件
		$("#activeClassNum").find("input[type=checkbox]").click(function() {
			if($(this).attr('checked') == "checked") {
				$(this).removeAttr("checked");
				$(this).prop("checked", false);
			} else {
				$(this).attr("checked", "checked");
				$(this).prop("checked", true);
			}
		});
		//获取细目类别 detaiCate
		dataValueHelper.GetDictionaryDataList("detaiCate", "", "", '', callback_getdetaiCateData);

	}
}

/*
 * 功能：获取细目类别 detaiCate回调函数
 * 创建人：liql
 * 创建时间：20190318
 */
function callback_getdetaiCateData(data) {
	if(data == undefined || data.rspCode != "000" || data.rspCode == null) {
		console.log(data.rspDesc);
		controlsHelper.alert(data.rspDesc);
	} else {
		detailCateList = data.lists;
	}
	getDetailInfoList();
}
/*
 * 功能：获取活动列表
 * 创建人：Liql
 * 创建时间：2018-09-10
 */
function getDetailInfoList() {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	var jsonstr = dataHelper.setJson(null, "curragePage", '1'); //当前页码
	jsonstr = dataHelper.setJson(jsonstr, "detailTheme", ''); //活动主题
	jsonstr = dataHelper.setJson(jsonstr, "detailStartTime", ''); //活动开始日期
	jsonstr = dataHelper.setJson(jsonstr, "detailEndTime", ''); //活动结束日期
	jsonstr = dataHelper.setJson(jsonstr, "detailTeacherId", ''); //适用于角色
	jsonstr = dataHelper.setJson(jsonstr, "detailCate", ''); //活动类型
	jsonstr = dataHelper.setJson(jsonstr, "pageSize", '9999999'); //每页显示记录数
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
			value = dataHelper.setJson(value, "detailTime", entry.detailStartTime.substr(0, 10) + "至" + entry.detailEndTime.substr(
				0, 10));
			value = dataHelper.setJson(value, "detailIsPublicName", entry.detailIsPublic == "1" ? "是" : "否");
			value = dataHelper.setJson(value, "detailCateName", getDataName(detailCateList, entry.detailCate));
			listT.push(jQuery.parseJSON(value));
		});
		data.lists = listT;
		var rendered = Mustache.render(template, data);
		$("#detailList").append(rendered);

		$("#TotalNumberDetail").html(data.total);

		//处理选择细目
		$("#detailList").find('input[type=checkbox]').click(function() {
			if($(this).prop('checked')) {
				$(this).prop('checked', true);
				$(this).attr('checked', 'checked')
				$(this).attr('data-value', '1');
			} else {
				$(this).prop('checked', false);
				$(this).removeAttr('checked');
				$(this).attr('data-value', '0');
			}
			//显示已选择家数
			$("#detailCheckedCount").html($("#detailList").find('input[type=checkbox][checked=checked]').length);
		});

	}
	//根据id获取活动信息
	getActiveInfoById();
};
/*
 * 功能：获取活动信息
 * 创建人：liql
 * 创建时间：2018-9-17
 */
function getActiveInfoById() {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	jsonParam.jsonStr = dataHelper.setJson(null, "activeId", activeId); //班级id
	console.log(jsonParam);
	activeInfoServer.getActiveInfoById(jsonParam, callback_getActiveInfoById);
}
/*
 * 功能：获取活动信息回调
 * 创建人：liql
 * 创建时间：20148-9-17
 */
function callback_getActiveInfoById(data) {
	console.log(data);
	if(data == undefined || data.rspCode != "000" || data.rspCode == null) {
		controlsHelper.alert("获取活动信息失败：" + data.rspDesc);
	} else {
		if(data.activeBanner != "") {
			$(".imgName1").attr("src", data.activeBanner);
			$("#imgName1").attr("src", data.activeBanner);
			$("#imgName1").attr("data-filepath", data.actactiveBanner);
		}

		$("#activeName").val(data.activeName); //活动名称
		$("#activeTheme").val(data.activeTheme);
		$("#activeDetail").val(data.activeDetail);
		$("#signStartTime").val(data.signStartTime.substr(0, 10));
		$("#signEndTime").val(data.signEndTime.substr(0, 10));
		//		$("#activeStartTime").val(data.activeStartTime.substr(0, 10));
		//		$("#activeEndTime").val(data.activeEndTime.substr(0, 10));
		$("#activityTemplate").val(data.activityTemplate);
		$("#activeSeq").val(data.activeSeq);
		$("#activeNumCy").val(data.activeNumCy);


		//第几期活动赋值
		$("#activityHase_id").val(data.activityHase);


		if(data.activeIsApprove == "1") {
			$("#activeIsApprove").attr("checked", "checked");
			$("#activeIsApprove").prop("checked", true);
		} else {
			$("#activeIsApprove").removeAttr("checked");
			$("#activeIsApprove").prop("checked", false);
		}
		if(data.activeIsQuestion == "1") {
			$("#activeIsQuestion").attr("checked", "checked");
			$("#activeIsQuestion").prop("checked", true);
		} else {
			$("#activeIsQuestion").removeAttr("checked");
			$("#activeIsQuestion").prop("checked", false);
		}
		if(data.status == "1") {
			$("#userIsStart").attr("checked", "checked");
			$("#userIsStart").prop("checked", true);
		} else {
			$("#userIsStart").removeAttr("checked");
			$("#userIsStart").prop("checked", false);
		}
		$("#activeCate").find("input[type=radio]").removeAttr('checked');
		$("#activeCate").find("input[type=radio]").prop("checled", false);
		$("#activeCate").find("input[type=radio][value=" + data.activeCate + "]").attr("checked", "checked");
		$("#activeCate").find("input[type=radio][value=" + data.activeCate + "]").prop("checked", true);

		//用户角色
		$("#activeClassNum").find("input[type=checkebox]").removeAttr('checked');
		$("#activeClassNum").find("input[type=checkebox]").prop("checled", false);
		var roleL = data.activeClassNum.split(",");
		$.each(roleL, function(index, entry) {
			$("#activeClassNum").find("input[type=checkbox]").each(function() {
				if(entry == $(this).attr("data-value")) {
					$(this).attr("checked", "checked");
					$(this).prop("checked", true);
				}
			})
		});
		//加载导师
		$.each(data.detailList, function(index, entry) {
			$("#detailList").find("td").each(function() {
				if(entry.detailId == $(this).attr("data-id")) {
					$(this).find("input[type=checkbox]").attr('checked', "checked");
					$(this).find("input[type=checkbox]").prop("checked", true);
				}
			})
		});
		//显示已选择家数
		$("#detailCheckedCount").html($("#detailList").find('input[type=checkbox][checked=checked]').length);
	}
}
/*
 * 功能：修改活动信息
 * 创建人：liql
 * 创建时间：2018-9-12
 */
function updateActive() {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	var jsonstr = dataHelper.setJson(null, "activeId", activeId); //班级id
	jsonstr = dataHelper.setJson(jsonstr, "activeCate", $("#activeCate").find("input[type=radio][checked=checked]").attr(
		"value")); //活动类型
	jsonstr = dataHelper.setJson(jsonstr, "activeBanner", $("#imgName1").attr("src")); //活动banner
	jsonstr = dataHelper.setJson(jsonstr, "activeName", $("#activeName").val()); //活动名称
	jsonstr = dataHelper.setJson(jsonstr, "activeTheme", $("#activeTheme").val()); //活动主题
	jsonstr = dataHelper.setJson(jsonstr, "activeDetail", $("#activeDetail").val()); //活动详情
	jsonstr = dataHelper.setJson(jsonstr, "activeHeadStr", $("#activeHeadStr").val()); //活动开头

	var activeClassNum = "";
	$("#activeClassNum").find("input[type=checkbox]").each(function() {
		if($(this).attr("checked") == "checked") {
			activeClassNum += $(this).attr("data-value") + ",";
		}
	})
	activeClassNum = activeClassNum.length > 0 && activeClassNum.substr(activeClassNum.length - 1, 1) == "," ?
		activeClassNum.substr(0, activeClassNum.length - 1) : activeClassNum;
	jsonstr = dataHelper.setJson(jsonstr, 'activeClassNum', activeClassNum);
	jsonstr = dataHelper.setJson(jsonstr, "signStartTime", $("#signStartTime").val() + " 00:00:00"); //报名开始时间
	jsonstr = dataHelper.setJson(jsonstr, "signEndTime", $("#signEndTime").val() + " 23:59:59"); //报名结束时间
	//	jsonstr = dataHelper.setJson(jsonstr, "activeStartTime", $("#activeStartTime").val() + " 00:00:00"); //开始时间
	//	jsonstr = dataHelper.setJson(jsonstr, "activeEndTime", $("#activeEndTime").val() + " 23:59:59"); //截止时间
	jsonstr = dataHelper.setJson(jsonstr, "activeIsApprove", $("#activeIsApprove").is(":checked") ? "1" : "2"); //是否需要审核
	jsonstr = dataHelper.setJson(jsonstr, "status", $("#userIsStart").is(":checked") ? "1" : "2"); //活动状态
	//活动导师列表
	jsonstr = dataHelper.setJson(jsonstr, "detailList", getDetailList());
	jsonstr = dataHelper.setJson(jsonstr, "activeUpdate", "admin"); //$.cookie("userName")
	jsonstr = dataHelper.setJson(jsonstr, "activeIsQuestion", $("#activeIsQuestion").is(":checked") ? "1" : "2");
	jsonstr = dataHelper.setJson(jsonstr, "activeQusetion", "");
	jsonstr = dataHelper.setJson(jsonstr, "activeSeq", $("#activeSeq").val());
	jsonstr = dataHelper.setJson(jsonstr, "activeNumCy", $("#activeNumCy").val());
	jsonstr = dataHelper.setJson(jsonstr, "activityTemplate", $("#activityTemplate").val());
	jsonParam.jsonStr = jsonstr;
	console.log(jsonParam);
	activeInfoServer.updateActive(jsonParam, callback_updateActive);
};

/*
 * 功能：修改活动信息回调函数
 * 创建人：liql
 * 创建时间：2018-9-12
 */
function callback_updateActive(data) {
	console.log(data);
	if(data == undefined || data.rspCode == null || data.rspCode != "000") {
		controlsHelper.alert(data.rspDesc);
	} else {
		controlsHelper.alert("保存活动信息成功");
		location.href = "activeList.html";
	}
	$("#saveBtnAll").removeAttr('disabled');
};
/*
 * 功能：获取选择导师列表
 * 创建人：liql
 * 创建时间：2018-9-12
 */
function getDetailList() {
	var listT = new Array();
	$("#detailList").find("input[type=checkbox]").each(function() {
		if($(this).attr("checked") == "checked") {
			var value = dataHelper.setJson(null, "detailId", $(this).attr("data-id"));
			listT.push(jQuery.parseJSON(value));
		}
	})
	return listT;
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