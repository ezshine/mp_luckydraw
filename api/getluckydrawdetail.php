<?php
// ini_set('display_errors',1); //错误信息 
// ini_set('display_startup_errors',1); //php启动错误信息 
// error_reporting(-1); 
header("Content-type:text/html;charset=utf-8");
include_once 'mysql.php';
include_once 'functions.php';
include_once 'sqlutils.php';

$id=getGet('id');
$inviterid=getGet('inviterid');

$db = getDb();
$sql = "select * from ".getTablePrefix()."_luckydraws where id = '$id' LIMIT 1";
$res=mysql_query($sql,$db) or die(mysql_error());

$row = mysql_fetch_assoc($res);

$result=parseLuckyDraw($row);


$result['totalusers']=intval(getTotalJoinNumber($id));
$result['recentjoins']=getRecentJoins($id);
$result['isjoined']=false;

session_start();
$openid=$_SESSION['openid'];
if($openid){
    $result['isjoined']=getIsJoined($id,$openid);
    if($result['isjoined'] && $result['advshare']==1){
        $total=max($result['totalusers'],$result['openneedusers']);
    	$result['joinedtipsbuttontitle']="提升中奖几率";//我的中奖率
    	$result['joinedtips']="您当前的中奖率为".(getTotalNamesByJoiner($id,$openid)/$total*100)."%，分享邀请好友参加，中奖几率可无限翻倍！";
    }
}

if($inviterid!=""&&$inviterid!="null"){
    $inviter=getUserOpenIdById($inviterid);
    $inviterOpenId=$inviter['openid'];
    $result["inviterInfo"]=getUserSimpleInfo($inviterOpenId);
}

if($result["isopened"]){
    $result['addressreadynum']=getAwardsAddresReadyNum($id);
    $result['totalluckymannum']=getAwardsTotalLuckyManNum($id);
    if($openid){
        $result['isluckyman']=getIsLuckyMan($id,$openid);
    }
}

//viewcount
$sql="update ".getTablePrefix()."_luckydraws set viewcount=viewcount+1 where id='$id' LIMIT 1";
mysql_query($sql,$db) or die(mysql_error());

exitJson(0,"",$result);

?>