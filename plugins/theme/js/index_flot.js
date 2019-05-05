var fa = new Object();
var indexTab = $("#indexTab");

function tabClose() {
	$("#indexTab", top.document).find("a").on("click", ".fa-remove", function(h) {
		h.preventDefault();
		$(this, top.document).parents().remove("li");
		$("iframe", top.document).remove($(this).parents("a").attr("href"));
		indexTab.find("a:last").tab("show");
		if(cssNum(fa).sumLi > (cssNum(fa).widthX * 3 / 4)) {
			autoWidthNav.tabMove(-cssNum(fa).sumLi + cssNum(fa).btnWidth + (cssNum(fa).widthX / 2))
		} else {
			autoWidthNav.tabMove(cssNum(fa).btnWidth)
		}
	})
}

function cssNum(a) {
	a.btnWidth = 32;
	a.sumLi = 0;
	indexTab.find("li").each(function() {
		a.sumLi += parseInt($(this).css("width"))
	});
	a.widthX = parseInt($("#moreNavBox").css("width"));
	a.sumActiveLi = 0;
	indexTab.find("li").each(function() {
		if($(this).hasClass("active")) {
			return false
		} else {
			a.sumActiveLi += parseInt($(this).css("width"))
		}
	});
	return a
}
openIframe();

function openIframe() {
	$(".sidebar-menu").on("click", "a", function() {

		var tabId = $(this).attr("data-pageName");
		var ifmTitle = $(this).text();
		var ifmSysUrl = $(this).attr("data-pageUrl") == undefined || $(this).attr("data-pageUrl") == null || $(this).attr("data-pageUrl") == '' ? customHost : $(this).attr("data-pageUrl");
		var ifmFullUrl;
		if(ifmSysUrl != undefined && ifmSysUrl != null && ifmSysUrl != '') {
			ifmFullUrl = ifmSysUrl + tabId;
			tabId = ifmFullUrl.replace(/(.*\/)*([^.]+).*/ig, "$2");
		}
	
		if(tabId != 'undefined' && tabId != 'null' && tabId != '') {
			console.log(tabId);
			var loadSign = true;
			$("#iframeBox").find(".tab-pane").each(function() {
				if($(this).attr("id") == tabId) {
					loadSign = false;
					indexTab.find('a[href="#' + tabId + '"]').tab("show");
					if(cssNum(fa).sumLi > cssNum(fa).widthX) {
						autoWidthNav.tabMove(-cssNum(fa).sumActiveLi + cssNum(fa).btnWidth)
					}
					return false;
				}
			});

			if(loadSign) {
				var e = '<li><a  href="#' + tabId + '">' + ifmTitle + ' <i class="fa fa-remove"></i></a></li>';
				//var d = '<iframe width="100%" height="100%" frameborder="0" src="' + c + '"   class="tab-pane fade in " id="' + pageName + '"></iframe>';
				indexTab.append(e);
				//$("#iframeBox").append(d);
				var iframe = document.createElement("iframe");
				iframe.src = ifmFullUrl;
				iframe.id = tabId;
				iframe.width = "100%";
				iframe.height = "100%";
				iframe.frameBorder = "0";
				iframe.className = "tab-pane fade in";
				$("#iframeBox").append(iframe);
				if(iframe.attachEvent) {
					iframe.attachEvent("onload", function() {
						//Iframe页面加载完成后操作
						//alert("Local iframe is now loaded 1."); 
						//alert(1);
					});
				} else {
					iframe.onload = function() {
						//Iframe页面加载完成后操作
						//alert("Local iframe is now loaded 2."); 
						//console.log($(this));
						//alert($(this));
					};
				}

				indexTab.find('a[href="#' + tabId + '"]').tab("show");
				if(cssNum(fa).sumLi > (cssNum(fa).widthX * 4 / 5)) {
					autoWidthNav.tabMove(-cssNum(fa).sumLi + cssNum(fa).btnWidth + (cssNum(fa).widthX / 2))
				}
				indexTab.on("click", "a", function(h) {
					h.preventDefault();
					$(this).tab("show")
				});
				tabClose();
			}
		} else {
			console.log('xx');
		}
	})
}
/*
 * 功能：设置地址
 * 创建人：liql
 * 创建时间：2017-1-10
 */
