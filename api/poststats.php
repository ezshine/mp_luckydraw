<?php
header("Content-type:text/html;charset=utf-8");
include_once 'mysql.php';
include_once 'functions.php';
include_once 'sqlutils.php';

$postdata=file_get_contents("php://input");
$jsondata=json_decode($postdata);

$scene=$jsondata->scene;
if(!$scene){
    exitJson(1,"缺少必要的参数");
}

session_start();
$openid=$_SESSION['openid'];

$db=getDb();

$luckydrawid=$jsondata->luckydrawid;
if($scene=="clicksponser" && $luckydrawid!=''){
    //sponserclickcount
    $sql="update ".getTablePrefix()."_luckydraws set sponserclickcount=sponserclickcount+1 where id='$luckydrawid' LIMIT 1";
    mysql_query($sql,$db) or die(mysql_error());
}



exitJson(0,"统计已提交");


?>