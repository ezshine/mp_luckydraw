<?php
header("Content-type:text/html;charset=utf-8");
include_once 'mysql.php';
include_once 'functions.php';
include_once 'sqlutils.php';


$postdata=file_get_contents("php://input");
$jsondata=json_decode($postdata);

$openid=$jsondata->openid;
$luckydrawid=$jsondata->id;

$luckydrawInfo=getLuckyDrawById($luckydrawid);

session_start();
$operatorid=$_SESSION['openid'];
if(!$operatorid){
	exitJson(1,'非法请求');
}else if(!getIsLuckyMan($luckydrawid,$openid)){
	exitJson(2,'该用户未中奖');
}

$db=getDb();
$sql="select awardnoticed from ".getTablePrefix()."_joins where luckydrawid='$luckydrawid' and ownerid='$openid' LIMIT 1";
$res=mysql_query($sql,$db) or die(mysql_error());
$row=mysql_fetch_assoc($res);

if($row['awardnoticed']==1){
	exitJson(4,'已发送通知');
}

// $openid="odROK5VJQYsiep18KV1_0hATRtpo";
sendGetAwardNotice($luckydrawInfo['awardname'],$luckydrawid,$openid);

$sql="update ".getTablePrefix()."_joins set awardnoticed=1 where luckydrawid='$luckydrawid' and ownerid='$openid' LIMIT 1";
$res=mysql_query($sql,$db) or die(mysql_error());

exitJson(0,'发送成功');

?>