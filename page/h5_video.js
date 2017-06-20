
//反射調用
var myVideo=document.getElementById("video");

var invokeFieldOrMethod = function(element, method) {
  var usablePrefixMethod;
  ["webkit", "moz", "ms", "o", ""].forEach(function(prefix) {
    if (usablePrefixMethod) return;
    if (prefix === "") {
      // 无前缀，方法首字母小写
      method = method.slice(0, 1).toLowerCase() + method.slice(1);
    }
    var typePrefixMethod = typeof element[prefix + method];
    if (typePrefixMethod + "" !== "undefined") {
      if (typePrefixMethod === "function") {
        usablePrefixMethod = element[prefix + method]();
      } else {
        usablePrefixMethod = element[prefix + method];
      }
    }
  });

  return usablePrefixMethod;
};

// 播放、暂停
function playPause()
{
  if (myVideo.paused) {
    myVideo.play();
    $('.play_video').empty().append('<svg class="svg_icon" viewBox="0 0 1024 1024">'
    + '<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#pause_svg"></use></svg>');
  }else{
    myVideo.pause();
    $('.play_video').empty().append('<svg class="svg_icon" viewBox="0 0 1024 1024">'
    + '<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#play_svg"></use></svg>');
  }
}

//進入全屏
function launchFullscreen(element) {
  //此方法不可以在異步任務中執行，否則火狐無法全屏
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen();
  } else if (element.oRequestFullscreen) {
    element.oRequestFullscreen();
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullScreen();
  } else {

    var docHtml = document.documentElement;
    var docBody = document.body;
    var videobox = document.getElementById('videobox');
    var cssText = 'width:100%;height:100%;overflow:hidden;';
    docHtml.style.cssText = cssText;
    docBody.style.cssText = cssText;
    videobox.style.cssText = cssText + ';' + 'margin:0px;padding:0px;';
    document.IsFullScreen = true;

  }
}
//退出全屏
function exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.oRequestFullscreen) {
    document.oCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  } else {
    var docHtml = document.documentElement;
    var docBody = document.body;
    var videobox = document.getElementById('videobox');
    docHtml.style.cssText = "";
    docBody.style.cssText = "";
    videobox.style.cssText = "";
    document.IsFullScreen = false;
  }
}
$('.play_video').on('click', function() {
  playPause();
})
document.getElementById('fullScreenBtn').addEventListener('click', function() {
  launchFullscreen(document.getElementById('video'));
  window.setTimeout(function exit() {
    //檢查瀏覽器是否處於全屏
    if (invokeFieldOrMethod(document, 'FullScreen') || invokeFieldOrMethod(document, 'IsFullScreen') || document.IsFullScreen) {
      exitFullscreen();
    }
  }, 5 * 1000);
}, false);