define(function(require, exports, module) {
  $.root_ = $('div.ibox-content');
  var manager, g;
  module.exports = {

    init: function() {
      f_initGrid();
      this._configText();
      this._bindUI();
    },
    _configText() {
      $('div h5.mgmt_title').text('赛程列表');
      $('div button font.mgmt_new_btn').text('添加赛程');
      $('div button font.set_gm_intr_notice_btn').text('设置总赛程简介');
      $('div input.name_search').prop('placeholder', '输入名称');
      $('div button.name_search_btn').text('搜索');
    },
    _bindUI: function() {
      // bind .name_search_btn
      $.root_.on("click", '.name_search_btn', function(e) {
          f_search();
        })
        // bind .name_search
      $.root_.on("keypress", '.name_search', function(e) {
          if (e.which == "13") f_search();
        })
        // bind .name_search val.length is 0
      $.root_.on('input propertychange', '.name_search', function(e) {
          if ($('.name_search').val().length == 0) f_search();
        })
        // bind .v_mnt_new_modal_btn
      $.root_.on("click", '.new_modal_btn', function(e) {
        var url = 'app/clan_schedule_mgmt_modal.html';
        var fun = function(dialogRef) {
          selCombo();
          newModalValidation();
        }
        newModal('添加赛程', url, fun);
      })

      $.root_.on("click", '.set_gm_intr_notice_modal_btn', function(e) {
        var id = 1;
        editMainINRow(id);
      })

      // bind grid edit
      $.root_.on("click", '.row_btn_edit', function(e) {
        var id = $(e.currentTarget).attr('id');
        editRow(id);
      })
      $.root_.on("click", '.row_btn_del', function(e) {
        var id = $(e.currentTarget).attr('id');
        var name = $(e.currentTarget).attr('name');
        delRow(id, name);
      })
    }
  };

  // Helpers
  /*
   * 生成Grid
   */
  function f_initGrid() {
    var c = require('./columns');
    g = manager = $("div.listDiv").ligerGrid({
      columns: c,
      onSelectRow: function(rowdata, rowindex) {
        $("#txtrowindex").val(rowindex);
      },
      url: 'query/table',
      parms: { source: 'clan_schedule' },
      method: "get",
      dataAction: 'server',
      usePager: true,
      enabledEdit: false,
      clickToEdit: false,
      width: '100%',
      height: '91%',
      sortName: 'times',
      sortOrder: 'DESC'
    });
  };

  /*
   * 搜索
   */
  function f_search() {
    g.options.data = $.extend(true, {}, gridData);
    g.loadData(f_getWhere());
  };

  function f_getWhere() {
    if (!g) return null;
    var clause = function(rowdata, rowindex) {
      var key = $(".name_search").val();
      return rowdata.tit.indexOf(key) > -1;
    };
    return clause;
  };

  /*
   * 功能操作
   */

  function editRow(id) {
    $.ajax({
      type : 'GET',
      url : 'query/table',
      dataType : 'json',
      data : {
        source: 'clan_schedule',
        sourceid: id
      },
      success : function(data) {
        if (data) {
          var fun = function() {
            var dtprVal = '', clanAVal = '', clanBVal = '';
            $.each(data, function(key, val) {
              $('#newModalForm input[name="'+ key +'"]').val(val);
              if (key == 'status' && val == 1) {
                $('#newModalForm input[name="'+ key +'"]').prop('checked','checked');
              }else if (key == 'dtpr_id') {
                dtprVal = val;
              }else if (key == 'clan_id_a') {
                clanAVal = val;
              }else if (key == 'clan_id_b') {
                clanBVal = val;
              }
            })
            selCombo(dtprVal, clanAVal, clanBVal);
            newModalValidation();
          }
          var url = 'app/clan_schedule_mgmt_modal.html';
          newModal('修改赛程', url, fun);
        }
      },
      error : function(e) {
        console.log(e);
      }
    });
  };

  function editMainINRow(id) {
    $.ajax({
      type : 'GET',
      url : 'query/table',
      dataType : 'json',
      data : {
        source: 'gm_intr_notice',
        sourceid: id
      },
      success : function(data) {
        if (data) {
          var fun = function() {
            $.each(data, function(key, val) {
              $('pre.flex.x-' + key).text(val);
            })
            mainIntrNModalValidation();
          }
          var url = 'app/clan_main_intr_notice_modal.html';
          newModal('总赛程简介设置', url, fun, 'mainINModal', 'mainIntrNModalForm', 'mainINClose');
        }
      },
      error : function(e) {
        console.log(e);
      }
    });
  };

  function delRow(id, name) {
    swal({
      title: '确定删除?',
      text: '删除后，时间在“' + name + '”的赛程将无法恢复！',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: '删除',
      cancelButtonText: '取消'
    }).then(function() {
      $.ajax({
        type : 'GET',
        url : 'system/del',
        dataType : 'json',
        data : {
          tname: 'clan_schedule',
          tid: id
        },
        success : function(data) {
          if (data.success) {
            manager.reload();
            swal(
              '删除成功:)',
              '时间在“' + name + '”的赛程已被删除.',
              'success'
            )
          }else{
            swal(
              '删除失败!',
              '未知错误，请联系管理员或查看日志',
              'error'
            )
          }
        },
        error : function(e) {
          swal(
            '删除失败!',
            '未知错误，请联系管理员或查看日志',
            'error'
          )
        }
      });
    }, function(dismiss) {
      if (dismiss === 'cancel') {
        // swal(
        //   '已取消',
        //   '新闻“' + name + '”未删除 :)',
        //   'error'
        // )
      }
    })
  };

  function newModal(title, url, onshowFun, modalId, formId, closeId) {
    var mId = 'newModal';
    if (modalId) mId = modalId;
    var fId = 'newModalForm';
    if (formId) fId = formId;
    var cId = 'newModalClose';
    if (closeId) cId = closeId;

    var modal = BootstrapDialog.show({
      id: mId,
      title: title,
      size: 'size-wide',
      message: $('<div></div>').load(url),
      cssClass: 'modal inmodal fade',
      buttons: [{
        type: 'submit',
        icon: 'glyphicon glyphicon-check',
        label: '保存',
        cssClass: 'btn btn-primary',
        autospin: false,
        action: function(dialogRef) {
          $('#' + fId).submit();
        }
      }, {
        id: cId,
        label: '取消',
        cssClass: 'btn btn-white',
        autospin: false,
        action: function(dialogRef) {
          dialogRef.close();
        }
      }],
      onshown: onshowFun
    });
  };

  /*
   * 添加验证
   */
  function newModalValidation() {
    $('#newModalForm').formValidation({
        autoFocus: true,
        locale: 'zh_CN',
        message: '该值无效，请重新输入',
        err: {
          container: 'tooltip'
        },
        icon: {
          valid: 'glyphicon glyphicon-ok',
          invalid: 'glyphicon glyphicon-remove',
          validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
          // Name: {
          //   validators: {
          //     notEmpty: {}
          //   }
          // },
          // BusinessFirm: {
          //   validators: {
          //     notEmpty: {}
          //   }
          // },
          // BusinessContact: {
          //   validators: {
          //     notEmpty: {}
          //   }
          // },
          // PhoneNumber: {
          //   validators: {
          //     notEmpty: {},
          //     digits: {},
          //     phone: {
          //       country: 'CN'
          //     }
          //   }
          // }
        }
      })
      .on('success.form.fv', function(e) {
        // Prevent form submission
        e.preventDefault();

        // Get the form instance
        var $form = $(e.target);

        // Get the FormValidation instance
        var bv = $form.data('formValidation');

        // Use Ajax to submit form data
        var formVals = {};
        $.each($form.serializeArray(), function(i, o) {
          formVals[o.name] = o.value;
          formVals["status"] = (o.name == "status" && o.value == "on") ? 1 : 0;
        });

        var data = {
          actionname: 'clan_schedule',
          datajson: JSON.stringify(formVals)
        };
        $.post('save/table', data, function(result) {
          var msg;
          manager.reload();
          toastr.options = {
            closeButton: true,
            progressBar: true,
            showMethod: 'slideDown',
            timeOut: 4000
          };
          if (result.success == true) {
            msg = "操作成功！";
            toastr.success(msg);
          } else {
            msg = "操作失败！";
            toastr.error(msg);
          };

          $('#newModalClose').click();
        }, 'json');
      });
  };

  function mainIntrNModalValidation() {
    $('#mainIntrNModalForm').formValidation({
        autoFocus: true,
        locale: 'zh_CN',
        message: '该值无效，请重新输入',
        err: {
          container: 'tooltip'
        },
        icon: {
          valid: 'glyphicon glyphicon-ok',
          invalid: 'glyphicon glyphicon-remove',
          validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
          // Name: {
          //   validators: {
          //     notEmpty: {}
          //   }
          // },
          // BusinessFirm: {
          //   validators: {
          //     notEmpty: {}
          //   }
          // },
          // BusinessContact: {
          //   validators: {
          //     notEmpty: {}
          //   }
          // },
          // PhoneNumber: {
          //   validators: {
          //     notEmpty: {},
          //     digits: {},
          //     phone: {
          //       country: 'CN'
          //     }
          //   }
          // }
        }
      })
      .on('success.form.fv', function(e) {
        // Prevent form submission
        e.preventDefault();

        // Get the form instance
        var $form = $(e.target);

        // Get the FormValidation instance
        var bv = $form.data('formValidation');

        // Use Ajax to submit form data
        var formVals = {
          intro: $('pre.flex.x-intro').text(),
          notice: $('pre.flex.x-notice').text(),
          profile: $('pre.flex.x-profile').text(),
          plan: $('pre.flex.x-plan').text()
        };
        $.each($form.serializeArray(), function(i, o) {
          formVals[o.name] = o.value;
        });

        var data = {
          actionname: 'gm_intr_notice',
          datajson: JSON.stringify(formVals)
        };
        $.post('save/table', data, function(result) {
          var msg;
          manager.reload();
          toastr.options = {
            closeButton: true,
            progressBar: true,
            showMethod: 'slideDown',
            timeOut: 4000
          };
          if (result.success == true) {
            msg = "操作成功！";
            toastr.success(msg);
          } else {
            msg = "操作失败！";
            toastr.error(msg);
          };

          $('#mainINClose').click();
        }, 'json');
      });
  };
  /*
   * 初始化Combo
   */
  function initCombo() {
    var config = {
      '.chosen-select': {},
      '.chosen-select-deselect': {
        allow_single_deselect: true
      },
      '.chosen-select-no-single': {
        disable_search_threshold: 10
      },
      '.chosen-select-no-results': {
        no_results_text: 'Oops, nothing found!'
      },
      '.chosen-select-width': {
        width: "95%"
      }
    }
    for (var selector in config) {
      $(selector).chosen(config[selector]);
    }
  };

  function selCombo(dtprVal, clanAVal, clanBVal) {
    $.ajax({
      type : 'GET',
      url : 'query/table',
      dataType : 'json',
      data : {
        source: 'dict_province',
        qtype: 'select'
      },
      success : function(data) {
        if (data) {
          $('select.dtpr_list').empty();
          $.each(data, function(i, o) {
            $('select.dtpr_list').append('<option value="'+ o.dtpr_id +'" ' + (dtprVal == o.dtpr_id ? 'selected="selected"' : '') + '>'+ o.province +'</option>');
          })
        }
        $.ajax({
          type : 'GET',
          url : 'query/table',
          dataType : 'json',
          data : {
            source: 'clan_name',
            qtype: 'select'
          },
          success : function(data) {
            if (data) {
              $('select.clan_list_a').empty();
              $.each(data, function(i, o) {
                $('select.clan_list_a').append('<option value="'+ o.cln_id +'" ' + (clanAVal == o.cln_id ? 'selected="selected"' : '') + '>'+ o.clan_name +'</option>');
              })
              $('select.clan_list_b').empty();
              $.each(data, function(i, o) {
                $('select.clan_list_b').append('<option value="'+ o.cln_id +'" ' + (clanBVal == o.cln_id ? 'selected="selected"' : '') + '>'+ o.clan_name +'</option>');
              })
            }
            initCombo();
          },
          error : function(e) {
            console.log(e);
          }
        });
      },
      error : function(e) {
        console.log(e);
      }
    });
  }

  function dateFactory (str, date, yearBool) {
    function p(s) {
      return s < 10 ? '0' + s : s;
    }

    var d = date ? date : string2date(str);
    //获取当前年
    var year = d.getFullYear();
    //获取当前月
    var month = d.getMonth() + 1;
    //获取当前日
    var date = d.getDate();

    var h = d.getHours(); //获取当前小时数(0-23)
    var m = d.getMinutes(); //获取当前分钟数(0-59)
    var s = d.getSeconds();
    var mydatetime = yearBool ? [year, p(month), p(date), p(h), p(m), p(s)] : [p(month), p(date)];
    var now = mydatetime.join('-');
    return now;
  }

  function string2date(str) {
    return new Date(Date.parse(str.replace(/-/g, "/")) -24*60*60*1000);
  }
})
