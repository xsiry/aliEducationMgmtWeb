BootstrapDialog.show({
  title: '文件上传',
  size: 'BootstrapDialog.SIZE_WIDE',
  closeByBackdrop: false,
  message: $('<div class="img_upload" data-url="/" data-mincount=1 data-maxcount=3 data-types="image, flash" data-async=false></div>')
    .load('app/upload_file.html'),
  onshown: function(dialogRef) {
    $('#x_file').on('fileuploaded', function(event, data, previewId, index) {
      console.log('File uploaded triggered');
    })
    $('#x_file').on('fileuploaderror', function(event, data, msg) {
      console.log('File upload error');
      // get message
      alert(msg);
    });
    $('#x_file').on('filebatchuploadsuccess', function(event, data, previewId, index) {
      console.log('File batch upload success');
    })
    $('#x_file').on('filebatchuploaderror', function(event, data, msg) {
      console.log('File batch upload error');
      // get message
      alert(msg);
    })
  }
});
