/*
 * 变量
 */
var CurrPage = 1;
var PageSize = 10;
var isCreatePage = false;

/*
 * 功能：码表管理页面加载完毕事件
 * 创建人：liql
 * 创建时间：2015-12-10
 */
$(document).ready(function() {
	//	$("#btnDataInsert").attr('disabled', 'disabled');
	//查询
	$("#searchBtn").click(function() {
		isCreatePage = false;
		CurrPage = 1;
		GetDictionaryInfoList(1);
	});

	//新增主表事件
	$("#btnInsert").click(function() {
		$("#pop1").show();
		$("#pop1").find('input').val('');
	});
	//新增保存事件
	$("#saveBtnInsert").click(function() {
		//保存
		if(fromValidate().form()) {
			InsertDictionaryInfo();
		}
	});
	//修改保存事件
	$("#usaveBtnUpdate").click(function() {
		//保存
		if(fromValidate2().form()) {
			UpdateDictionaryInfo($(this).attr('data-id'));
		}
	});
	//验证初始化
	fromValidate();
	fromValidate2();
});

/*
 * 功能：获取码表主表列表
 * 创建人：liql
 * 创建时间：2015-12-10
 */
function GetDictionaryInfoList(page) {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	var jsonstr = dataHelper.setJson(null, "dictionary_name", $("#conditionName").val()); //码表名称，模糊查询
	jsonstr = dataHelper.setJson(jsonstr, "curragePage", page.toString());
	jsonstr = dataHelper.setJson(jsonstr, "pageSize", PageSize.toString());
	jsonParam.jsonStr = jsonstr;
	console.log(jsonParam);
	dataValueHelper.getDictionaryInfoList(jsonParam, Callback_getDictionaryInfoList);
};
/*
 * 功能：获取码表主表回调函数
 * 创建人：liql
 * 创建时间：2015-12-10
 */
function Callback_getDictionaryInfoList(data) {
	console.log(data);
	if(data.rspCode == null || data.rspCode == undefined || data.rspCode != '000') {
		controlsHelper.alert('获取码表信息失败:' + data.rspDesc);
	} else {
		$("#dictList").html('');
		var template = $("#dictListTemplate").html();
		Mustache.parse(template);
		var rendered = Mustache.render(template, data);
		$("#dictList").append(rendered);

		//事件
		$(".btnUpdate").click(function() {
			$("#pop2").show();
			$("#pop2").find('h4.modal-title').text($(this).attr('data-name') + "——详细信息");
			$("#usaveBtnUpdate").attr('data-id', $(this).attr('data-id'));
			//根据码表id获取码表详细信息
			GetDictionaryInfoByid($(this).attr('data-id'));
		})
		//明细
		$(".btnViewDetail").click(function() {
			location.href = 'dataList.html?dictId=' + $(this).attr('data-id') + "&dictName=" + $(this).attr('data-name');
		})
		$(".total").html(data.total);
		if(!isCreatePage) {
			isCreatePage = true;
			$('.pagination').jqPagination({
				link_string: 'page={page_number}',
				max_page: Math.ceil(data.total / PageSize),
				paged: function(page) {
					console.log("第" + page + "页");
					CurrPage = page;
					//增加一页调用刷新一次
					GetDictionaryInfoList(CurrPage);
				}
			});
		}
	}

};

/*
 * 功能：新增码表主表信息
 * 创建人：liql
 * 创建时间：2015-12-10
 */
