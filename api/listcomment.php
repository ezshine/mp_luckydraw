<?php
header("Content-type:text/html;charset=utf-8");
include_once 'mysql.php';
include_once 'functions.php';
include_once 'sqlutils.php';

$luckydrawid=getGet("luckydrawid");

$page=0;
if(getGet('page')!=""){
	$page=getGet('page');
}
$limit=10;
if(getGet('limit')!=""){
	$limit=getGet('limit');
}

$db=getDb();

$sql = "select * from ".getTablePrefix()."_comments where luckydrawid = '$luckydrawid' order by createdate desc LIMIT ".$limit*$page.",$limit";
$res=mysql_query($sql,$db) or die(mysql_error());

$list = array();
while ($row = mysql_fetch_assoc($res)) {
	$row['createdate']=date("Y-m-d H:i:s",$row['createdate']);
    $list[]=$row;
}
    
exitJson(0,"",$list);


?>