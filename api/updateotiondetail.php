<?php

header("Content-type:text/html;charset=utf-8");
include_once 'mysql.php';
include_once 'functions.php';
include_once 'sqlutils.php';

$postdata=file_get_contents("php://input");

$postdata=textFilter($postdata);

session_start();
$openid=$_SESSION['openid'];
if(!$openid){
	exitJson(1,'非法请求，请重新登录');
}

$db = getDb();

$sql = "update `".getTablePrefix()."_members` set optiondetail='$postdata' where openid='$openid' LIMIT 1";
$res=mysql_query($sql, $db) or die(mysql_error());

exitJson(0,"资料已保存");

?>