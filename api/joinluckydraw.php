<?php
header("Content-type:text/html;charset=utf-8");
include_once 'mysql.php';
include_once 'functions.php';
include_once 'sqlutils.php';

$postdata=file_get_contents("php://input");
$jsondata=json_decode($postdata);

$id=$jsondata->id;

session_start();
$openid=$_SESSION['openid'];
if(!$openid){
	exitJson(1,'非法请求，请重新登录');
}

if(userIsBaned($openid)){
    exitJson(2,'因用户举报，您已被禁止参与和发起抽奖！');
}

$db = getDb();

$sql = "select * from ".getTablePrefix()."_luckydraws where id = '$id' LIMIT 1";
$res=mysql_query($sql,$db) or die(mysql_error());
$row = mysql_fetch_assoc($res);
$luckydrawInfo=parseLuckyDraw($row);



$now=time();

if($now>$luckydrawInfo['opendate']){
    exitJson(1,"参与失败，抽奖活动已过期");
}else if($now<$luckydrawInfo['startdate']){
    exitJson(4,"抽奖活动尚未开始");
}else if($luckydrawInfo['isopened']==1){
    exitJson(2,"已开奖");
}else if(getIsJoined($id,$openid)){
    exitJson(3,"您已经参与过了");
}

$userInfo=getUserSimpleInfo($openid);
$nickname=$userInfo['nickname'];

if(addCoinHistory(2,-1,"参与抽奖")){

    $sql = "insert into `".getTablePrefix()."_joins` (luckydrawid,ownerid,ownernickname,createdate) values('$id','$openid','$nickname','$now')";
    $res=mysql_query($sql, $db) or die(mysql_error());

    $inviterid=$jsondata->inviterid;
    if($inviterid && $luckydrawInfo['advshare']==1){
        $inviter=getUserOpenIdById($inviterid);

        $inviterOpenId=$inviter['openid'];
        if($inviterOpenId!=$openid){
            $inviterNickname=$inviter['nickname'];

            $sql = "insert into `".getTablePrefix()."_joins` (luckydrawid,ownerid,ownernickname,createdate,msg) values('$id','$inviterOpenId','$inviterNickname','".($now+1)."','分享+1')";
            $res=mysql_query($sql, $db) or die(mysql_error());
        }
    }

    $totalusers=getTotalJoinNumber($id);
    if($luckydrawInfo['opentype']==1 && intval($totalusers)>=intval($luckydrawInfo['openneedusers'])){
        if(openAward($id)){
            exitJson(0,"开奖啦");
        };
    }

    exitJson(0,"已参加");
}else{
    exitJson(1,"RP币余额不足");
}


?>