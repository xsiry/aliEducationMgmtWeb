define([{
  display: '网吧名称',
  name: 'wangba',
  minWidth: 100,
  width: '15%'
}, {
  display: '网吧图片',
  name: 'imgs',
  minWidth: 60,
  width: '10%',
  render: function(rowdata, rowindex, value) {
    var imgLabel = "";
    var imgs = rowdata.imgs ? rowdata.imgs.split(';') : [];
    $.each(imgs, function(i, url) {
      if (url != "") imgLabel += '<img style="margin-right:10px;width: 50px;height: 50px;" src="' + url + '">';
    })
    return imgLabel;
  }
}, {
  display: '网吧介绍',
  name: 'intro',
  minWidth: 140,
  width: '15%'
}, {
  display: '省会',
  name: 'province',
  minWidth: 140,
  width: '5%'
}, {
  display: '城市',
  name: 'city',
  minWidth: 60,
  width: '5%'
}, {
  display: '地址',
  name: 'address',
  minWidth: 60,
  width: '15%'
}, {
  display: '区域',
  name: 'area',
  minWidth: 60,
  width: '5%'
}, {
  display: '楼层',
  name: 'floor',
  minWidth: 60,
  width: '5%'
}, {
  display: '电话',
  name: 'tel',
  minWidth: 60,
  width: '8%'
}, {
  display: '操作',
  isSort: false,
  minWidth: 120,
  width: '12%',
  name: 'Apply',
  render: function(rowdata, rowindex, value) {
    var h = "";
    h += "<button type='button' id='" + rowdata.cln_wbid + "' class='btn btn-outline btn-info btn-xs row-btn row_btn_edit'>修改</button> ";
    h += "<button type='button' id='" + rowdata.cln_wbid + "' name='" + rowdata.wangba + "' class='btn btn-outline btn-danger btn-xs row-btn row_btn_del'>删除</button> ";
    return h;
  }
}])
