<?php
// ini_set('display_errors',1); //错误信息 
// ini_set('display_startup_errors',1); //php启动错误信息 
// error_reporting(-1); 
header("Content-type:text/html;charset=utf-8");
include_once 'mysql.php';
include_once 'functions.php';
include_once 'sqlutils.php';

$token = isset($_POST['token']) ? $_POST['token'] : '';
$a=isset($_POST['a']) ? $_POST['a'] : '';

function getMillisecond() {
	list($t1, $t2) = explode(' ', microtime());
	return (float)sprintf('%.0f',(floatval($t1)+floatval($t2))*1000);
}

function image_center_crop($source, $width, $height, $target)
{
    if (!file_exists($source)) return false;
    /* 根据类型载入图像 */
    switch (exif_imagetype($source)) {
        case IMAGETYPE_JPEG:
            $image = imagecreatefromjpeg($source);
            break;
        case IMAGETYPE_PNG:
            $image = imagecreatefrompng($source);
            break;
        case IMAGETYPE_GIF:
            $image = imagecreatefromgif($source);
            break;
    }
    if (!isset($image)) return false;
    /* 获取图像尺寸信息 */
    $target_w = $width;
    $target_h = $height;
    $source_w = imagesx($image);
    $source_h = imagesy($image);
    /* 计算裁剪宽度和高度 */
    $judge = (($source_w / $source_h) > ($target_w / $target_h));
    $resize_w = $judge ? ($source_w * $target_h) / $source_h : $target_w;
    $resize_h = !$judge ? ($source_h * $target_w) / $source_w : $target_h;
    $start_x = $judge ? ($resize_w - $target_w) / 2 : 0;
    $start_y = !$judge ? ($resize_h - $target_h) / 2 : 0;
    /* 绘制居中缩放图像 */
    $resize_img = imagecreatetruecolor($resize_w, $resize_h);
    imagecopyresampled($resize_img, $image, 0, 0, 0, 0, $resize_w, $resize_h, $source_w, $source_h);
    $target_img = imagecreatetruecolor($target_w, $target_h);
    imagecopy($target_img, $resize_img, 0, 0, $start_x, $start_y, $resize_w, $resize_h);
    /* 将图片保存至文件 */
    if (!file_exists(dirname($target))) mkdir(dirname($target), 0777, true);
    switch (exif_imagetype($source)) {
        case IMAGETYPE_JPEG:
            imagejpeg($target_img, $target);
            break;
        case IMAGETYPE_PNG:
            imagepng($target_img, $target);
            break;
        case IMAGETYPE_GIF:
            imagegif($target_img, $target);
            break;
    }
    return boolval(file_exists($target));
}

session_start();
if($_SESSION['token']!=$token){
	exitJson(2,'非法请求，请重新登录');
}

$now=time();
$dirPath="../upload/".date('Y', $now)."/".date('m-d', $now);

$fileName=getMillisecond();
$filePath=$dirPath."/".$fileName.".jpg";

if (!is_dir($dirPath)){  
	$res=mkdir(iconv("UTF-8", "GBK", $dirPath),0777,true);
}

if(move_uploaded_file($_FILES["picture"]["tmp_name"],$filePath)){
	if($a!=""){
		image_center_crop($filePath, '980', '600',$filePath);
	}
	exitJson(0,"",array("filename"=>$fileName));
}else{
	exitJson(1,'上传失败');
}


?>