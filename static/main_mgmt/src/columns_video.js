define([{
  display: '标题',
  name: 'hvr_name',
  minWidth: 100,
  width: '20%'
}, {
  display: '视频地址',
  name: 'videurl',
  minWidth: 120,
  width: '20%'
}, {
  display: '点击地址',
  name: 'clickurl',
  minWidth: 60,
  width: '20%'
}, {
  display: '状态',
  name: 'status',
  minWidth: 60,
  width: '10%',
  render: function(rowdata, rowindex, value) {
    return value == 1 ? '已应用' : '未应用';
  }
}, {
  display: '创建时间',
  name: 'createtime',
  minWidth: 60,
  width: '15%'
}, {
  display: '操作',
  isSort: false,
  minWidth: 120,
  width: '15%',
  name: 'Apply',
  render: function(rowdata, rowindex, value) {
    var h = "";
    h += "<button type='button' id='" + rowdata.hvr_id + "' name='" + rowdata.hvr_name + "' class='btn btn-outline btn-info btn-xs row-btn row_btn_apply'>应用</button> ";
    h += "<button type='button' id='" + rowdata.hvr_id + "' name='" + rowdata.hvr_name + "' class='btn btn-outline btn-danger btn-xs row-btn row_btn_del'>删除</button> ";
    return h;
  }
}])
