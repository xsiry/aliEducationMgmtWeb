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
      $('div h5.mgmt_title').text('动态推广资源列表');
      $('div button font.mgmt_new_btn').text('添加推广');
      $('div input.name_search').prop('placeholder', '输入推广资源标题');
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
          newModalValidation();
        }
        newModal('添加推广资源', fun);
      })

      $('body').on("change", 'input[name="type"]', function(e) {
        var type = $(e.currentTarget).val();
        $('.video_block').hide();
        $('.imgs_block').hide();
        $('.img_block').hide();
        $('.img_main_block').hide();
        if (type == 0) {
          $('.imgs_block').show();
        }else if(type == 1){
          $('.img_block').show();
        }else if(type == 2) {
          $('.video_block').show();
        }else if(type == 3){
          $('.img_main_block').show();
        }
      })

      $.root_.on("click", '.row_btn_apply', function(e) {
        var id = $(e.currentTarget).attr('id');
        var name = $(e.currentTarget).attr('name');
        applyRow(id, name);
      })

      $('body').on("click", '.upload_new_imgs', function(e) {
        var type = $(e.currentTarget).data("type");
        var number = type == 0 ? 4 : 1;
        BootstrapDialog.show({
          title: '文件上传',
          type: 'BootstrapDialog.TYPE_SUCCESS',
          size: 'size-wide',
          closeByBackdrop: false,
          message: $('<div class="img_upload" data-url="system/fileupload" data-mincount=1 data-maxcount='+ number +' data-types="image" data-async=false></div>')
            .load('app/upload_file.html'),
          onshown: function(dialogRef) {
            $('#newModal').hide();
            $('#previewModal').hide();
            $('#x_file').on('filebatchuploadsuccess', function(event, data, previewId, index) {
              var reData = data.response;
              if (reData.success) {
                var imgs = [];
                $('#newModalForm div.img_list_show_'+ type).empty().css('text-align', 'center');
                $.each(reData.result, function(i, url) {
                  imgs.push(url);
                  $('#newModalForm div.img_list_show_'+ type).append('<img style="margin-right:10px;width: 100px;height: 100px;" src="' + url + '">');
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
      parms: { source: 'gm_promotion' },
      method: "get",
      dataAction: 'server',
      usePager: true,
      enabledEdit: false,
      clickToEdit: false,
      width: '100%',
      height: '91%',
      sortName: 'dtpr_id',
      sortOrder: 'ASC'
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

  function applyRow(id, name) {
    var applyVals = {hvr_id: id, status: 1};
    swal({
      title: '是否应用?',
      text: '应用后，资源“' + name + '”将在推荐位展示！',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: '应用',
      cancelButtonText: '取消'
    }).then(function() {
      $.ajax({
        type : 'POST',
        url : 'save/table',
        dataType : 'json',
        data : {
          actionname: 'home_videorec',
          datajson: JSON.stringify(applyVals)
        },
        success : function(result) {
          toastr.options = {
            closeButton: true,
            progressBar: true,
            showMethod: 'slideDown',
            timeOut: 4000
          };
          if (result.success) {
            swal(
              '应用成功 :)',
              '资源“' + name + '” :)已应用到推荐位',
              'success'
            );
            manager.reload();
          }else{
            swal(
              '应用失败！',
              '未知错误，请联系管理员或查看日志',
              'error'
            )
          }
        },
        error : function(e) {
          console.log(e);
        }
      });
    }, function(dismiss) {
      if (dismiss === 'cancel') {
        // swal(
        //   '已取消',
        //   '资源《“' + name + '”》未删除！',
        //   'error'
        // )
      }
    })
  };

  function editRow(id) {
    $.ajax({
      type : 'GET',
      url : 'query/table',
      dataType : 'json',
      data : {
        source: 'gm_promotion',
        sourceid: id
      },
      success : function(data) {
        if (data) {
          var fun = function() {
            newModalValidation();
            var imgs = [];
            var type = parseInt(data.type);
            $('input[name="type"][value='+ type +']').click();
            $.each(data, function(key, val) {
              if (key != 'type') {
                $('#newModalForm input[name="'+ key +'"]').val(val);
              }
              if (key == 'imgurl' && type != 2) {
                imgs = val.split(';');
              }else if (key == 'status' && val == 1) {
                $('#newModalForm input[name="'+ key +'"]').prop('checked','checked');
              }else if (key == 'imgurl' && type == 2) {
                $('input[name="video_url"]').val(val);
              }
            })
            $.each(imgs, function(i , url) {
              if (url != "") $('#newModalForm div.img_list_show_'+type).append('<img style="margin-right:10px;width: 100px;height: 100px;" src="' + url + '">');
            })
          }
          newModal('修改推广', fun);
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
      text: '删除后，资源“' + name + '”将无法恢复！',
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
          tname: 'gm_promotion',
          tid: id
        },
        success : function(data) {
          if (data.success) {
            manager.reload();
            swal(
              '删除成功:)',
              '资源“' + name + '”已被删除.',
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

  function newModal(title, onshowFun) {
    var modal = BootstrapDialog.show({
      id: 'newModal',
      title: title,
      size: 'size-wide',
      message: $('<div></div>').load('app/e3_index_mgmt_modal.html'),
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

        var imgurl = '';
        if (formVals['type'] == 2) {
          imgurl = formVals['video_url'];
        }else {
          imgurl = formVals['imgs'];
        }
        formVals['imgurl'] = imgurl;

        var data = {
          actionname: 'gm_promotion',
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
