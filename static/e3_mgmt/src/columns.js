define([{
  display: '标题',
  name: 'title',
  minWidth: 100,
  width: '25%'
}, {
  display: '类型',
  name: 'type',
  minWidth: 120,
  width: '10%',
  render: function(rowdata, rowindex, value) {
    var text = '';
    if (value == 0) {
      text = '轮播图片';
    }else if (value == 1) {
      text = '静态图片';
    }else if (value == 2) {
      text = '视频';
    }
    return text;
  }
}, {
  display: '资源地址',
  name: 'imgurl',
  minWidth: 60,
  width: '30%',
  render: function(rowdata, rowindex, value) {
    if (rowdata.type == 0 || rowdata.type == 1) {
      var imgLabel = "";
      var imgs = rowdata.imgurl ? rowdata.imgurl.split(';') : [];
      $.each(imgs, function(i, url) {
        if (url != "") imgLabel += '<img style="margin-right:10px;width: 50px;height: 50px;" src="' + url + '">';
      })
      return imgLabel;
    }else {
      return value;
    }

  }
}, {
  display: '点击',
  name: 'click',
  minWidth: 140,
  width: '10%'
}, {
  display: '状态',
  name: 'status',
  minWidth: 60,
  width: '10%',
  render: function(rowdata, rowindex, value) {
    return value == 1 ? '已应用' : '未应用';
  }
}, {
  display: '操作',
  isSort: false,
  minWidth: 120,
  width: '15%',
  name: 'Apply',
  render: function(rowdata, rowindex, value) {
    var h = "";
    if (rowdata.status == 0) h += "<button type='button' id='" + rowdata.gp_id + "' name='" + rowdata.hvr_name + "' class='btn btn-outline btn-info btn-xs row-btn row_btn_apply'>应用</button> ";
    h += "<button type='button' id='" + rowdata.gp_id + "' class='btn btn-outline btn-info btn-xs row-btn row_btn_edit'>修改</button> ";
    h += "<button type='button' id='" + rowdata.gp_id + "' name='" + rowdata.title + "' class='btn btn-outline btn-danger btn-xs row-btn row_btn_del'>删除</button> ";
    return h;
  }
}])