define([{
  display: '名称',
  name: 'tab_name',
  minWidth: 100,
  width: '25%',
  editor: { type: 'text'}
}, {
  display: '排序',
  name: 'queue',
  minWidth: 60,
  width: '25%',
  editor: { type: 'int'}
}, {
  display: '是否置顶',
  name: 'top',
  minWidth: 140,
  width: '20%',
  editor: { type: 'select', data: [{ top: 1, text: '是' }, { top: 0, text: '否'}], valueField: 'top' },
  render: function(rowdata, rowindex, value) {
    return value == 1 ? '是' : '否';
  }
}, {
  display: '操作',
  isSort: false,
  minWidth: 120,
  width: '30%',
  name: 'Apply',
  render: function(rowdata, rowindex, value) {
    var h = "";
    if (!rowdata._editing) {
      h += "<button type='button' rowid='" + rowindex + "' class='btn btn-outline btn-info btn-xs row-btn tabs_row_btn_edit'>修改</button> ";
      h += "<button type='button' id='" + rowdata.tab_id + "' rowid='" + rowindex + "' class='btn btn-outline btn-danger btn-xs row-btn tabs_row_btn_del'>删除</button> ";
    } else {
      h += "<button type='button' rowid='" + rowindex + "' class='btn btn-outline btn-primary btn-xs row-btn tabs_row_btn_end'>提交</button> ";
      h += "<button type='button' id='" + rowdata.tab_id + "' rowid='" + rowindex + "' class='btn btn-outline btn-info btn-xs row-btn tabs_row_btn_cancel'>取消</button> ";
    }
    return h;
  }
}])
