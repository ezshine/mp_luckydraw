<?php
// ini_set('display_errors',1); //错误信息 
// ini_set('display_startup_errors',1); //php启动错误信息 
// error_reporting(-1); 
header("Content-type:text/html;charset=utf-8");
include_once 'mysql.php';
include_once 'functions.php';
include_once 'sqlutils.php';

$postdata=file_get_contents("php://input");
$jsondata=json_decode($postdata);

$awardimage=$jsondata->awardimage;
$awardname=$jsondata->awardname;
$awardnum=$jsondata->awardnum;
$awardpics=$jsondata->awardpics;
$opentype=$jsondata->opentype;
$opendate=$jsondata->opendate;
$openneedusers=$jsondata->openneedusers;

$advdistancetype=$jsondata->advdistancetype;
$advgendertype=$jsondata->advgendertype;
$advcoinbottom=$jsondata->advcoinbottom;
$advbarcode=$jsondata->advbarcode;
$advpassword=$jsondata->advpassword;
$advpasswordtips=$jsondata->advpasswordtips;
$advgpscity=$jsondata->advgpscity;
$advgps=$jsondata->advgps;
$advgpsaddr=$jsondata->advgpsaddr;
$advneedinfokey=$jsondata->advneedinfokey;
$advshare=$jsondata->advshare;
$advispublic=$jsondata->advispublic;


session_start();
$openid=$_SESSION['openid'];
if(!$openid){
	exitJson(1,'非法请求，请重新登录');
}

$userInfo=getUserSimpleInfo($openid);
if(userIsBaned($openid)){
    exitJson(2,'因用户举报，您已被禁止参与和发起抽奖！');
}

if($awardname=="" || $awardnum<=0){
	exitJson(1,'缺少必要的参数');
}else if($awardnum>10 && $userInfo['type']<100 && $advispublic==1){
	exitJson(4,'超过10个中奖名额的抽奖活动请先咨询客服。');
}else if($openneedusers>100 && $advispublic==1){
	exitJson(5,'超过100人才开奖的抽奖活动请先咨询客服。');
}

$db = getDb();

$now=time();

if($opentype!=0){
	$opendate=$now+86400*7;
}else{
	if($opendate==0){
		exitJson(1,'自动开奖时间有误，请重试');
	}
}
$lockKey = 'lockpostluckydraw_'.$openid;
$memc = new Redis();
$memc->connect('127.0.0.1',6379);
$addLock = $memc->setnx($lockKey,5);// 写入锁，说明这个$id目前有进程在参与抽奖。
if (!$addLock) {
	$sql="select `id`,createdate from ".getTablePrefix()."_luckydraws where ownerid='$openid' order by createdate DESC LIMIT 1";
	$res=mysql_query($sql,$db) or die(mysql_error());
	$row=mysql_fetch_assoc($res);
	exitJson(0,"抽奖发布成功，请勿重复操作",array("id"=>$row['id']));// 或当前参与人数太多，请重试
}
$memc->expire($lockKey,10); // 设置10秒自动过期该锁，如果某人崩溃，则10秒后其他人也可以自动参与

// if($advgps!='' || $advcoinbottom!='' || $advbarcode!='' || $advpassword!='' || $advshare==1 || $advneedinfokey!=''){
// 	$coinresult=addCoinHistory(2,-10,"发起高级抽奖");
// 	if(!$coinresult){
// 		$memc->del($lockKey); // 删除锁
// 		exitJson(1,"RP币余额不足，使用高级设置发起需消费10RP币");
// 	}
// }else{
// 	$coinresult=addCoinHistory(2,-1,"发起抽奖");
// 	if(!$coinresult){
// 		$memc->del($lockKey); // 删除锁
// 		exitJson(1,"RP币余额不足，发起抽奖需消费1RP币");
// 	}
// }

if($jsondata->id){
	$id=$jsondata->id;
	$sql = "update `".getTablePrefix()."_luckydraws` set ownerid='$openid',createdate='$now',awardimage='$awardimage',awardname='$awardname',awardnum='$awardnum',awardpics='$awardpics',opentype='$opentype',opendate='$opendate',openneedusers='$openneedusers',advdistancetype='$advdistancetype',advgendertype='$advgendertype',advcoinbottom='$advcoinbottom',advbarcode='$advbarcode',advpassword='$advpassword',advpasswordtips='$advpasswordtips',advgpscity='$advgpscity',advgps='$advgps',advgpsaddr='$advgpsaddr',advneedinfokey='$advneedinfokey',advshare='$advshare',advispublic='$advispublic' where id='$id' LIMIT 1";
	$res=mysql_query($sql, $db) or die(mysql_error());
	
	// $memc->del($lockKey);// 删除锁
	exitJson(0,"抽奖已更新",array("id"=>$id));
}else{
	$coinresult=addCoinHistory(2,-5,"发起抽奖");
	if(!$coinresult){
		$memc->del($lockKey); // 删除锁
		exitJson(1,"RP币余额不足，发起抽奖需消费5RP币");
	}
	$query=mysql_query("show table status where name ='".getTablePrefix()."_luckydraws'",$db);
	$row = mysql_fetch_assoc($query);
	$insertid = $row['Auto_increment'];

	$sql = "insert into `".getTablePrefix()."_luckydraws` (ownerid,createdate,awardimage,awardname,awardnum,awardpics,opentype,opendate,openneedusers,advdistancetype,advgendertype,advcoinbottom,advbarcode,advpassword,advpasswordtips,advgpscity,advgps,advgpsaddr,advneedinfokey,advshare,advispublic) values('$openid','$now','$awardimage','$awardname','$awardnum','$awardpics','$opentype','$opendate','$openneedusers','$advdistancetype','$advgendertype','$advcoinbottom','$advbarcode','$advpassword','$advpasswordtips','$advgpscity','$advgps','$advgpsaddr','$advneedinfokey','$advshare','$advispublic')";
	$res=mysql_query($sql, $db) or die(mysql_error());
	
	// $memc->del($lockKey);// 删除锁
	exitJson(0,"抽奖发布成功",array("id"=>$insertid));
}


?>