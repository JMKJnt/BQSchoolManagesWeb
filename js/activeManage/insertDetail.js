var CurrPage = 1;
var PageSize = 10;
var isCreatePage = false;
var totalPage; //总页数


$(document).ready(function() {
	$.validator.setDefaults({
		debug: true
	});

	//保存新增发券
	$("#saveBtnAll").click(function() {
		
		console.log($('input[name="breakdown"]:checked').val())
		if(fromValidate1().form()) {
			if(!timeHelper.checkEndDate($("#detailStartTime").val(), $("#detailEndTime").val())) {
				controlsHelper.alert("活动开始日期不能大于截止日期");
			} else {
				$("#saveBtnAll").attr('disabled', 'disabled');
				insertDetail();
			}
		}

	})
	//取消
	$("#cancelBtnAll").click(function() {
		if(confirm("是否确定取消?"))
			location.href = "detailList.html";
	})
	//获取活动类型  线上  线下
	dataValueHelper.GetDictionaryDataList("detailCate", "", "", '', callback_getDetailCateData);

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
			detailTheme: {
				required: true
			},
			detailDesc: {
				required: true
			},
			detailStartTime: {
				required: true
			},
			detailEndTime: {
				required: true
			},
			detailZbcode: {
				required: true
			},
			detailTeacher: {
				isRequired: ["请选择导师"]
			}
		},
		/**/
		/* 设置错误信息 */
		messages: {
			detailTheme: {
				required: "请输入明细主题"
			},
			detailDesc: {
				required: "请输入明细详情"
			},
			detailStartTime: {
				required: "请选择活动开始时间"
			},
			detailEndTime: {
				required: "请选择活动结束时间"
			},
			detailZbcode: {
				required: "请输入内容url"
			},
			detailTeacher: {
				isRequired: "请选择导师"
			}
		},
		/* 设置错误信息提示DOM */
		errorPlacement: function(error, element) {
			error.appendTo(element.parent());
		},
	});
};

/*
 * 功能：获取活动类型码表回调
 * 创建人：liql
 * 创建时间：2018-9-12
 */
function callback_getDetailCateData(data) {
	console.log(data);
	if(data.rspCode == null || data.rspCode == undefined || data.rspCode != '000') {
		controlsHelper.alert('获取明细类别失败:' + data.rspDesc);
	} else {
		$("#detailCate").empty();
		$.each(data.lists, function(index, entry) {
			$("#detailCate").append("<label for='level1'><input type='radio' name='optionsRadios' value='" + entry.data_code + "' >" + entry.data_name + "&nbsp;&nbsp </label>");
		});

		//活动类型选择事件
		$("#detailCate").find("input[type=radio]").click(function() {
			$("#detailCate").find("input[type=radio]").removeAttr('checked');
			$("#detailCate").find("input[type=radio]").prop('checked', false);
			$(this).attr("checked", "checked");
			$(this).prop("checked", true);
		});
		$("#detailCate").find("input[type=radio]").eq(0).click();
	}
	//获取导师
	getFanousTeaList();
}

/*
 * 功能：获取导师列表
 * 创建人：Liql
 * 创建时间：2018-09-10
 */
function getFanousTeaList() {
	console.log($('input[name="breakdown"]:checked').val())
	
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
		$("#detailTeacher").empty();
		$(".detailTeacher").html("请选择导师");
		$(".detailTeacher").attr("data-value", "");
		$("#detailTeacher").append("<li value=''><a>请选择导师</a></li>");
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
 * 功能：新增明细信息
 * 创建人：liql
 * 创建时间：2018-9-12
 */
function insertDetail() {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	
	var jsonstr = dataHelper.setJson(null, "detailCate", $("#detailCate").find("input[type=radio][checked=checked]").attr("value")); //活动类型
	jsonstr = dataHelper.setJson(jsonstr, "detailBanner","http://img1.gtimg.com/zibohouse/pics/hv1/134/203/84/5513999.jpg" ); //活动banner$("#imgName1").attr("src")
	jsonstr = dataHelper.setJson(jsonstr, "detailTheme", $("#detailTheme").val()); //活动主题
	jsonstr = dataHelper.setJson(jsonstr, "detailDesc", $("#detailDesc").val()); //活动详情
	jsonstr = dataHelper.setJson(jsonstr, "contentLevel", $('input[name="breakdown"]:checked').val());
	
	jsonstr = dataHelper.setJson(jsonstr, "detailStartTime", $("#detailStartTime").val() + " 00:00:00"); //开始时间
	jsonstr = dataHelper.setJson(jsonstr, "detailEndTime", $("#detailEndTime").val() + " 23:59:59"); //截止时间
	jsonstr = dataHelper.setJson(jsonstr, "detailIsPublic", $("#detailIsPublic").is(":checked") ? "1" : "2"); //是否需要审核
	jsonstr = dataHelper.setJson(jsonstr, "status", $("#userIsStart").is(":checked") ? "1" : "2"); //活动状态
	jsonstr = dataHelper.setJson(jsonstr, "detailTeacherId", $(".detailTeacher").attr("data-value"));
	jsonstr = dataHelper.setJson(jsonstr, "createName", dataHelper.isEmpty($.cookie("userName")) ? 'admin' : $.cookie("userName"));
	jsonstr = dataHelper.setJson(jsonstr, "detailZbcode", $("#detailZbcode").val());
	jsonParam.jsonStr = jsonstr;
	console.log(jsonParam);
	activeInfoServer.insertDetail(jsonParam, callback_insertDetail);
};

/*
 * 功能：新增明细信息回调函数
 * 创建人：liql
 * 创建时间：2018-9-12
 */
function callback_insertDetail(data) {
	console.log(data);
	if(data == undefined || data.rspCode == null || data.rspCode != "000") {
		controlsHelper.alert(data.rspDesc);
	} else {
		controlsHelper.alert("新增活动信息成功");
		location.href = "detailList.html";
	}
	$("#saveBtnAll").removeAttr('disabled');
};