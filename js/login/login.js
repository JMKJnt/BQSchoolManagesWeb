var isLoginTimeOut;
$(document).ready(function() {

	fromValidate();
	isLoginTimeOut = true;
	//记住密码点击事件
	$("#rembUser").click(function() {
		if($(this).attr("data-check") == "true") {
			$(this).attr("data-check", "false");
			$(this).find("img").attr("src", "img/noRemember.png")
		} else {
			$(this).attr("data-check", "true");
			$(this).find("img").attr("src", "img/remember.png");
		}
	});
	$("#login").click(function() {
		console.log($('#login').text());
		if($('#login').find("span").html() == "登录") {
			loginClick();
		}
	});
	$("#loginPass").keydown(function(e) {
		if(e.keyCode == 13) {
			loginClick();
		}
	});
	if($.cookie("rembUser") == "true") {
		$("#rembUser").attr("checked", true);
		$("#telPhoneNum").val($.cookie("userName"));
		$("#loginPass").val($.cookie("passWord"));
	}
	if($.cookie("userName")) {
		window.location.href = "index.html";
	}
});
/*
 * 功能：登录事件
 * 创建人：liql
 * 创建时间：2018-9-18
 */
function loginClick() {
	$('#login').find("span").html("登录中...");
	if(fromValidate().form()) {
		loginManager();
		setTimeout(function() {
			if(isLoginTimeOut) {
				controlsHelper.alert('登录超时');
				$('#login').find("span").html("登录");
			}
		}, 15000); //15毫秒
	} else {
		$('#login').find("span").html("登录");
	}
}

function loginManager() {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	var jsonstr = dataHelper.setJson(null, 'managePhone', $("#telPhoneNum").val());
	jsonstr = dataHelper.setJson(jsonstr, 'password', $("#loginPass").val());
	jsonParam.jsonStr = jsonstr;
	console.log(jsonParam);
	userInfoServer.loginManager(jsonParam, callback_loginManager);
};
/*
 * 功能：login登录回调
 * 创建人：Liql
 * 创建时间：2018-09-15
 */
function callback_loginManager(data) {
	console.log(data);
	if(data == undefined || data == null || data.rspCode != "000") {
		alert(data.rspDesc);
	} else {
		saveUserInfoCookie(data);
		if($.cookie("userName") == undefined || $.cookie("userName") == null) {
			location.href = "login.html";
		} else {
			location.href = "index.html";
		}
	}
	$('#login').find("span").html("登录");
	isLoginTimeOut = false;
};
/*
 * 功能：验证后保存cookie
 * 创建人：liql
 * 创建时间：2015-9-24
 */
function saveUserInfoCookie(data) {
	console.log(data);
	var userName = $("#telPhoneNum").val();
	//处理
	if($("#rembUser").attr("data-check", "true")) {
		$.cookie("userName", data.manageUserName, {
			expires: 14,
			path: "/"
		});
		$.cookie("phone", data.managePhone, {
			expires: 14,
			path: "/"
		});
		$.cookie("passWord", data.managePassword, {
			expires: 14,
			path: "/"
		});
		$.cookie("rembUser", "true", {
			expires: 14,
			path: "/"
		}); //两周的存储cookie
	} else {
		$.cookie("rembUser", "false", {
			path: "/"
		}); //两周的存储cookie
		$.cookie("userName", data.manageUserName, {
			path: "/"
		});
		$.cookie("phone", data.managePhone, {
			path: "/"
		});
		$.cookie("passWord", '', {
			path: "/"
		});
	}

	var myDate = new Date();
	$.cookie("loginTime", myDate.toLocaleString());
};

function fromValidate() {
	return $("#loginForm").validate({
		/* 设置验证规则 */
		rules: {
			telPhoneNum: {
				required: true
			},
			loginPass: {
				required: true
			}
		},
		/**/
		/* 设置错误信息 */
		messages: {
			telPhoneNum: {
				required: "请填写用户名"
			},
			loginPass: {
				required: "请输入密码"
			}
		},
		/* 设置错误信息提示DOM */
		errorPlacement: function(error, element) {
			error.appendTo(element.parent());
		},
	});
};