<?php
// ini_set('display_errors',1); //错误信息 
// ini_set('display_startup_errors',1); //php启动错误信息 
// error_reporting(-1); 
header("Content-type:text/html;charset=utf-8");
include_once 'mysql.php';
include_once 'functions.php';
include_once 'sqlutils.php';

function http_post_data($url, $data_string) {  
  
    // return array('0'=>'','1'=>file_get_contents('qr.jpg'));
        $ch = curl_init();  
        curl_setopt($ch, CURLOPT_POST, 1);  
        curl_setopt($ch, CURLOPT_URL, $url);  
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data_string);  
        curl_setopt($ch, CURLOPT_HTTPHEADER, array(  
            'Content-Type: application/json; charset=utf-8',  
            'Content-Length: ' . strlen($data_string))  
        );  
        ob_start();  
        curl_exec($ch);  
        $return_content = ob_get_contents();  
        ob_end_clean();  
  
        $return_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);  
        return array($return_code, $return_content);  
    }  

$page=getGet("page");
$path=getGet("path");
$scene=getGet("scene");
$type=getGet("type");

$accesstoken=getAccessToken();
if(strtoupper($type)=="A"){
    $post_data=array(
        "path"=>$path,
    );
    $qrcode_req=http_post_data("https://api.weixin.qq.com/wxa/getwxacode?access_token=".$accesstoken,json_encode($post_data));
}else{
    $post_data=array(
        "scene"=>$scene,
        "page"=>$page
        );
    $qrcode_req=http_post_data("https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=".$accesstoken,json_encode($post_data));
}
// print_r($qrcode_req);
header("Content-type: image/jpeg");
echo $qrcode_req[1];

?>