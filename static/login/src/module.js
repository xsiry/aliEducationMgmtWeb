define(function(require, exports, module) {
  module.exports = {

    init: function() {
      $('body').particleground({
        dotColor: '#337AB7',
        lineColor: '#2E6DA4'
      });
      inputValidator();
      createCode();
      checkCookie();
    },
  };

  // Helpers
  /*
   * 登陆验证
   */
  function inputValidator() {
    $('#loginForm').formValidation({
        autoFocus: true,
        locale: 'zh_CN',
        message: '该值无效，请重新输入',
        err: {
          container: 'tooltip'
        },
        fields: {
          inputUsername: {
            validators: {
              notEmpty: {},
              regexp: {
                regexp: /^[a-zA-Z0-9_]+$/
              }
            }
          },
          inputPassword: {
            validators: {
              notEmpty: {}
            }
          }
        }
      })
      .on('success.form.fv', function(e) {
        if (!validateCode()) {
          return false;
        }
        // Prevent form submission
        e.preventDefault();

        // Get the form instance
        var $form = $(e.target);

        // Get the FormValidation instance
        var bv = $form.data('formValidation');

        // Use Ajax to submit form data
        $.get('system/userLogin', $form.serialize(), function(result) {
          if (result.success) {
            saveUserInfo();
            location.href = "index.html";
            $.gritter.add({
              title: '登录成功',
              sticky: false,
              time: 1000,
              speed: 500,
              position: 'bottom-right',
              class_name: 'gritter-success'
            });
          } else {
            $.gritter.add({
              title: '登录失败',
              text: result.msg,
              sticky: false,
              time: 1000,
              speed: 500,
              position: 'bottom-right',
              class_name: 'gritter-error'
            });
            return false;
          }
        }, 'json');
      });
  };

  // 检查Cookie，并设置
  function checkCookie() {
    // 记住密码选中时，记住账号则自动选中 反之
    $('#rmbPassWord').click(function() {
      $("#rmbPassWord").is(':checked') == true ? $("#rmbUser").prop("checked", 'true') : $("#rmbUser").prop("checked", false);
    });

    //初始化页面时验证是否记住了帐号
    if ($.cookie("rmbUser") == "true") {
      $("#rmbUser").prop("checked", true);
      $("#inputUsername").val($.cookie("userName"));
    };

    //初始化页面时验证是否记住了密码
    if ($.cookie("rmbPassWord") == "true") {
      $("#rmbPassWord").prop("checked", true);
      $("#inputPassword").val($.cookie("passWord"));
    };
  };

  //保存用户信息，存储一个带7天期限的 cookie 或者 清除 cookie
  function saveUserInfo() {
    // 保存帐号和密码
    if ($("#rmbUser").is(':checked') == true && $("#rmbPassWord").is(':checked') == true) {
      var userName = $("#inputUsername").val();
      var passWord = $("#inputPassword").val();

      $.cookie("rmbUser", "true", { expires: 7 });
      $.cookie("rmbPassWord", "true", { expires: 7 });
      $.cookie("userName", userName, { expires: 7 });
      $.cookie("passWord", passWord, { expires: 7 });

      // 只保存帐号
    } else if ($("#rmbUser").is(':checked') == true) {
      var userName = $("#inputUsername").val();

      $.cookie("rmbUser", "true", { expires: 7 });
      $.cookie("userName", userName, { expires: 7 });

      $.cookie("rmbPassWord", "false", { expires: -1 });
      $.cookie("passWord", '', { expires: -1 });
      // 清除用户信息的 cookie
    } else {
      $.cookie("rmbUser", "false", { expires: -1 });
      $.cookie("rmbPassWord", "false", { expires: -1 });
      $.cookie("userName", '', { expires: -1 });
      $.cookie("passWord", '', { expires: -1 });
    }
  };
})
