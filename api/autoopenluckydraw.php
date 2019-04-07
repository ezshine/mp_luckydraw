<?php
ini_set('display_errors',1); //错误信息 
ini_set('display_startup_errors',1); //php启动错误信息 
error_reporting(-1); 
header("Content-type:text/html;charset=utf-8");
include_once 'mysql.php';
include_once 'functions.php';
include_once 'sqlutils.php';

$now=time();


function outputLog($str){
    $fp = fopen("autoopenlog.txt", "a");
    fwrite($fp, $str."\r\n");
    fclose($fp);
}

$db=getDb();

$sql="select * from ".getTablePrefix()."_luckydraws where opentype=0 and isopened=0 and opendate<=$now and opendate>".($now-86400);

$res=mysql_query($sql,$db) or die(mysql_error());

outputLog(date('Y-m-d H:i:s',$now)."====检查自动开奖");
while ($row = mysql_fetch_assoc($res)) {
    // trace($row["id"]);
    if(openAward($row["id"])){
        outputLog(date('Y-m-d H:i:s',$now)." id:".$row['id']." name:".$row['awardname']." opendate:".date('Y-m-d H:i:s',$row['opendate'])." 已自动开奖");
    }else{
        outputLog(date('Y-m-d H:i:s',$now)." id:".$row['id']." name:".$row['awardname']." opendate:".date('Y-m-d H:i:s',$row['opendate'])." 0人参与，已过期");
    };
}
outputLog(date('Y-m-d H:i:s',$now)."====检查自动开奖完成");

?>