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
      $('div h5.mgmt_title').text('主页管理');
      $('div button font.set_coupons_btn').text('欢迎文字和秒杀活动设置');
      $('div button font.mgmt_new_btn').text('添加视频推荐位资源');
      $('div input.name_search').prop('placeholder', '输入资源标题');
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
        newModal('添加推荐位资源', fun);
      })

      $.root_.on("click", '.set_coupons_btn', function(e) {
        var fun = function(dialogRef) {
          $.ajax({
            type : 'GET',
            url : 'query/table',
            dataType : 'json',
            data : {
              source: 'member_coupons',
              sourceid: 1
            },
            success : function(data) {
              if (data) {
                $('#couponsModalForm .mc_welcome').val(data.welcome);
                $('#couponsModalForm .mc_title').val(data.title);
                $('#couponsModalForm .mc_clickurl').val(data.clickurl);
                $('#couponsModalForm .mc_price').val(data.price);
                $('#couponsModalForm .mc_priceimg').val(data.priceimg);
                $('#couponsModalForm .mc_imgs').val(data.imgs);
                $('#couponsModalForm .mc_prompt').val(data.prompt);
                $.each(data.imgs.split(';'), function(i , url) {
                  if (url != "") $('#couponsModalForm .img_list_show').append('<img style="margin-right:10px;width: 100px;height: 100px;" src="' + url + '">');
                });
                $.each(data.priceimg.split(';'), function(i , url) {
                  if (url != "") $('#couponsModalForm .img_list_show_price').append('<img style="margin-right:10px;width: 100px;height: 100px;" src="' + url + '">');
                });
              }
            },
            error : function(e) {
              console.log(e);
            }
          });
          couponsModalValidation();
        }
        couponsModal('秒杀活动设置', fun);
      })

      $('body').on("click", '.upload_coupons_imgs', function(e) {
        var type = $(e.currentTarget).data('type');
        var modal = 'couponsModal';
        var form = 'couponsModalForm';
        var name = 'imgs';
        if (type == 1) {
          modal = 'newModal';
          form = 'newModalForm';
          name = 'imgurl';
        }else if (type == 3) {
          name = 'priceimg';
        }
        new BootstrapDialog({
          title: '文件上传',
          type: 'upload_img',
          size: 'size-wide',
          closeByBackdrop: false,
          message: $('<div class="img_upload" data-url="system/fileupload" data-mincount=1 data-maxcount=1 data-types="image, flash" data-async=false></div>')
            .load('app/upload_file.html'),
          onshow: function(dialogRef) {
            if($('.modal-backdrop').length > 1) {$('.modal-backdrop').last().remove()};
            if($('.upload_img').length > 1) {$('.upload_img').last().remove()};
          },
          onshown: function(dialogRef) {
            if($('.modal-backdrop').length > 1) {$('.modal-backdrop').last().remove()};
            if($('.upload_img').length > 1) {$('.upload_img').last().remove()};
            $('#'+modal).hide();
            $('#x_file').on('filebatchuploadsuccess', function(event, data, previewId, index) {
                reData = data.response;
              if (reData.success) {
                var imgs = [];
                $('#' + form + ' div.img_list_show' + (type == 3 ? '_price' : '')).empty();
                $.each(reData.result, function(i, url) {
                  imgs.push(url);
                  $('#' + form + ' div.img_list_show' + (type == 3 ? '_price' : '')).append('<img style="margin-right:10px;width: 100px;height: 100px;" src="' + url + '">');
                })
                $('#' + form + ' input[name="'+ name +'"]').val(imgs.join(';'));
                dialogRef.close();
              }
            })
            $('#x_file').on('filebatchuploaderror', function(event, data, msg) {
               consol.log("服务器内部错误，请联系管理员！")
            })
          },
          onhidden: function(dialogRef){
            $('#'+modal).show();
          }
        }).open();
      })

      // bind grid edit
      $.root_.on("click", '.row_btn_apply', function(e) {
        var id = $(e.currentTarget).attr('id');
        var name = $(e.currentTarget).attr('name');
        applyRow(id, name);
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
    var c = require('./columns_video');
    g = manager = $("div.listDiv").ligerGrid({
      columns: c,
      onSelectRow: function(rowdata, rowindex) {
        $("#txtrowindex").val(rowindex);
      },
      url: 'query/table',
      parms: { source: 'home_videorec' },
      method: "get",
      dataAction: 'server',
      usePager: true,
      enabledEdit: false,
      clickToEdit: false,
      width: '100%',
      height: '91%',
      sortName: 'hvr_name',
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
          tname: 'home_videorec',
          tid: id
        },
        success : function(data) {
          if (data.success) {
            manager.reload();
            swal(
              '删除成功!',
              '资源“' + name + '”已被删除 :)',
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
        //   '资源《“' + name + '”》未删除！',
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
      message: $('<div></div>').load('app/main_mgmt_modal.html'),
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

  function couponsModal(title, onshowFun) {
    var modal = BootstrapDialog.show({
      id: 'couponsModal',
      title: title,
      size:  'size-wide',
      message: $('<div></div>').load('app/main_coupons_modal.html'),
      cssClass: 'modal inmodal fade',
      buttons: [{
        type: 'submit',
        icon: 'glyphicon glyphicon-check',
        label: '设置',
        cssClass: 'btn btn-primary',
        autospin: false,
        action: function(dialogRef) {
          $('#couponsModalForm').submit();
        }
      }, {
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
        var formVals = {status: 0};
        $.each($form.serializeArray(), function(i, o) {
          formVals[o.name] = o.value;
          if (o.name == "status") {formVals["status"] = 1};
        });
        var data = {
          actionname: 'home_videorec',
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
            msg = "资源操作成功！";
            toastr.success(msg);
          } else {
            msg = "资源操作失败！";
            toastr.error(msg);
          };

          $('#newModalClose').click();
        }, 'json');
      });
  };

  function couponsModalValidation() {
    $('#couponsModalForm').formValidation({
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
          actionname: 'member_coupons',
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
            msg = "秒杀活动设置成功！";
            toastr.success(msg);
          } else {
            msg = "秒杀活动设置失败！";
            toastr.error(msg);
          };

          $('#couponsModal').click();
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
