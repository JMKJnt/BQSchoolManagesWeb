var intTimer;
$(document).ready(function() {
	if ($.cookie("userName")) {
		$("#userName").html($.cookie("userName"));
	} else {
		location.href = "login.html";
	};
	$("#exit").click(function() {
		var r = confirm("确定退出系统吗？");
		if (r == true) {
			clearCookies();
			window.clearInterval(intTimer);
			location.href = "login.html";
		}
	});
});
/*
 * 功能：清空cookie
 * 创建人：liql
 * 创建时间：2015-9-28
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
	$.cookie("passWord", '', {
		expires: -1,
		path: "/"
	});

};