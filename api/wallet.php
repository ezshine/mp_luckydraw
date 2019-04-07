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

$now=time();

$canearn=false;
$distancetime=$now-$row['lastearncoin'];
if($distancetime>=3600){
    $canearn=true;
}

exitJson(0,"",array("totalcoin"=>$row['coin'],"canearncoin"=>$canearn,"distancetime"=>$distancetime));



?>