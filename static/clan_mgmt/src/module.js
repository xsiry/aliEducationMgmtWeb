define(function(require, exports, module) {
  $.root_ = $('div.ibox-content');
  var manager, g, g_member, manager_member;
  module.exports = {

    init: function() {
      f_initGrid();
      this._configText();
      this._bindUI();
    },
    _configText() {
      $('div h5.mgmt_title').text('战队列表');
      $('div button font.mgmt_new_btn').text('添加战队');
      $('div button font.mgmt_member_btn').text('成员管理');
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
        var url = 'app/clan_mgmt_modal.html';
        var fun = function(dialogRef) {
          selCombo();
          newModalValidation();
        }
        newModal('添加战队', url, fun);
      })

      $.root_.on("click", '.mgmt_member_modal_btn', function(e) {
        var row = manager.getSelectedRow();
        if (!row) { alert('请选择一个战队'); return; }
        var url = 'app/clan_member_mgmt_modal.html';
        var fun = function(dialogRef) {
          f_initMemberGrid(row.cln_id)
        }
        newModal(row.clan_name + ' 战队成员管理', url, fun, 'memModal', '', '', true);
      })

      $('body').on("click", '.upload_new_imgs', function(e) {
        var type = $(e.currentTarget).data("type");
        var number = 0;
        if (type == 1) {
          number = 1;
        }else if (type == 2) {
          number = 1;
        }else if (type == 3) {
          number = 3;
        }else if (type == 4) {
          number = 1;
        }else if (type == 5) {
          number = 1;
        }

        BootstrapDialog.show({
          title: '文件上传',
          type: 'BootstrapDialog.TYPE_SUCCESS',
          size: 'size-wide',
          closeByBackdrop: false,
          message: $('<div class="img_upload" data-url="system/fileupload" data-mincount=1 data-maxcount='+ number +' data-types="image" data-async=false></div>')
            .load('app/upload_file.html'),
          onshown: function(dialogRef) {
            $('#newModal').hide();
            $('#memModal').hide();
            $('#addMemModal').hide();
            $('#x_file').on('filebatchuploadsuccess', function(event, data, previewId, index) {
              var reData = data.response;
              if (reData.success) {
                var imgs = [];
                var formId = 'newModalForm';
                if (type > 3) formId = 'memberModalForm';

                $('#'+ formId +' div.img_list_show_' + type).empty().css('text-align', 'center');
                $.each(reData.result, function(i, url) {
                  imgs.push(url);
                  $('#'+ formId +' div.img_list_show_' + type).append('<img style="margin-right:10px;width: 100px;height: 100px;" src="' + url + '">');
                });

                if (type == 1) {
                  $('#newModalForm input[name="clan_logo"]').val(imgs.join(';'));
                }else if (type == 2) {
                  $('#newModalForm input[name="clan_img"]').val(imgs.join(';'));
                }else if (type == 3) {
                  $('#newModalForm input[name="imgurl"]').val(imgs.join(';'));
                }else if (type == 4) {
                  $('#memberModalForm input[name="photo"]').val(imgs.join(';'));
                }else if (type == 5) {
                  $('#memberModalForm input[name="avatar"]').val(imgs.join(';'));
                }

                dialogRef.close();
              }
            })
            $('#x_file').on('filebatchuploaderror', function(event, data, msg) {
               consol.log("服务器内部错误，请联系管理员！")
            })
          },
          onhidden: function(dialogRef){
            $('#newModal').show();
            $('#addMemModal').show();
            $('#memModal').show();
          }
        });
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

      // 战队成员管理bind
      $('body').on("click", '.add_member', function(e) {
        var url = 'app/clan_member_mgmt_new_modal.html';
        var formId = 'memberModalForm';
        var closeId = 'memModalClose';
        var fun = function(dialogRef) {
          memModalValidation();
        }
        newModal('添加成员信息', url, fun, 'addMemModal', formId, closeId);
      })
      $('body').on("click", '.edit_member', function(e) {
        var id = $(e.currentTarget).attr('id');
        editMem(id);
      })
      $('body').on("click", '.del_member', function(e) {
        var id = $(e.currentTarget).attr('id');
        var name = $(e.currentTarget).attr('name');
        delMem(id, name);
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
      parms: { source: 'clan_name' },
      method: "get",
      dataAction: 'server',
      usePager: true,
      enabledEdit: false,
      clickToEdit: false,
      width: '100%',
      height: '91%',
      sortName: 'clan_name',
      sortOrder: 'ASC'
    });
  };

  function f_initMemberGrid(cln_id) {
    var c = require('./columns_member');
    g_member = manager_member = $("div.memberListDiv").ligerGrid({
      columns: c,
      onSelectRow: function(rowdata, rowindex) {
        $("#txtrowindex").val(rowindex);
      },
      url: 'query/table',
      parms: { source: 'clan_member', qhstr: JSON.stringify({qjson: [{cln_id: cln_id}]})},
      method: "get",
      dataAction: 'server',
      usePager: true,
      enabledEdit: true,
      clickToEdit: false,
      width: '100%',
      height: '91%',
      sortName: 'nickname',
      sortOrder: 'ASC'
    });
  }
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
        source: 'clan_name',
        sourceid: id
      },
      success : function(data) {
        if (data) {
          var fun = function() {
            var selectedVal = '';
            $.each(data, function(key, val) {
              var imgs = [];
              $('#newModalForm input[name="'+ key +'"]').val(val);
              if (key == 'clan_logo') {
                imgs = val.split(';');
                $.each(imgs, function(i , url) {
                  if (url != "") $('#newModalForm div.img_list_show_1').append('<img style="margin-right:10px;width: 100px;height: 100px;" src="' + url + '">');
                })
              }else if (key == 'clan_img') {
                imgs = val.split(';');
                $.each(imgs, function(i , url) {
                  if (url != "") $('#newModalForm div.img_list_show_2').append('<img style="margin-right:10px;width: 100px;height: 100px;" src="' + url + '">');
                })
              }else if (key == 'imgurl') {
                imgs = val.split(';');
                $.each(imgs, function(i , url) {
                  if (url != "") $('#newModalForm div.img_list_show_3').append('<img style="margin-right:10px;width: 100px;height: 100px;" src="' + url + '">');
                })
              }else if (key == 'cln_grp_id') {
                selectedVal = val;
              }
            })
            selCombo(selectedVal);
            newModalValidation();
          }
          var url = 'app/clan_mgmt_modal.html';
          newModal('修改战队', url, fun);
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
      text: '删除后，战队“' + name + '”将无法恢复！',
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
          tname: 'clan_name',
          tid: id
        },
        success : function(data) {
          if (data.success) {
            manager.reload();
            swal(
              '删除成功:)',
              '战队“' + name + '”已被删除.',
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

  function newModal(title, url, onshowFun, modalId, formId, closeId, noBtn) {
    var mId = 'newModal';
    if (modalId) mId = modalId;
    var id = 'newModalForm';
    if (formId) id = formId;
    var cId = 'newModalClose';
    if (closeId) cId = closeId;

    var btn = [{
        type: 'submit',
        icon: 'glyphicon glyphicon-check',
        label: '保存',
        cssClass: 'btn btn-primary',
        autospin: false,
        action: function(dialogRef) {
          $('#'+ id).submit();
        }
      }, {
        id: cId,
        label: '取消',
        cssClass: 'btn btn-white',
        autospin: false,
        action: function(dialogRef) {
          dialogRef.close();
        }
      }];
    if (noBtn) btn = [];
    var modal = BootstrapDialog.show({
      id: mId,
      title: title,
      size: 'size-wide',
      message: $('<div></div>').load(url),
      cssClass: 'modal inmodal fade',
      buttons: btn,
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
        });

        var data = {
          actionname: 'clan_name',
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

  function memModalValidation() {
    $('#memberModalForm').formValidation({
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
        });

        var data = {
          actionname: 'clan_member',
          datajson: JSON.stringify(formVals)
        };
        $.post('save/table', data, function(result) {
          var msg;
          manager_member.reload();
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

          $('#memModalClose').click();
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

  function selCombo(selectedVal) {
    $.ajax({
      type : 'GET',
      url : 'query/table',
      dataType : 'json',
      data : {
        source: 'clan_group',
        qtype: 'select'
      },
      success : function(data) {
        if (data) {
          $('select.group_list').empty();
          $.each(data, function(i, o) {
            $('select.group_list').append('<option value="'+ o.cln_grp_id +'" ' + (selectedVal == o.cln_grp_id ? 'selected="selected"' : '') + '>'+ o.groupname +'</option>');
          })
        }
        initCombo();
      },
      error : function(e) {
        console.log(e);
      }
    });
  }

  // 成员管理操作
  function editMem(id) {
    $.ajax({
      type : 'GET',
      url : 'query/table',
      dataType : 'json',
      data : {
        source: 'clan_member',
        sourceid: id
      },
      success : function(data) {
        if (data) {
          var fun = function() {
            var selectedVal = '';
            $.each(data, function(key, val) {
              var imgs = [];
              $('#memberModalForm input[name="'+ key +'"]').val(val);
              if (key == 'photo') {
                imgs = val.split(';');
                $.each(imgs, function(i , url) {
                  if (url != "") $('#memberModalForm div.img_list_show_4').append('<img style="margin-right:10px;width: 100px;height: 100px;" src="' + url + '">');
                })
              }else if (key == 'avatar') {
                imgs = val.split(';');
                $.each(imgs, function(i , url) {
                  if (url != "") $('#memberModalForm div.img_list_show_5').append('<img style="margin-right:10px;width: 100px;height: 100px;" src="' + url + '">');
                })
              }
            })
            memModalValidation();
          }
          var url = 'app/clan_member_mgmt_new_modal.html';
          var formId = 'memberModalForm';
          var closeId = 'memModalClose';
          newModal('修改成员信息', url, fun, 'addMemModal', formId, closeId);
        }
      },
      error : function(e) {
        console.log(e);
      }
    });
  };

  function delMem(id, name) {
    swal({
      title: '确定删除?',
      text: '删除后，战队成员“' + name + '”将无法恢复！',
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
          tname: 'clan_member',
          tid: id
        },
        success : function(data) {
          if (data.success) {
            manager_member.reload();
            swal(
              '删除成功:)',
              '战队成员“' + name + '”已被删除.',
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
