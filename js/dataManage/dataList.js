/*
 * 变量
 */
var dictName;
var dictId;
var dictCodeTitket;
/*
 * 功能：码表管理页面加载完毕事件
 * 创建人：liql
 * 创建时间：2015-12-10
 */
$(document).ready(function() {
	dictId = dataHelper.QueryString("dictId");
	dictName = decodeURI(dataHelper.QueryString("dictName"));
	$("#conditionName").text(dictName);
	$("#dictionary").text(dictName);
	$("#dictionary").attr('data-id', dictId);
	$("#udictionary").text(dictName);
	$("#udictionary").attr('data-id', dictId);
	//根据主表id查询子表列表信息
	GetDictionaryDataInfoList(dictId);
	//查询子表列表信息
	$("#searchBtn").click(function() {
		GetDictionaryDataInfoList(dictId);
	});
	//添加子表信息
	$("#btnInsert").click(function() {
		$("#pop2").find('input').val('');
		$("#pop2").show();
	});
	//新增保存事件
	$("#saveBtnInsert").click(function() {
		if(fromValidate().form()) {
			InsertDictionaryDataInfo();
		}
	});
	//修改保存事件
	$("#saveBtnUpdate").click(function() {
		if(fromValidate2().form()) {
			UpdateDictionaryDataInfo($("#saveBtnUpdate").attr('data-id'));
		}
	});

	fromValidate();
	fromValidate2();
});
/*
 * 功能：获取渠道信息回调函数
 * 创建人：liql
 * 创建时间：2017-6-11
 */
function GetDictionaryDataListCallback(data) {
	console.log(data);
	if(data.rspCode == null || data.rspCode == undefined || data.rspCode != '000') {
		controlsHelper.alert('获取卡券渠道信息失败:' + data.rspDesc);
	} else {
		$('#selectChannel').empty();
		$('#selectChannel').append("<option value=''>所有渠道</option>");
		$.each(data.lists, function(index, entry) {
			$('#selectChannel').append("<option value=" + entry.data_code + ">" + entry.data_name + "</option>");
		});
	}
}
/*
 * 功能：验证卡券是否已经存在渠道
 * 创建人：liql
 * 创建时间：2016-3-18
 */
function valiteSingle() {
	var isExist = false;
	$("#tiketList").find('td').each(function() {
		if($(this).attr('data-id') == $("#selectChannel").val()) {
			isExist = true;
		}
	});
	return isExist;
};
/*
 * 功能：根据主表id获取码表明细
 * 创建人：liql
 * 创建时间：2015-12-10
 */
function GetDictionaryDataInfoList(dictId) {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};

	jsonParam.jsonStr = dataHelper.setJson(null, "data_dictionary", dictId); //码表id
	console.log(jsonParam);
	dataValueHelper.getDictionaryDataInfoList(jsonParam, Callback_getDictionaryDataInfoList);
};
/*
 * 功能：根据主表id获取码表明细回调函数
 * 创建人：liql
 * 创建时间：2015-12-10
 */
function Callback_getDictionaryDataInfoList(data) {
	console.log(data);
	if(data.rspCode == null || data.rspCode == undefined || data.rspCode != '000') {
		controlsHelper.alert('获取码表子表信息失败:' + data.rspDesc);
	} else {
		$("#dataList").html('');
		var template = $("#dataListTemplate").html();
		Mustache.parse(template);
		var testa = new Array();
		$.each(data.lists, function(entryIndex, entry) {
			var viewdata = JSON.stringify(entry);
			viewdata = dataHelper.setJson(viewdata, "data_dictName", dictName);
			entry = jQuery.parseJSON(viewdata);
			testa.push(entry);

		});
		//清空原数据数组
		data.lists.splice(0, data.lists.length);
		data.lists = testa;
		var rendered = Mustache.render(template, data);
		$("#dataList").append(rendered);

		$("#dataList").find('span').each(function() {
			if($(this).attr('data-nameP') == '卡券类型') {
				$(this).css('display', 'inline-block');
			}
		});

		//事件
		$(".btnDataUpdate").click(function() {
			$("#pop3").show();
			$("#pop3").find('h4.modal-title').text($(this).attr('data-name') + "——详细信息");
			$("#saveBtnUpdate").attr('data-id', $(this).attr("data-id"));
			GetDictionaryDataInfoByid($(this).attr("data-id"));
		});

	}
	//获取渠道信息
	dataValueHelper.GetDictionaryDataList("publishChannel", '', '', '', GetDictionaryDataListCallback);
};
/*
 * 功能：新增码表子表接口信息
 * 创建人：liql
 * 创建时间：2015-12-10
 */
