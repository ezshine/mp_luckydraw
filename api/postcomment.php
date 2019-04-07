<?php
header("Content-type:text/html;charset=utf-8");
include_once 'mysql.php';
include_once 'functions.php';
include_once 'sqlutils.php';

$postdata=file_get_contents("php://input");
$jsondata=json_decode($postdata);

$luckydrawid=$jsondata->luckydrawid;
$uid=$jsondata->uid;
$content=textFilter($jsondata->content);

if($uid=="" || $luckydrawid=="" || $content==""){
    exitJson(1,"缺少必要的参数");
}

$openid=getUserOpenIdById($uid)['openid'];
$userInfo=getUserSimpleInfo($openid);

$ownernickname=$userInfo["nickname"];
$ownerheadimg=$userInfo["headimg"];

$now=time();
$db=getDb();

$sql="insert into `".getTablePrefix()."_comments` (luckydrawid,ownerid,ownernickname,ownerheadimg,content,createdate) values('$luckydrawid','$openid','$ownernickname','$ownerheadimg','$content','$now')";
$res=mysql_query($sql,$db) or die(mysql_error());

exitJson(0,"留言已发布");


?>