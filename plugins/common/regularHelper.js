$(function() {
	/*
	 * 功能：只能为大于等于0的整数
	 * 参数（需验证的文本）
	 */
	jQuery.validator.addMethod("isGEqInt", function(value, element) {
		var reg = new RegExp("^[0-9]*[0-9][0-9]*$");
		return this.optional(element) || (reg.test(value));
	}, "只能输入大于等于0的整数");

	jQuery.validator.addMethod("isGInt", function(value, element) {
		var reg = /^[1-9]*$/;
		return this.optional(element) || (reg.test(value));
	}, "只能输入大于0的整数");
	/*
	 * 功能：是否为0-9整数
	 * 参数（需要验证文本）
	 */
	jQuery.validator.addMethod("isInteger", function(value, element) {
		var reg = /^[0-9]*$/;
		return this.optional(element) || (reg.test(value));
	}, "只能输入0-9的整数");
	/*
	 * 功能：是否包含空格
	 * 参数（需要验证文本）
	 */
	jQuery.validator.addMethod("isSpaces", function(value, element) {
		var reg = /^\S+$/gi;
		return this.optional(element) || (reg.test(value));
	}, "您的输入包含空格");
	/*
	 * 功能：特殊字符验证_-—？?.。：；:;!！,，、&-*
	 * 参数（需要验证文本）
	 */
	jQuery.validator.addMethod("isSpecialChart", function(value, element) {
		var reg = new RegExp('^[\u4E00-\u9FA5A-Za-z0-9_-—？?.。：；:;!！,，、&-*]+$');
		return this.optional(element) || (reg.test(value));
	}, "您的输入包含特殊字符");
	/*
	 * 功能：中文验证
	 * 参数（需要验证文本）
	 */
	jQuery.validator.addMethod("isChinese", function(value, element) {
		var reg = new RegExp('^[\u4e00-\u9fa5]{0,}$');
		return this.optional(element) || (reg.test(value));
	}, "请输入中文");
	/*
	 * 功能：数字并且开头数字不能为0
	 * 参数（需要验证文本）
	 */
	jQuery.validator.addMethod("isFirstNoZeroInt", function(value, element) {
		var reg = /^[1-9]\d{0,9}$/gi;
		return this.optional(element) || (reg.test(value));
	}, "请输入数字并且开头数字不能为0");
	/*
	 * 功能：验证数字是否属于01,12格式不正确
	 * 参数（需要验证文本）
	 */
	jQuery.validator.addMethod("isCorrectNum", function(value, element) {
		var isPass = true;
		//判断文本是否包含小数点.
		if(value.indexOf('.') <= 0) {
			//不包含，则判断文本是第一位为0
			if(value.substr(0, 1) == '0' && value.length > 1) {
				isPass = false
			}
		} else {
			var strTmp = value.split('.')[0];
			//不包含，则判断文本是第一位为0
			if(strTmp.substr(0, 1) == '0' && strTmp.length > 1) {
				isPass = false
			}
		}
		return this.optional(element) || isPass;
	}, "请输入正确数字");
	/*
	 * 功能：只能为大于等于0(可保留0-2位小数)的整数
	 * 参数（需要验证文本）
	 */
	jQuery.validator.addMethod("isGOrEqZeroDecimal", function(value, element) {
		var reg = new RegExp("^[0-9]+(\.{0,1}[0-9]{0,2})?$");
		return this.optional(element) || (reg.test(value));
	}, "请输入大于等于0(可保留0-2位小数)的整数");
	/*
	 * 功能：只能输入英文字符+数字
	 * 参数（需要验证文本）
	 */
	jQuery.validator.addMethod("isEnglishInt", function(value, element) {
		var reg = new RegExp("^.[A-Za-z0-9]+$");
		return this.optional(element) || (reg.test(value));
	}, "请输入英文字符+数字");
	/*
	 * 功能：只能输入英文字符
	 * 参数（需要验证文本）
	 */
	jQuery.validator.addMethod("isEnglish", function(value, element) {
		var reg = new RegExp("^.[A-Za-z]+$");
		return this.optional(element) || (reg.test(value));
	}, "请输入英文字符");
	/*
	 * 功能：首位输入英文字符
	 * 参数（需要验证文本）
	 */
	jQuery.validator.addMethod("firstIsEnglish", function(value, element) {
		var reg = new RegExp("^[a-zA-Z]{1,}.*");
		return this.optional(element) || (reg.test(value));
	}, "请输入英文字符");
	/*
	 * 功能：只能输入非0的负整数
	 * 参数（需要验证文本）
	 */
	jQuery.validator.addMethod("isNoZeroInt", function(value, element) {
		var reg = new RegExp("^\-[1-9][0-9]*$");
		return this.optional(element) || (reg.test(value));
	}, "请输入非0的负整数");
	/*
	 * 功能：判断是否未输入值(排除默认值)
	 */
	jQuery.validator.addMethod("isRequired", function(value, element, defaultParam) {
		return this.optional(element) || (value != null && value != '' && value != undefined && value != defaultParam[0]);
	}, "请输入或选择值");

	// 字符验证
	jQuery.validator.addMethod("stringCheck", function(value, element) {
		return this.optional(element) || /^[\u0391-\uFFE5\w]+$/.test(value);
	}, "只能包括中文字、英文字母、数字和下划线");
	// 中文字两个字节
	jQuery.validator.addMethod("byteRangeLength", function(value, element, param) {
		var length = value.length;
		for(var i = 0; i < value.length; i++) {
			if(value.charCodeAt(i) > 127) {
				length++;
			}
		}
		return this.optional(element) || (length >= param[0] && length <= param[1]);
	}, "请确保输入的值在允许范围内(一个中文字算2个字节)");
	// 身份证号码验证
	jQuery.validator.addMethod("isIdCardNo", function(value, element) {
		var reg = /^[1-9]{1}[0-9]{14}$|^[1-9]{1}[0-9]{16}([0-9]|[xX])$/;
		return this.optional(element) || (reg.test(value));
	}, "请正确输入您的身份证号码");
	// 手机号码验证
	jQuery.validator.addMethod("isMobile", function(value, element) {
		var length = value.length;
		var mobile = /^((1[3-9]{1}[0-9]{1})+\d{8})$/;
		return this.optional(element) || (length == 11 && mobile.test(value));
	}, "请正确填写您的手机号码");
	// 电话号码验证
	jQuery.validator.addMethod("isTel", function(value, element) {
		var tel = /^\d{3,4}-?\d{7,9}$/; //电话号码格式010-12345678
		return this.optional(element) || (tel.test(value));
	}, "请正确填写您的电话号码");
	// 联系电话(手机/电话皆可)验证
	jQuery.validator.addMethod("isPhone", function(value, element) {
		var length = value.length;
		var mobile = /^((1[3-9]{1}[0-9]{1})+\d{8})$/;
		var tel = /^\d{3,4}-?\d{7,9}$/;
		return this.optional(element) || (tel.test(value) || mobile.test(value));
	}, "请正确填写您的联系电话");
	// 邮政编码验证
	jQuery.validator.addMethod("isZipCode", function(value, element) {
		var tel = /^[0-9]{6}$/;
		return this.optional(element) || (tel.test(value));
	}, "请正确填写您的邮政编码");
	// 姓名验证 (不为空、不能是特殊符号、不能有空格)
	jQuery.validator.addMethod("isName", function(value, element) {
		var name = /^[^`~!@#$%^&*_+<>?:"{},.\/;'[\] ]+$/im;
		return this.optional(element) || (name.test(value));
	}, "请正确填写账号名称");
	//验证15数字
	jQuery.validator.addMethod("isFifteen", function(value, element) {
		var name = /^[0-9]{15}$/;
		return this.optional(element) || (name.test(value));
	}, "请输入15位数字");
	//验证8数字 
	jQuery.validator.addMethod("isEight", function(value, element) {
		var name = /^[0-9]{8}$/;
		return this.optional(element) || (name.test(value));
	}, "请输入8位数字");
	//验证大于1的 最大为5位 的数字 
	jQuery.validator.addMethod("isFive", function(value, element) {
		var name = /^[1-9]{5}$/;
		return this.optional(element) || (name.test(value));
	}, "请输入大于1的 最大为5位 的数字 ");
	//验证大于1的 最大为5位 的数字 
	jQuery.validator.addMethod("isLicenseNum", function(value, element) {
		var name = /^\d{15}$/;
		return this.optional(element) || (name.test(value));
	}, "请正确填写营业执照注册号");

});