function InsertDictionaryDataInfo() {
	var jsonParam = {
		//		"marked": "insertDictionaryDataInfo",
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	var jsonstr = dataHelper.setJson(null, "data_code", $("#dCode").val()); //码表编码
	jsonstr = dataHelper.setJson(jsonstr, "data_name", $("#dName").val()); //码表名称
	jsonstr = dataHelper.setJson(jsonstr, "data_parent_id", ''); //码表上级
	jsonstr = dataHelper.setJson(jsonstr, "data_dictionary", dictId); //码表主表
	jsonstr = dataHelper.setJson(jsonstr, "data_string1", $("#dString1").val());
	jsonstr = dataHelper.setJson(jsonstr, "data_string2", $("#dString2").val());
	jsonstr = dataHelper.setJson(jsonstr, "data_string3", $("#dString3").val());
	jsonstr = dataHelper.setJson(jsonstr, "data_string4", $("#dString4").val());
	jsonstr = dataHelper.setJson(jsonstr, "data_string5", $("#dString5").val());
	jsonstr = dataHelper.setJson(jsonstr, "data_seqno", $("#dSeqno").val() == "" ? 0 : parseInt($("#dSeqno").val()));
	jsonstr = dataHelper.setJson(jsonstr, "data_isvalid", $("#selectIsValid").val());
	jsonstr = dataHelper.setJson(jsonstr, "data_remark", $("#dRemark").val());
	jsonParam.jsonStr = jsonstr;
	console.log(jsonParam);
	dataValueHelper.insertDictionaryDataInfo(jsonParam, Callback_InsertDictionaryDataInfo);
};
/*
 * 功能：新增子表信息回调函数
 * 创建人：Liql
 * 创建时间：2017-6-11
 */
function Callback_InsertDictionaryDataInfo(data) {
	console.log(data);
	if(data.rspCode == null || data.rspCode == undefined || data.rspCode != '000') {
		controlsHelper.alert('新增子表信息失败:' + data.rspDesc);
	} else {
		$("#pop2").hide();
		GetDictionaryDataInfoList(dictId);
	}
};
/*
 * 功能：修改码表子表信息
 * 创建人：liql
 * 创建时间：2015-12-10
 */
function UpdateDictionaryDataInfo(dataId) {
	var jsonParam = {
		//		"marked": "updateDictionaryDataInfo",
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	var jsonstr = dataHelper.setJson(null, "data_id", dataId); //码表id
	jsonstr = dataHelper.setJson(jsonstr, "data_code", $("#udCode").val()); //码表编码
	jsonstr = dataHelper.setJson(jsonstr, "data_name", $("#udName").val()); //码表名称
	jsonstr = dataHelper.setJson(jsonstr, "data_parent_id", ''); //码表上级
	jsonstr = dataHelper.setJson(jsonstr, "data_dictionary", dictId); //码表主表
	jsonstr = dataHelper.setJson(jsonstr, "data_string1", $("#udString1").val());
	jsonstr = dataHelper.setJson(jsonstr, "data_string2", $("#udString2").val());
	jsonstr = dataHelper.setJson(jsonstr, "data_string3", $("#udString3").val());
	jsonstr = dataHelper.setJson(jsonstr, "data_string4", $("#udString4").val());
	jsonstr = dataHelper.setJson(jsonstr, "data_string5", $("#udString5").val());
	jsonstr = dataHelper.setJson(jsonstr, "data_seqno", $("#udSeqno").val() == "" ? 0 : parseInt($("#udSeqno").val()));
	jsonstr = dataHelper.setJson(jsonstr, "data_isvalid", $("#uselectIsValid").val());
	jsonstr = dataHelper.setJson(jsonstr, "data_remark", $("#udRemark").val());
	jsonParam.jsonStr = jsonstr;
	console.log(jsonParam);
	dataValueHelper.updateDictionaryDataInfo(jsonParam, Callback_UpdateDictionaryDataInfo);
};
/*
 * 功能：码表子表维护信息回调函数
 * 创建人：liql
 * 创建时间：2015-12-11
 */
function Callback_UpdateDictionaryDataInfo(data) {
	console.log(data);
	if(data.rspCode == null || data.rspCode == undefined || data.rspCode != '000') {
		controlsHelper.alert('修改子表信息失败:' + data.rspDesc);
	} else {
		$("#pop3").hide();
		GetDictionaryDataInfoList(dictId);
	}
};

/*
 * 功能：根据id获取码表子表信息
 * 创建人：liql
 * 创建时间：2015-12-10
 */
function GetDictionaryDataInfoByid(dataId) {
	console.log(dataId);
	var jsonParam = {
		//		"marked": "getDictionaryDataInfoByid",
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};

	jsonParam.jsonStr = dataHelper.setJson(null, "data_id", dataId); //码表id
	console.log(jsonParam);
	dataValueHelper.getDictionaryDataInfoByid(jsonParam, Callback_GetDictionaryDataInfoByid);
};
/*
 * 功能：根据id获取码表子表信息回调
 * 创建人：liql
 * 创建时间：2015-12-10
 */
function Callback_GetDictionaryDataInfoByid(data) {
	console.log(data);
	if(data == undefined || data.rspCode != "000") {
		alert(data.rspDesc);
	} else {
		$("#udCode").val(Mustache.render("{{data_code}}", data)); //码表编码
		$("#udName").val(Mustache.render("{{data_name}}", data)); //码表名称
		//		$("#selectParent").val(Mustache.render("{{data_parent_id}}", data)); //码表上级
		$("#udictionary").val($("#dictName").html());
		$("#udictionary").attr("data_id", $("#dictName").attr("data_id"));
		$("#udString1").val(Mustache.render("{{data_string1}}", data));
		$("#udString2").val(Mustache.render("{{data_string2}}", data));
		$("#udString3").val(Mustache.render("{{data_string3}}", data));
		$("#udString4").val(Mustache.render("{{data_string4}}", data));
		$("#udString5").val(Mustache.render("{{data_string5}}", data));
		$("#udSeqno").val(Mustache.render("{{data_seqno}}", data));
		$("#uselectIsValid option[value=" + Mustache.render("{{data_isvalid}}", data) + "]").attr("selected", "selected");
		//		$("#selectIsValid").val(Mustache.render("{{data_isvalid}}", data));
		$("#udRemark").val(Mustache.render("{{data_remark}}", data));
	}
};
