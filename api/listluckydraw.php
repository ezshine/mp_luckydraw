<?php
header("Content-type:text/html;charset=utf-8");
include_once 'mysql.php';
include_once 'functions.php';
include_once 'sqlutils.php';

$type=getGet('type');

$db = getDb();

$page=0;
if(getGet('page')!=""){
	$page=getGet('page');
}
$limit=10;
if(getGet('limit')!=""){
	$limit=getGet('limit');
}

$ordertype=0;
if(getGet('ordertype')!=""){
    $ordertype=getGet('ordertype');
}

session_start();
$openid=$_SESSION['openid'];

$now=time();

if($type==1){//我发起的
    if(!$openid){
        exitJson(1,'非法请求，请重新登录');
    }
    
    $order="opendate desc";
    if($ordertype==1){
        $order="createdate desc";
    }
    $sql = "select * from ".getTablePrefix()."_luckydraws where ownerid = '$openid' and isdelete=0 order by ".$order." LIMIT ".$limit*$page.",$limit";
}else if($type==2){//我参与的
    $sql = "select distinct `luckydrawid` from ".getTablePrefix()."_joins where ownerid = '$openid' order by createdate desc LIMIT ".$limit*$page.",$limit";
}else if($type==22){//我的中奖纪录
    $sql = "select luckydrawid,expressaddress,expressno,expressremark from ".getTablePrefix()."_joins where ownerid = '$openid' and getaward=1 group by luckydrawid order by createdate desc LIMIT ".$limit*$page.",$limit";
}else if($type==3){//待开奖
    $sql = "select * from ".getTablePrefix()."_luckydraws where opendate>='$now' and isopened=0 and isdelete=0 and advispublic=1 order by opendate asc LIMIT ".$limit*$page.",$limit";
}else if($type==4){//已过期
    $sql = "select * from ".getTablePrefix()."_luckydraws where opendate<'$now' or isopened=1 and isdelete=0 and advispublic=1 order by opendate desc LIMIT ".$limit*$page.",$limit";
}else if($type=="city"){//按城市名取
    $city=getGet('city');
    $sql = "select * from ".getTablePrefix()."_luckydraws where advgpscity = '$city' and opendate>='$now' and isopened=0 and isdelete=0 and advispublic=1 order by opendate desc";
}

$res=mysql_query($sql,$db) or die(mysql_error());

$list = array();
while ($row = mysql_fetch_assoc($res)) {
    if($type==2){
        $list[]=getLuckyDrawById($row['luckydrawid']);
    }else if($type==22){
        $row['luckydrawInfo']=getLuckyDrawById($row['luckydrawid']);
        $row['expressaddress']=json_decode($row['expressaddress']);
        $list[]=$row;
    }else{
        $list[]=parseLuckyDraw($row);
    }
}

exitJson(0,"",$list);

?>