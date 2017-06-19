define([{
  display: '昵称',
  name: 'nickname',
  minWidth: 100,
  width: '15%'
}, {
  display: '所属标签',
  name: 'tab_name',
  minWidth: 100,
  width: '15%'
}, {
  display: '关注数',
  name: 'follow',
  minWidth: 120,
  width: '10%'
}, {
  display: '排序',
  name: 'queue',
  minWidth: 60,
  width: '10%'
}, {
  display: '是否显示角标',
  name: 'mark',
  minWidth: 140,
  width: '10%',
  render: function(rowdata, rowindex, value) {
    return value == 1 ? '是' : '否';
  }
}, {
  display: '是否正在直播',
  name: 'live',
  minWidth: 140,
  width: '10%',
  render: function(rowdata, rowindex, value) {
    return value == 1 ? '是' : '否';
  }
}, {
  display: '图片',
  name: 'imgs',
  minWidth: 60,
  width: '15%',
  render: function(rowdata, rowindex, value) {
    var imgLabel = "";
    var imgs = rowdata.imgs.split(';');
    $.each(imgs, function(i, url) {
      if (url != "") imgLabel += '<img style="margin-right:10px;width: 50px;height: 50px;" src="' + url + '">';
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
