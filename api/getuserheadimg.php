<?php
// ini_set('display_errors',1); //错误信息 
// ini_set('display_startup_errors',1); //php启动错误信息 
// error_reporting(-1); 
header("Content-type:text/html;charset=utf-8");
include_once 'mysql.php';
include_once 'functions.php';

$id=getGet("id");

function getUserSimpleInfo($id){
	$db = getDb();
	$sql = "select `headimg` from ".getTablePrefix()."_members where id = '$id' LIMIT 1";
	$res=mysql_query($sql,$db) or die(mysql_error());

	$row = mysql_fetch_assoc($res);
	
	return $row;
}

$userInfo=getUserSimpleInfo($id);

header("Content-type: image/jpeg");
echo file_get_contents($userInfo["headimg"]);

?>