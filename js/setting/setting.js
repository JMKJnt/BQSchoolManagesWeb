$(document).ready(function() {
	if ($.cookie("userName") != undefined) {
		$("#userNameNum").text('登录账户：   ' + $.cookie("userName"));
		$("#phonenum").val($.cookie("phone"));
	}
	/*
	 * 功能：保存密码
	 * 创建人：liql
	 * 创建时间：2015-9-28
	 */
	$("#savePassword").click(function() {
		if (SettingValidate()) {
			updatePassword();
		}
	});
});



/*
 * 功能：重置密码接口
 * 创建人：shiyina
 * 创建时间：2016-10-26
 */
function updatePassword() {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};

	var myjsonStr = dataHelper.setJson(null, "managePhone", $.cookie("phone"));
	myjsonStr = dataHelper.setJson(myjsonStr, "oldPassword", $("#oldPassword").val());
	myjsonStr = dataHelper.setJson(myjsonStr, "newPassword", $("#newPassword").val());
	myjsonStr = dataHelper.setJson(myjsonStr, "manageUpdate", $.cookie("userName"));
	jsonParam.jsonStr = myjsonStr;
	console.log(myjsonStr);
	userInfoServer.updatePassword(jsonParam, callback_updatePassword);
};

function callback_updatePassword(data) {
	console.log(data);
	if (data == undefined || data.rspCode == null || data.rspCode != "000") {
		alert(data.rspDesc);
	} else {
		//清空cookies
		controlsHelper.alert('修改成功');
		clearCookies();
		top.location.href="../../login.html";
	};
};




/*
 * 功能：清空cookie
 * 创建人：liql
 * 创建时间：2018-9-18
 */
function clearCookies() {
	$.cookie("rembUser", "false", {
		expires: -1,
		path: "/"
	});
	$.cookie("userName", '', {
		expires: -1,
		path: "/"
	});
	$.cookie("phone", '', {
		expires: -1,
		path: "/"
	});
	$.cookie("passWord", '', {
		expires: -1,
		path: "/"
	});

};

/*
 * 功能：验证
 * 创建人：liql
 * 创建时间：2015-10-14
 */
function SettingValidate() {
	var isValidate = true;
	var phone = $("#phonenum").val();
	var passwOld = $("#oldPassword").val();
	var passw1 = $("#newPassword").val();
	var passw2 = $("#newPasswordTwo").val();
	var reg = new RegExp("^[0-9]*$");
	var regPass = new RegExp("^[A-Za-z0-9]+$");
	var strAlert = "";
	if (phone == "" || phone == null || phone == undefined) {
		strAlert = "用户名不能为空;\r\n";
		isValidate = false;
	}
	if (passwOld == "" || passwOld == null || passwOld == undefined) {
		strAlert = strAlert + '旧密码不能为空;\r\n';
		isValidate = false;
	} else {
		if (!regPass.test(passwOld)) {
			strAlert = strAlert + "旧密码:格式不正确,密码只能为数字或字母;\r\n";
			isValidate = false;
		}
		if (passwOld.length < 6) {
			strAlert = strAlert + '旧密码:请至少输入6位密码;\r\n';
			isValidate = false;
		}
	}

	if (passw1 == "" || passw1 == null || passw1 == undefined) {
		strAlert = strAlert + '新密码不能为空;\r\n';
		isValidate = false;
	} else {
		if (!regPass.test(passw1)) {
			strAlert = strAlert + "新密码:格式不正确,密码只能为数字或字母;\r\n";
			isValidate = false;
		}
		if (passw1.length < 6) {
			strAlert = strAlert + '新密码:请至少输入6位密码;\r\n';
			isValidate = false;
		}
	}

	if (passw2 == "" || passw2 == null || passw2 == undefined) {
		strAlert = strAlert + '确认密码不能为空;\r\n';
		isValidate = false;
	} else {
		if (!regPass.test(passw2)) {
			strAlert = strAlert + "确认密码:格式不正确,密码只能为数字或字母;\r\n";
			isValidate = false;
		}
		if (passw2.length < 6) {
			strAlert = strAlert + '确认密码:请至少输入6位密码;\r\n';
			isValidate = false;
		}
	}
	if (passw1 != passw2) {
		strAlert = strAlert + "两次密码输入不一致,请重新输入;\r\n";
		$("#newPasswordTwo").val('');
		isValidate = false;
	}
	if (!isValidate) {
		controlsHelper.alert(strAlert);
	}

	return isValidate;
};