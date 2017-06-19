define(function(require, exports, module) {
  $.root_ = $('div.ibox-content');
  var manager, g, g_tabs, manager_tabs;
  module.exports = {

    init: function() {
      f_initGrid();
      this._configText();
      this._bindUI();
    },
    _configText() {
      $('div h5.mgmt_title').text('直播列表');
      $('div button font.mgmt_new_btn').text('添加直播');
      $('div button font.tabs_mgmt_btn').text('管理标签');
      $('div input.name_search').prop('placeholder', '输入直播标题');
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
        var fun = function(dialogRef) {
          tabSelCombo();
          newModalValidation();
        }
        newModal('添加直播', fun);
      })

      $.root_.on("click", '.tabs_mgmt_modal_btn', function(e) {
        var fun = function(dialogRef) {
          f_initTabsGrid();
        }
        tabsModal('标签管理', fun);
      })

      $.root_.on("click", '.row_btn_preview', function(e) {
        var rowid = $(e.currentTarget).attr('rowid');
        var fun = function(dialogRef) {
          var row = manager.getRow(rowid);
          $('.new_title h3').text(row.title);
          $('.new_author').text(row.author);
          $('.new_introduction p').text(row.introduction);
          $('.new_conten').text(row.content);
          $('.new_source').text(row.source);
          $('.new_times').text(row.times);
          $.each(row.imgs.split(';'), function(i , url) {
            if (url != "") $('.new_picture').append('<img style="margin-right:10px;width: 100px;height: 100px;" src="' + url + '">');
          });
        }
        previewModal(name, fun);
      })



      $('body').on("click", '.upload_new_imgs', function(e) {
        BootstrapDialog.show({
          title: '文件上传',
          type: 'BootstrapDialog.TYPE_SUCCESS',
          size: 'size-wide',
          closeByBackdrop: false,
          message: $('<div class="img_upload" data-url="system/fileupload" data-mincount=1 data-maxcount=3 data-types="image, flash" data-async=false></div>')
            .load('app/upload_file.html'),
          onshown: function(dialogRef) {
            $('#newModal').hide();
            $('#previewModal').hide();
            $('#x_file').on('filebatchuploadsuccess', function(event, data, previewId, index) {
              var reData = data.response;
              if (reData.success) {
                var imgs = [];
                $('#newModalForm div.img_list_show').empty().css('text-align', 'center');
                $.each(reData.result, function(i, url) {
                  imgs.push(url);
                  $('#newModalForm div.img_list_show').append('<img style="margin-right:10px;width: 100px;height: 100px;" src="' + url + '">');
                })
                $('#newModalForm input[name="imgs"]').val(imgs.join(';'));
                dialogRef.close();
              }
            })
            $('#x_file').on('filebatchuploaderror', function(event, data, msg) {
               consol.log("服务器内部错误，请联系管理员！")
            })
          },
          onhidden: function(dialogRef){
            $('#newModal').show();
            $('#previewModal').show();
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

      // 标签管理bind
      $('body').on("click", '.add_tabs', function(e) {
        addTabsNewRow();
      })
      $('body').on("click", '.tabs_row_btn_edit', function(e) {
        var rowid = $(e.currentTarget).attr('rowid');
        beginTabsEdit(rowid);
      })
      $('body').on("click", '.tabs_row_btn_cancel', function(e) {
        var rowid = $(e.currentTarget).attr('rowid');
        cancelTabsEdit(rowid);
      })
      $('body').on("click", '.tabs_row_btn_end', function(e) {
        var rowid = $(e.currentTarget).attr('rowid');
        var id = $(e.currentTarget).attr('id');
        endTabsEdit(rowid, id);
      })
      $('body').on("click", '.tabs_row_btn_del', function(e) {
        var rowid = $(e.currentTarget).attr('rowid');
        var id = $(e.currentTarget).attr('id');
        delTabsRow(rowid, id);
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
      parms: { source: 'lv_beauty_info' },
      method: "get",
      dataAction: 'server',
      usePager: true,
      enabledEdit: false,
      clickToEdit: false,
      width: '100%',
      height: '91%',
      sortName: 'nickname',
      sortOrder: 'ASC'
    });
  };

  function f_initTabsGrid() {
    var c = require('./columns_tabs');
    g_tabs = manager_tabs = $("div.tabsListDiv").ligerGrid({
      columns: c,
      onSelectRow: function(rowdata, rowindex) {
        $("#txtrowindex").val(rowindex);
      },
      url: 'query/table',
      parms: { source: 'lv_tabs' },
      method: "get",
      dataAction: 'server',
      usePager: true,
      enabledEdit: true,
      clickToEdit: false,
      width: '100%',
      height: '91%',
      sortName: 'tab_name',
      sortOrder: 'ASC',
      onAfterEdit: function(e) {
        var tab_id = e.record.tab_id;
        var tab_name = e.record.tab_name;
        var queue = e.record.queue;
        var top = e.record.top;
        if (!tab_name) {
          $.ligerDialog.error("标签名称不能为空！");
          return false;
        }
        var params = {tab_id: tab_id, tab_name: tab_name, queue: queue, top: top};
        $.ajax({
        type : 'POST',
        url : 'save/table',
        dataType : 'json',
        data : {
          actionname: 'lv_tabs',
          datajson: JSON.stringify(params)
        },
        success : function(result) {
            toastr.options = {
              closeButton: true,
              progressBar: true,
              showMethod: 'slideDown',
              timeOut: 4000
            };
            if (result.success) {
              msg = "标签列表操作成功！";
              manager_tabs.reload();
              toastr.success(msg);
            } else {
              msg = "标签列表操作失败！";
              toastr.error(msg);
            };
          }
        });
      }
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
        source: 'lv_beauty_info',
        sourceid: id
      },
      success : function(data) {
        if (data) {
          var fun = function() {
            var imgs = [];
            var selectedVal = '';
            $.each(data, function(key, val) {
              $('#newModalForm input[name="'+ key +'"]').val(val);
              if (key == 'imgs') {
                imgs = val.split(';');
              }else if ((key == 'mark' && val == 1) || (key == 'live' && val == 1)) {
                $('#newModalForm input[name="'+ key +'"]').prop('checked','checked');
              }else if (key == 'tab_id') {
                selectedVal = val;
              }
            })
            tabSelCombo(selectedVal);
            newModalValidation();
            $.each(imgs, function(i , url) {
              if (url != "") $('#newModalForm div.img_list_show').append('<img style="margin-right:10px;width: 100px;height: 100px;" src="' + url + '">');
            })
          }
          newModal('修改直播', fun);
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
      text: '删除后，新闻《' + name + '》将无法恢复！',
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
          tname: 'lv_beauty_info',
          tid: id
        },
        success : function(data) {
          if (data.success) {
            manager.reload();
            swal(
              '删除成功:)',
              '新闻《' + name + '》已被删除.',
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
        //   '新闻《' + name + '》未删除 :)',
        //   'error'
        // )
      }
    })
  };

  function newModal(title, onshowFun) {
    var modal = BootstrapDialog.show({
      id: 'newModal',
      title: title,
      size: 'size-wide',
      message: $('<div></div>').load('app/lv_mgmt_modal.html'),
      cssClass: 'modal inmodal fade',
      buttons: [{
        type: 'submit',
        icon: 'glyphicon glyphicon-check',
        label: '保存',
        cssClass: 'btn btn-primary',
        autospin: false,
        action: function(dialogRef) {
          $('#newModalForm').submit();
        }
      }, {
        id: 'newModalClose',
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

  function tabsModal(title, onshowFun) {
    var modal = BootstrapDialog.show({
      id: 'tabsModal',
      title: title,
      size:  'size-normal',
      message: $('<div></div>').load('app/lv_tabs_modal.html'),
      cssClass: 'modal inmodal fade',
      buttons: [{
        id: 'previewModalClose',
        label: '关闭',
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

          if (o.name == "lv_tab_val") formVals["tab_id"] = o.value;
          formVals["mark"] = (o.name == "mark" && o.value == "on") ? 1 : 0;
          formVals["live"] = (o.name == "live" && o.value == "on") ? 1 : 0;
        });
        var data = {
          actionname: 'lv_beauty_info',
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
          if (result.success) {
            msg = "直播添加成功！";
            toastr.success(msg);
          } else {
            msg = "直播添加失败！";
            toastr.error(msg);
          };

          $('#newModalClose').click();
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

  function tabSelCombo(selectedVal) {
    $.ajax({
      type : 'GET',
      url : 'query/table',
      dataType : 'json',
      data : {
        source: 'lv_tabs',
        qtype: 'select'
      },
      success : function(data) {
        if (data) {
          $('select.tab_sel').empty();
          $.each(data, function(i, o) {
            $('select.tab_sel').append('<option value="'+ o.tab_id +'" ' + (selectedVal == o.tab_id ? 'selected="selected"' : '') + '>'+ o.tab_name +'</option>');
          })
        }
        initCombo();
      },
      error : function(e) {
        console.log(e);
      }
    });
  }

  // 标签管理功能
  function addTabsNewRow() {
    manager_tabs.addEditRow();
  }

  function beginTabsEdit(rowid) {
    manager_tabs.beginEdit(rowid);
  };

  function cancelTabsEdit(rowid) {
    manager_tabs.cancelEdit(rowid);
  };

  function endTabsEdit(rowid) {
    manager_tabs.endEdit(rowid);
  };

  function delTabsRow(rowid) {
    var row = manager_tabs.getRow(rowid);
    swal({
      title: '确定删除?',
      text: '删除后，标签“' + row.tab_name + '”将无法恢复！',
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
          tname: 'lv_tabs',
          tid: row.tab_id
        },
        success : function(data) {
          if (data.success) {
            manager_tabs.deleteRow(rowid);
            swal(
              '删除成功:)',
              '标签“' + row.tab_name + '”已被删除.',
              'success'
            )
            manager_tabs.reload();
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
        //   '新闻《' + name + '》未删除 :)',
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
