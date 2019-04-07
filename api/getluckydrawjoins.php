<?php
header("Content-type:text/html;charset=utf-8");
include_once 'mysql.php';
include_once 'functions.php';
include_once 'sqlutils.php';

$id=getGet('id');

$type=0;
if(getGet('type')!=""){
	$type=getGet('type');
}

$page=0;
if(getGet('page')!=""){
	$page=getGet('page');
}
$limit=10;

$keyword="";
if(getGet('keyword')!=""){
	$keyword=getGet('keyword');
}

$db = getDb();

$searchSql="";
if($keyword!=""){
    $searchSql=" and ownernickname LIKE '%$keyword%' ";
}

if($type==0){//倒序
    $sql = "select id,luckydrawid,ownerid,ownernickname,msg,createdate,getaward from ".getTablePrefix()."_joins where luckydrawid = '$id' ".$searchSql." order by createdate desc LIMIT ".$limit*$page.",$limit";
}else if($type==1){//顺序
    $sql = "select id,luckydrawid,ownerid,ownernickname,msg,createdate,getaward from ".getTablePrefix()."_joins where luckydrawid = '$id' ".$searchSql." order by createdate asc LIMIT ".$limit*$page.",$limit";
}else if($type==2){//获奖的
    $sql = "select * from ".getTablePrefix()."_joins where luckydrawid = '$id' ".$searchSql." and getaward=1 order by createdate asc LIMIT ".$limit*$page.",$limit";
}
$res=mysql_query($sql,$db) or die(mysql_error());

$list = array();
while ($row = mysql_fetch_assoc($res)) {
    $row['createdate']=date('Y-m-d H:i:s', $row['createdate']);
    $row['userInfo']=getUserSimpleInfo($row['ownerid']);
    
    $row['userInfo']['nickname']=$row['ownernickname'];

    if($tyep=2){
        $row['expressaddress']=json_decode($row['expressaddress']);
        $row['luckydrawInfo']=getLuckyDrawById($id);
    }

    if($row['msg']!=''){
        $row['msgtips']="每邀请好友成功参加时，名字会在名单中多出现1次，名字越多则中奖几率就越大。";
    }

	$list[]=$row;
}

exitJson(0,"",$list);

?>