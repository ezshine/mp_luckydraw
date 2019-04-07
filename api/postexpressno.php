<?php
header("Content-type:text/html;charset=utf-8");
include_once 'mysql.php';
include_once 'functions.php';
include_once 'sqlutils.php';

$postdata=file_get_contents("php://input");
$jsondata=json_decode($postdata);


$id=$jsondata->id;
$expressno=$jsondata->expressno;
$expressremark=$jsondata->expressremark;

$db=getDb();
$sql = "update `".getTablePrefix()."_joins` set expressno='$expressno',expressremark='$expressremark' where id='$id' and getaward=1 LIMIT 1";
mysql_query($sql, $db) or die(mysql_error());

$sql="select ownerid from `".getTablePrefix()."_joins` where id='$id' LIMIT 1";
$res=mysql_query($sql, $db) or die(mysql_error());
$row = mysql_fetch_assoc($res);

if($expressno!=""){
	sendExpressNotice($expressno,$row['ownerid']);
}


exitJson(0,"快递信息已保存");


?>