function SetUrlLink(a, c, param) {
	if(a != undefined) {
		var d = a.replace(/\-/g, "/")
	}
	$("#iframeBox", top.document).find(".tab-pane").each(function() {
		if($(this).attr("id") == a) { //1.判断：要更改的tab名字是否已经打开，如果打开强行关闭；
			$("#indexTab", top.document).find('a[href="#' + a + '"]').parent().remove(); //清除tab
			$(this).remove(); //清除iframe
			if(cssNum(fa).sumLi > cssNum(fa).widthX) {
				autoWidthNav.tabMove(-cssNum(fa).sumActiveLi + cssNum(fa).btnWidth)
			}
			return false
		}
	});

	$("#iframeBox", top.document).find(".tab-pane.active").attr("id", a); //更改iframe id值
	//	var param = $(this).attr('data-param');
	param = param == null || param == undefined ? '' : param;
	//2.更改当前tab名字以及属性；
	var chost = $(this).attr("data-pageUrl");
	console.log(chost);
	console.log('SetUrlLink');

	var chost = $(this).attr("data-pageUrl");
	var c;
	if(chost != undefined && chost != null && chost != '') {
		c = chost + d + ".html" + param;
	} else {
		c = customHost + d + ".html" + param;
	}

	//	location.href = customHost + d + ".html" + param;
	location.href = c;
	var b = '<a  href="#' + a + '">' + c + ' <i class="fa fa-remove"></i></a>';
	$("#indexTab", top.document).find("li.active").html(b);
	tabClose();
	if(cssNum(fa).sumLi > cssNum(fa).widthX) {
		autoWidthNav.tabMove(-cssNum(fa).sumActiveLi + cssNum(fa).btnWidth)
	}
}
/*
 * 功能：调转事件
 */

function AgainRegisterClick(a1, c1) {
	$(".jump").on("click", function() {
		SetUrlLink($(this).attr("data-pageName"), $(this).attr("data-pageNameZh"), $(this).attr('data-param'));
	});
	if((a1 != undefined) && (a1 != null) && (a1 != '')) {
		SetUrlLink(a1, c1);
	}
}

btnGroupText();

function btnGroupText() {
	$(".btn-group").find(".dropdown-menu[role=menu]").on("click", "li", function() {
		var a = $(this).text();
		$(this).parent().prevAll("button:first-child").text(a)
	})
}
popControl();

function popControl() {
	$(document).on("click", "button", function() {
		var a = $(this).attr("data-pop");
		if(a != undefined) {
			$("section.pop[data-pop=" + a + "]").show();
			HideSlider();
			if(a == "close") {
				$(this).parents("section.pop").first().hide();
				ShowSlider()
			}
		}
	})
}

function HideSlider() {
	$("html:not(.pop)").css({
		"overflow-y": "hidden"
	})
}

function ShowSlider() {
	$("html:not(.pop)").css({
		"overflow-y": ""
	})
}
var autoWidthNav = {
	tabMove: function(a) {
		indexTab.animate({
			left: a + "px"
		})
	},
	autoMove: function() {
		$(".moreNav").on("click", function() {
			var f = $(this).attr("data-nav");
			var b = parseInt(indexTab.css("left").replace(/px/g, ""));
			var d = cssNum(fa).widthX / 2;
			if((b != cssNum(fa).btnWidth) || (cssNum(fa).sumLi > (cssNum(fa).widthX - cssNum(fa).btnWidth * 2))) {
				switch(f) {
					case "right":
						var a = b - d;
						var c = Math.abs(b) + cssNum(fa).widthX - cssNum(fa).btnWidth;
						if(c < cssNum(fa).sumLi) {
							autoWidthNav.tabMove(a)
						} else {
							noMore()
						}
						break;
					case "left":
						var e = b - (-d);
						if(e < cssNum(fa).btnWidth) {
							autoWidthNav.tabMove(e)
						} else {
							if(b == cssNum(fa).btnWidth) {
								noMore()
							} else {
								autoWidthNav.tabMove(cssNum(fa).btnWidth)
							}
						}
						break;
					default:
						break
				}
			} else {
				noMore()
			}
		})
	}
};
autoWidthNav.autoMove();

function noMore() {
	var a = [""];
	$(".noMore").find("p").text(a[Math.floor(Math.random() * a.length)]);
	$(".noMore").fadeIn(300);
	setTimeout(function() {
		$(".noMore").fadeOut(100)
	}, 500)
};