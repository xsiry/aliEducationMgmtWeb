function showCheck(a) {
	var c = document.getElementById("myCanvas");
	var ctx = c.getContext("2d");
	ctx.clearRect(0, 0, 1000, 1000);
	ctx.font = "90px 'Microsoft Yahei'";
	ctx.fillText(a, 0, 100);
	ctx.fillStyle = "black";
}
var code;

function createCode() {
	code = "";
	var codeLength = 4;
	var selectChar = new Array(1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z');
	for(var i = 0; i < codeLength; i++) {
		var charIndex = Math.floor(Math.random() * 60);
		code += selectChar[charIndex];
	}
	if(code.length != codeLength) {
		createCode();
	}
	showCheck(code);
}

function validateCode() {
	var inputCode = $("#J_codetext").val().toUpperCase();
	var codeToUp = code.toUpperCase();
	if(inputCode.length <= 0) {
		$("form button").attr('disabled', true);
		$("#J_codetext").prop("placeholder", "输入验证码");
		createCode();
		$("#J_codetext").focus();
		$("#J_codetext").keyup(function() {
			$("form button").removeAttr('disabled');
			$("form button").removeClass("disabled");
		})
		return false;
	} else if(inputCode != codeToUp) {
		$("form button").attr('disabled', true);
		$("#J_codetext").val("");
		$("#J_codetext").prop("placeholder", "验证码错误");
		$("#J_codetext").focus();
		$("#J_codetext").keyup(function() {
			$("form button").removeAttr('disabled');
			$("form button").removeClass("disabled");
		})
		createCode();
		return false;
	} else {
		$("#J_codetext").val("");
		createCode();
		return true;
	}

}