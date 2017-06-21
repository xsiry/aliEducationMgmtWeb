define([{
  display: '比赛时间',
  name: 'times',
  minWidth: 100,
  width: '15%'
}, {
  display: '比赛省会',
  name: 'province',
  minWidth: 60,
  width: '10%'
}, {
  display: '战队A',
  name: 'clan_name_a',
  minWidth: 140,
  width: '10%'
}, {
  display: '战队A比分',
  name: 'a_score',
  minWidth: 60,
  width: '10%'
}, {
  display: '战队B',
  name: 'clan_name_b',
  minWidth: 140,
  width: '10%'
}, {
  display: '战队B比分',
  name: 'b_score',
  minWidth: 60,
  width: '10%'
}, {
  display: '直播地址',
  name: 'live_url',
  minWidth: 60,
  width: '15%'
}, {
  display: '是否统计',
  name: 'status',
  minWidth: 60,
  width: '5%',
  render: function(rowdata, rowindex, value) {
    return value == 0 ? '否' : '是';
  }
}, {
  display: '操作',
  isSort: false,
  minWidth: 120,
  width: '15%',
  name: 'Apply',
  render: function(rowdata, rowindex, value) {
    var h = "";
    h += "<button type='button' id='" + rowdata.ms_id + "' class='btn btn-outline btn-info btn-xs row-btn row_btn_edit'>修改</button> ";
    h += "<button type='button' id='" + rowdata.ms_id + "' name='" + rowdata.times + "' class='btn btn-outline btn-danger btn-xs row-btn row_btn_del'>删除</button> ";
    return h;
  }
}])
