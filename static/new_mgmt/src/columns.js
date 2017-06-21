define([{
  display: '标题',
  name: 'title',
  minWidth: 100,
  width: '15%'
}, {
  display: '链接',
  name: 'newsurl',
  minWidth: 100,
  width: '10%'
}, {
  display: '作者',
  name: 'author',
  minWidth: 120,
  width: '5%'
}, {
  display: '文章来源',
  name: 'source',
  minWidth: 60,
  width: '10%'
}, {
  display: '导读',
  name: 'introduction',
  minWidth: 140,
  width: '10%',
  render: function(rowdata, rowindex, value) {
    return rowdata.content.substr(0, 50);
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
      if (url != "") imgLabel += '<img style="margin-right:10px;width: 50px;height: 50px;" src="' + url + '">';
    })
    return imgLabel;
  }
}, {
  display: '内容',
  name: 'content',
  minWidth: 60,
  width: '15%',
  render: function(rowdata, rowindex, value) {
    return rowdata.content.substr(0, 50);
  }
}, {
  display: '发表时间',
  name: 'times',
  tyep: 'date',
  format: 'yyyy-mm-dd HH:mm:ss',
  minWidth: 140,
  width: '10%'
}, {
  display: '操作',
  isSort: false,
  minWidth: 120,
  width: '15%',
  name: 'Apply',
  render: function(rowdata, rowindex, value) {
    var h = "";
    h += "<button type='button' rowid='" + rowindex + "' name='" + rowdata.title + "' class='btn btn-outline btn-danger btn-xs row-btn row_btn_preview'>预览</button> ";
    h += "<button type='button' id='" + rowdata.news_id + "' class='btn btn-outline btn-info btn-xs row-btn row_btn_edit'>修改</button> ";
    h += "<button type='button' id='" + rowdata.news_id + "' name='" + rowdata.title + "' class='btn btn-outline btn-danger btn-xs row-btn row_btn_del'>删除</button> ";
    return h;
  }
}])
