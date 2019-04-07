<?php
header("Content-type:text/html;charset=utf-8");
include_once 'mysql.php';
include_once 'functions.php';
include_once 'sqlutils.php';

$page=0;
if(getGet('page')!=""){
	$page=getGet('page');
}
$limit=10;

$db = getDb();

$sql = "select * from ".getTablePrefix()."_joins where getaward=1 and expressno!='' order by awarddate desc LIMIT ".$limit*$page.",$limit";
$res=mysql_query($sql,$db) or die(mysql_error());

$list = array();
while ($row = mysql_fetch_assoc($res)) {
    $row['createdate']=date('Y-m-d H:i:s', $row['createdate']);

    $row['luckydrawInfo']=getLuckyDrawById($row['luckydrawid']);

    $address=json_decode($row['expressaddress']);
    $row['expresscryptaddress']=$address->provinceName.$address->cityName.$address->countyName."▓▓▓▓▓▓▓▓▓▓";
    $row['expressaddress']="";

	$list[]=$row;
}

exitJson(0,"",$list);

?>