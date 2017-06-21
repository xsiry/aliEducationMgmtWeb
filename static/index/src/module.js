define(function(require, exports, module) {
  $.root_ = $('body');

  module.exports = {
    menus: [],
    init: function(data) {
      this.menus = data.map(function(menu) {
        return menuGenerate(menu);
      });

      this.welcomeMsg();
      this.menusGenerate();
      require('menusAction');

      // MetsiMenu
      $('#side-menu').metisMenu();

      var user = require('./user_data');
      this.setProfile(user)
      this._bindUI();
    },
    _bindUI: function() {
      $.root_.on('click', 'a.login_out', function() {
        // clean cache
        window.location = 'login.html';
      })
    },
    menusGenerate: function() {
      var lis = this.menus.join('');
      $('#side-menu').append(lis);
      $('#side-menu >li:has(a[href="' + window.location.hash + '"])').addClass('active');
    },
    welcomeMsg: function() {
      setTimeout(function() {
        toastr.options = {
          closeButton: true,
          progressBar: true,
          showMethod: 'slideDown',
          timeOut: 4000
        };
        toastr.success('当前时间：' + getNowTime(), '欢迎进入 管理系统');

      }, 1300);
    },
    setProfile: function(user) {
      $('ul#side-menu .profile_img').attr('src', user.img);
      $('ul#side-menu .profile_name').text(user.name);
      $('ul#side-menu .profile_role').text(user.role);
    }
  };

  // Helpers
  /*
   * 生成菜单
   */
  function menuGenerate(menu) {
    var m = "<li>";
    m += "<a href=" + menu.href + " title=" + menu.title +
      "><i class='" + menu.icon + "'></i> <span class='nav-label'>" + menu.title +
      "</span>";

    if (menu.childrens != undefined) {
      m += "<span class='fa arrow'></span></a><ul class='nav nav-second-level collapse'>";
      menu.childrens.map(function(c) {
        m += "<li><a href=" + c.href + " title='" + c.title + "'>" + c.title + "</a></li>";
      });
      m += "</ul></li>";
    } else {
      m += "</a></li>";
    }

    return m;
  }
  /**
   * 获取当前时间
   */
  function getNowTime() {

    function p(s) {
      return s < 10 ? '0' + s : s;
    }

    var myDate = new Date();
    //获取当前年
    var year = myDate.getFullYear();
    //获取当前月
    var month = myDate.getMonth() + 1;
    //获取当前日
    var date = myDate.getDate();
    var h = myDate.getHours(); //获取当前小时数(0-23)
    var m = myDate.getMinutes(); //获取当前分钟数(0-59)
    var s = myDate.getSeconds();

    var now = [year, p(month), p(date)].join('-') + " " + [p(h), p(m), p(s)].join(':');
    return now;
  }
})
