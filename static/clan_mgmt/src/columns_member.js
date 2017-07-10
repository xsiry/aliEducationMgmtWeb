define([{
  display: '昵称',
  name: 'nickname',
  minWidth: 100,
  width: '10%'
}, {
  display: '姓名',
  name: 'name',
  minWidth: 100,
  width: '10%'
}, {
  display: '照片',
  name: 'photo',
  minWidth: 60,
  width: '10%',
  render: function(rowdata, rowindex, value) {
    var imgLabel = "";
    var imgs = rowdata.photo ? rowdata.photo.split(';') : [];
    $.each(imgs, function(i, url) {
      if (url != "") imgLabel += '<img style="margin-right:10px;width: 50px;height: 28px;" src="' + url + '">';
    })
    return imgLabel;
  }
}, {
  display: '头像',
  name: 'avatar',
  minWidth: 60,
  width: '10%',
  render: function(rowdata, rowindex, value) {
    var imgLabel = "";
    var imgs = rowdata.avatar ? rowdata.avatar.split(';') : [];
    $.each(imgs, function(i, url) {
      if (url != "") imgLabel += '<img style="margin-right:10px;width: 50px;height: 28px;" src="' + url + '">';
    })
    return imgLabel;
  }
}, {
  display: '年龄',
  name: 'age',
  minWidth: 30,
  width: '5%'
}, {
  display: '个人资料',
  name: 'info',
  minWidth: 150,
  width: '15%'
}, {
  display: '鲜花/支持',
  name: 'flowers',
  minWidth: 60,
  width: '10%'
}, {
  display: '赞',
  name: 'thumbs',
  minWidth: 60,
  width: '5%'
}, {
  display: '操作',
  isSort: false,
  minWidth: 120,
  width: '15%',
  name: 'Apply',
  render: function(rowdata, rowindex, value) {
    var h = "";
    h += "<button type='button' id='" + rowdata.cln_mbid + "' class='btn btn-outline btn-info btn-xs row-btn edit_member'>修改</button> ";
    h += "<button type='button' id='" + rowdata.cln_mbid + "' name='" + rowdata.name + "' class='btn btn-outline btn-danger btn-xs row-btn del_member'>删除</button> ";
    return h;
  }
}])