function InsertDictionaryInfo() {
	//	var url = baseDataUrl;
	var jsonParam = {
		"marked": "insertDictionaryInfo",
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	var jsonstr = dataHelper.setJson(null, "dictionary_code", $("#dCode").val()); //码表编码
	jsonstr = dataHelper.setJson(jsonstr, "dictionary_name", $("#dName").val()); //码表名称
	jsonstr = dataHelper.setJson(jsonstr, "dictionary_string1", $("#dString1").val());
	jsonstr = dataHelper.setJson(jsonstr, "dictionary_string2", $("#dString2").val());
	jsonstr = dataHelper.setJson(jsonstr, "dictionary_string3", $("#dString3").val());
	jsonstr = dataHelper.setJson(jsonstr, "dictionary_string4", $("#dString4").val());
	jsonstr = dataHelper.setJson(jsonstr, "dictionary_string5", $("#dString5").val());
	jsonstr = dataHelper.setJson(jsonstr, "dictionary_seqno", $("#dSeqno").val());
	jsonstr = dataHelper.setJson(jsonstr, "dictionary_isvalid", $("#selectIsValid").val());
	jsonstr = dataHelper.setJson(jsonstr, "dictionary_remark", $("#dRemark").val());
	jsonParam.jsonStr = jsonstr;
	console.log(jsonParam);
	dataValueHelper.insertDictionaryInfo(jsonParam, Callback_InsertDictionaryInfo);
};
/*
 * 功能：新增主表信息回调函数
 * 创建人：Liql
 * 创建时间：2017-6-11
 */
function Callback_InsertDictionaryInfo(data) {
	console.log(data);
	if(data.rspCode == null || data.rspCode == undefined || data.rspCode != '000') {
		controlsHelper.alert('新增码表信息失败:' + data.rspDesc);
	} else {
		$("#pop1").hide();
		isCreatePage = false;
		CurrPage = 1;
		GetDictionaryInfoList(1);
	}
};

/*
 * 功能：修改码表主表信息
 * 创建人：liql
 * 创建时间：2015-12-10
 */
function UpdateDictionaryInfo(dictId) {
	var jsonParam = {
		//		"marked": "updateDictionaryInfo",
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	var jsonstr = dataHelper.setJson(null, "dictionary_id", dictId); //码表id
	jsonstr = dataHelper.setJson(jsonstr, "dictionary_code", $("#udCode").val()); //码表编码
	jsonstr = dataHelper.setJson(jsonstr, "dictionary_name", $("#udName").val()); //码表名称
	jsonstr = dataHelper.setJson(jsonstr, "dictionary_string1", $("#udString1").val());
	jsonstr = dataHelper.setJson(jsonstr, "dictionary_string2", $("#udString2").val());
	jsonstr = dataHelper.setJson(jsonstr, "dictionary_string3", $("#udString3").val());
	jsonstr = dataHelper.setJson(jsonstr, "dictionary_string4", $("#udString4").val());
	jsonstr = dataHelper.setJson(jsonstr, "dictionary_string5", $("#udString5").val());
	jsonstr = dataHelper.setJson(jsonstr, "dictionary_seqno", $("#udSeqno").val());
	jsonstr = dataHelper.setJson(jsonstr, "dictionary_isvalid", $("#uselectIsValid").val());
	jsonstr = dataHelper.setJson(jsonstr, "dictionary_remark", $("#udRemark").val());
	jsonParam.jsonStr = jsonstr;
	console.log(jsonParam);
	dataValueHelper.updateDictionaryInfo(jsonParam, Callback_UpdateDictionaryInfo);
};
/*
 * 功能：维护信息回调函数
 * 创建人：liql
 * 创建时间：2015-12-10
 */
function Callback_UpdateDictionaryInfo(data) {
	console.log(data);
	if(data.rspCode == null || data.rspCode == undefined || data.rspCode != '000') {
		controlsHelper.alert('修改码表信息失败:' + data.rspDesc);
	} else {
		$("#pop2").hide();
		isCreatePage = false;
		CurrPage = 1;
		GetDictionaryInfoList(1);
	}
};

/*
 * 功能：根据id获取码表主表信息
 * 创建人：liql
 * 创建时间：2015-12-10
 */
function GetDictionaryInfoByid(dictId) {
	var jsonParam = {
		//		"marked": "getDictionaryInfoByid",
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};

	jsonParam.jsonStr = dataHelper.setJson(null, "dictionary_id", dictId); //码表id
	console.log(jsonParam);
	dataValueHelper.getDictionaryInfoByid(jsonParam, Callback_GetDictionaryInfoByid);
};
/*
 * 功能：根据id获取码表主表信息回调
 * 创建人：liql
 * 创建时间：2015-12-10
 */
function Callback_GetDictionaryInfoByid(data) {
	console.log(data);
	if(data.rspCode == null || data.rspCode == undefined || data.rspCode != '000') {
		controlsHelper.alert('获取码表信息失败:' + data.rspDesc);
	} else {
		$("#udCode").val(data.dictionary_code); //码表编码
		$("#udName").val(data.dictionary_name); //码表名称
		$("#udString1").val(data.dictionary_string1);
		$("#udString2").val(data.dictionary_string2);
		$("#udString3").val(data.dictionary_string3);
		$("#udString4").val(data.dictionary_string4);
		$("#udString5").val(data.dictionary_string5);
		$("#udSeqno").val(data.dictionary_seqno);
		$("#uselectIsValid option[value=" + data.dictionary_isvalid + "]").attr("selected", "selected");
		$("#udRemark").val(data.dictionary_remark);

	}
};