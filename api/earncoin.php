<?php
header("Content-type:text/html;charset=utf-8");
include_once 'mysql.php';
include_once 'functions.php';
include_once 'sqlutils.php';

session_start();
$openid=$_SESSION['openid'];
if(!$openid){
	exitJson(1,'非法请求，请重新登录');
}

$db = getDb();
$sql = "select `lastearncoin`,`coin` from ".getTablePrefix()."_members where openid = '$openid' LIMIT 1";
$res=mysql_query($sql,$db) or die(mysql_error());

$row=mysql_fetch_assoc($res);
if(!$row){
    exitJson(1,"非法请求");
}

$now=time();

$distancetime=$now-$row['lastearncoin'];
if($distancetime>=3600){
    $coin=$row['coin']+1;
    $sql = "update `".getTablePrefix()."_members` set coin='$coin',lastearncoin='$now' where openid='$openid' LIMIT 1";
    $res=mysql_query($sql, $db) or die(mysql_error());

    if($res==true)addCoinHistory(1,1,"钱包产出领取");
    else exitJson(1,"非法请求");

    exitJson(0,"已领取");
}else{
    exitJson(1,'不可领取');
}





?>