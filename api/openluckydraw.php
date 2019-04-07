<?php
// ini_set('display_errors',1); //错误信息 
// ini_set('display_startup_errors',1); //php启动错误信息 
// error_reporting(-1); 
header("Content-type:text/html;charset=utf-8");
include_once 'mysql.php';
include_once 'functions.php';
include_once 'sqlutils.php';


$id=getGet("id");
if($id==""){
    exitJson(1,"缺少必要的参数");
}

$luckydrawInfo=getLuckyDrawById($id);

if($luckydrawInfo['opentype']==2){
    session_start();
    $openid=$_SESSION['openid'];
    $uid=getUserSimpleInfo($openid)['id'];
    if(!$openid){
        exitJson(1,'非法请求，请重新登录');
    }else if($uid!=$luckydrawInfo['ownerid']){
        exitJson(2,'不是自己的发起的抽奖');
    }

    if(openAward($id)){
        exitJson(0,"开奖啦");
    };
}



?>