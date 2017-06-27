define([{
  display: '战队名称',
  name: 'clan_name',
  minWidth: 50,
  width: '5%'
}, {
  display: '所属分组',
  name: 'groupname',
  minWidth: 60,
  width: '5%'
}, {
  display: '战队logo',
  name: 'clan_logo',
  minWidth: 60,
  width: '5%',
  render: function(rowdata, rowindex, value) {
    var imgLabel = "";
    var imgs = rowdata.clan_logo ? rowdata.clan_logo.split(';') : [];
    $.each(imgs, function(i, url) {
      if (url != "") imgLabel += '<img style="margin-right:10px;width: 50px;height: 50px;" src="' + url + '">';
    })
    return imgLabel;
  }
}, {
  display: '战队合影',
  name: 'clan_img',
  minWidth: 60,
  width: '5%',
  render: function(rowdata, rowindex, value) {
    var imgLabel = "";
    var imgs = rowdata.clan_img ? rowdata.clan_img.split(';') : [];
    $.each(imgs, function(i, url) {
      if (url != "") imgLabel += '<img style="margin-right:10px;width: 50px;height: 50px;" src="' + url + '">';
    })
    return imgLabel;
  }
}, {
  display: '战队视频',
  name: 'videourl',
  minWidth: 80,
  width: '5%'
}, {
  display: '战队图片',
  name: 'imgurl',
  minWidth: 60,
  width: '5%',
  render: function(rowdata, rowindex, value) {
    var imgLabel = "";
    var imgs = rowdata.imgurl ? rowdata.imgurl.split(';') : [];
    $.each(imgs, function(i, url) {
      if (url != "") imgLabel += '<img style="margin-right:10px;width: 50px;height: 50px;" src="' + url + '">';
    })
    return imgLabel;
  }
}, {
  display: '胜场',
  name: 'wins',
  minWidth: 15,
  width: '5%'
}, {
  display: '负场',
  name: 'failure',
  minWidth: 15,
  width: '5%'
}, {
  display: '积分',
  name: 'integral',
  minWidth: 30,
  width: '5%'
}, {
  display: '战队介绍',
  name: 'intro',
  minWidth: 60,
  width: '10%'
}, {
  display: '战术介绍',
  name: 'tactics',
  minWidth: 60,
  width: '10%'
}, {
  display: '胜率分析',
  name: 'wnning',
  minWidth: 60,
  width: '10%'
}, {
  display: '支持数',
  name: 'slogan',
  minWidth: 30,
  width: '5%'
}, {
  display: '参赛口号',
  name: 'slogan',
  minWidth: 60,
  width: '5%'
}, {
  display: '排名',
  name: 'ranking',
  minWidth: 20,
  width: '5%'
}, {
  display: '操作',
  isSort: false,
  minWidth: 120,
  width: '10%',
  name: 'Apply',
  render: function(rowdata, rowindex, value) {
    var h = "";
    h += "<button type='button' data-id='" + rowdata.cln_id + "' class='btn btn-outline btn-info btn-xs row-btn row_btn_edit'>修改</button> ";
    h += "<button type='button' data-id='" + rowdata.cln_id + "' data-name='" + rowdata.clan_name + "' class='btn btn-outline btn-danger btn-xs row-btn row_btn_del'>删除</button> ";
    return h;
  }
}])
