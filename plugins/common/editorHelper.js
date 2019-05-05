(function(editorHelper) {

	/*
	 * 功能：注册百度编辑器
	 * 参数（dom对象，菜单参数）
	 * 更多参数请请参考ueditor.config.js中的配置项
	 */
	editorHelper.getEditor = function(domid, dataMenu) {
		UE.getEditor(domid, dataMenu);
	};
	/*
	 * 功能：获得整个html的内容
	 * 参数（dom对象，）
	 */
	editorHelper.getAllHtml = function(domid) {
		return UE.getEditor(domid).getAllHtml();
	};
	/*
	 * 功能：获得内容
	 * 参数（dom对象）
	 */
	editorHelper.getContent = function(domid) {
		return UE.getEditor(domid).getContent();
	};
	/*
	 * 功能：获得纯文本内容
	 * 参数（dom对象）
	 */
	editorHelper.getContentTxt = function(domid) {
		return UE.getEditor(domid).getContentTxt();
	};
	/*
	 * 功能：获得带格式的纯文本
	 * 参数（dom对象）
	 */
	editorHelper.getPlainTxt = function(domid) {
		return UE.getEditor(domid).getPlainTxt();
	};
	/*
	 * 功能：设置编辑器内容
	 * 参数（dom对象,文本内容,是否追加）
	 */
	editorHelper.setContent = function(domid, txtContent, isAppendTo) {
		UE.getEditor(domid).setContent(txtContent, isAppendTo);
	};
	/*
	 * 功能：判断是否有内容
	 * 参数（dom对象）
	 */
	editorHelper.hasContent = function(domid) {
		return UE.getEditor(domid).hasContents();
	};
	/*
	 * 功能：获取当前选中的文本
	 * 参数（dom对象）
	 */
	editorHelper.getText = function(domid) {
		//当你点击按钮时编辑区域已经失去了焦点，如果直接用getText将不会得到内容，所以要在选回来，然后取得内容
		var range = UE.getEditor(domid).selection.getRange();
		range.select();
		var txt = UE.getEditor(domid).selection.getText();
		return txt;
	};
	/*
	 * 功能：插入给定的内容
	 * 参数（dom对象）
	 */
	editorHelper.insertHtml = function(domid) {
		var value = prompt('插入html代码', '');
		UE.getEditor(domid).execCommand('insertHtml', value);
	};
	/*
	 * 功能：获取草稿箱内容
	 * 参数（dom对象）
	 */
	editorHelper.getLocalData = function(domid) {
		return UE.getEditor(domid).execCommand("getlocaldata");
	};
	/*
	 * 功能：清空草稿箱内容
	 * 参数（dom对象）
	 */
	editorHelper.clearlocaldata = function(domid) {
		UE.getEditor(domid).execCommand("clearlocaldata");
		return true;
	};
	/*
	 * 功能：隐藏编辑器
	 * 参数（dom对象）
	 */
	editorHelper.setHide = function(domid) {
		UE.getEditor(domid).setHide();
	};
	/*
	 * 功能：显示编辑器
	 * 参数（dom对象）
	 */
	editorHelper.setShow = function(domid) {
		UE.getEditor(domid).setShow();
	};

	/*
	 * 功能;设置高度为默认关闭了自动长高
	 * 参数（dom对象,高度像素）
	 */
	editorHelper.setHeight = function(domid, height) {
		UE.getEditor(domid).setHeight(height);
		return true;
	};
	/*
	 * 功能：可以编辑
	 * 参数（dom对象,button标签ID）
	 */
	editorHelper.setEnabled = function(domid, parentDomid) {
		UE.getEditor(domid).setEnabled();
		if(parentDomid != undefined && parentDomid != null && parentDomid != '') {
			//			enableBtn(parentDomid);
		}
	};
	/*
	 * 功能：不可编辑
	 * 参数（dom对象）
	 */
	editorHelper.setDisabled = function(domid) {
		UE.getEditor(domid).setDisabled('fullscreen');
		//		disableBtn("enable");
	};
	/*
	 * 功能:使编辑器获得焦点
	 * 参数（dom对象）
	 */
	editorHelper.setFocus = function(domid) {
		UE.getEditor(domid).focus();
		return true;
	};
	/*
	 * 功能：编辑器是否获得焦点
	 * 参数（dom对象,event）
	 */
	editorHelper.isFocus = function(domid, e) {
		UE.getEditor(domid).isFocus();
		UE.dom.domUtils.preventDefault(e)
	};
	/*
	 * 功能：编辑器失去焦点
	 * 参数（dom对象，event）
	 */
	editorHelper.setblur = function(domid, e) {
		UE.getEditor(domid).blur();
		UE.dom.domUtils.preventDefault(e)
	};

	function disableBtn(str) {
		var div = document.getElementById('btns');
		var btns = UE.dom.domUtils.getElementsByTagName(div, "button");
		for(var i = 0, btn; btn = btns[i++];) {
			if(btn.id == str) {
				UE.dom.domUtils.removeAttributes(btn, ["disabled"]);
			} else {
				btn.setAttribute("disabled", "true");
			}
		}
	};
	/*
	 * 功能：可操作按钮不可编辑
	 * 参数（标签domId）
	 */
	function enableBtn(parentDomid) {
		var div = document.getElementById(parentDomid);
		var btns = UE.dom.domUtils.getElementsByTagName(div, "button");
		for(var i = 0, btn; btn = btns[i++];) {
			UE.dom.domUtils.removeAttributes(btn, ["disabled"]);
		}
	};

	window.editorHelper = editorHelper;
})(window.editorHelper || {});