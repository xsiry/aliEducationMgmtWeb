define([{
  display: '昵称',
  name: 'nickname',
  minWidth: 100,
  width: '10%'
}, {
  display: '所属标签',
  name: 'tab_name',
  minWidth: 100,
  width: '10%'
}, {
  display: '点击地址',
  name: 'clickurl',
  minWidth: 120,
  width: '15%'
}, {
  display: '关注数',
  name: 'follow',
  minWidth: 80,
  width: '10%'
}, {
  display: '排序',
  name: 'queue',
  minWidth: 50,
  width: '5%'
}, {
  display: '是否显示角标',
  name: 'mark',
  minWidth: 50,
  width: '5%',
  render: function(rowdata, rowindex, value) {
    return value == 1 ? '是' : '否';
  }
}, {
  display: '角标文本',
  name: 'markname',
  minWidth: 50,
  width: '5%'
}, {
  display: '角标图片',
  name: 'markurl',
  minWidth: 50,
  width: '10%',
  render: function(rowdata, rowindex, value) {
    var imgLabel = "";
    var imgs = rowdata.markurl ? rowdata.markurl.split(';') : [];
    $.each(imgs, function(i, url) {
      if (url != "") imgLabel += '<img style="margin-right:10px;width: 50px;height: 28px;" src="' + url + '">';
    })
    return imgLabel;
  }
}, {
  display: '是否正在直播',
  name: 'live',
  minWidth: 50,
  width: '5%',
  render: function(rowdata, rowindex, value) {
    return value == 1 ? '是' : '否';
  }
}, {
  display: '图片',
  name: 'imgs',
  minWidth: 60,
  width: '10%',
  render: function(rowdata, rowindex, value) {
    var imgLabel = "";
    var imgs = rowdata.imgs.split(';');
    $.each(imgs, function(i, url) {
      if (url != "") imgLabel += '<img style="margin-right:10px;width: 50px;height: 28px;" src="' + url + '">';
    })
    return imgLabel;
  }
}, {
  display: '操作',
  isSort: false,
  minWidth: 120,
  width: '15%',
  name: 'Apply',
  render: function(rowdata, rowindex, value) {
    var h = "";
    h += "<button type='button' id='" + rowdata.lvbi_id + "' class='btn btn-outline btn-info btn-xs row-btn row_btn_edit'>修改</button> ";
    h += "<button type='button' id='" + rowdata.lvbi_id + "' name='" + rowdata.nickname + "' class='btn btn-outline btn-danger btn-xs row-btn row_btn_del'>删除</button> ";
    return h;
  }
}])
