define([{
  display: '标题',
  name: 'title',
  minWidth: 140,
  width: '10%',
  render: function(rowdata, rowindex, value) {
    var text = '无';
    if (rowdata.type == 2 || rowdata.type == 0) {
      text = value;
    }
    return text;
  }
}, {
  display: '类型',
  name: 'type',
  minWidth: 120,
  width: '15%',
  render: function(rowdata, rowindex, value) {
    var text = '';
    if (value == 0) {
      text = '联赛主页（轮播图片）';
    }else if (value == 2) {
      text = '专区主页（联赛图片）';
    }else if (value == 1) {
      text = '联赛主页（在线视频）';
    }else if (value == 3) {
      text = '赛程安排主页（顶部图片）';
    }
    return text;
  }
}, {
  display: '资源地址',
  name: 'imgurl',
  minWidth: 60,
  width: '40%',
  render: function(rowdata, rowindex, value) {
    if (rowdata.type == 0 || rowdata.type == 2 || rowdata.type == 3) {
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
  width: '15%',
  render: function(rowdata, rowindex, value) {
    return value == 1 ? '已应用' : '未应用';
  }
}, {
  display: '操作',
  isSort: false,
  minWidth: 120,
  width: '20%',
  name: 'Apply',
  render: function(rowdata, rowindex, value) {
    var h = "";
    if (rowdata.status == 0) h += "<button type='button' data-id='" + rowdata.gp_id + "' data-name='" + rowdata.title + "' data-type='"+ rowdata.type +"' class='btn btn-outline btn-info btn-xs row-btn row_btn_apply'>应用</button> ";
    h += "<button type='button' data-id='" + rowdata.gp_id + "' class='btn btn-outline btn-info btn-xs row-btn row_btn_edit'>修改</button> ";
    h += "<button type='button' data-id='" + rowdata.gp_id + "' data-name='" + rowdata.title + "' class='btn btn-outline btn-danger btn-xs row-btn row_btn_del'>删除</button> ";
    return h;
  }
}])
