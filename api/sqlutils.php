<?php
header("Content-type:text/html;charset=utf-8");
include_once 'mysql.php';


function isDitributionMode($buildVersion){
	$buildVersion=intval($buildVersion);
	if($buildVersion>0){
		return $buildVersion<=1008;
	}else{
		return true;
	}
}

function userIsBaned($openid){
	$db = getDb();
	$sql="select baned from ".getTablePrefix()."_members where openid='$openid' LIMIT 1";
	$res=mysql_query($sql,$db) or die(mysql_error());

	$row=mysql_fetch_assoc($res);
	return intval($row['baned']);
}

function textFilter($text){
	$replace = array(
	'共产党', '国民党','习近平','温家宝','江泽民','毛泽东','华国锋','邓小平','政府','上访','信访','法轮功','地下党','李克强','赵紫阳','朱镕基','薄熙来','逼','鸡巴','操你','操他','操她','操它','干你');
	return str_replace($replace, '**', $text);
}

//添加代币历史
function addCoinHistory($type,$value,$msg,$touid=''){
	$uid=$_SESSION['openid'];
	if($touid!='')$uid=$touid;

	if($uid==''||!$uid)return false;

	$userinfo=getUserSimpleInfo($uid);
	if($userinfo['coin']+$value<0){
		return false;
	}

	$db = getDb();
	$now=time();
	$sql = "insert into ".getTablePrefix()."_coinhistory (`type`,`value`,`msg`,createdate,ownerid) values('$type','$value','$msg','$now','$uid')";
	$res=mysql_query($sql,$db) or die(mysql_error());

	$balance=$userinfo['coin']+$value;
	$sql2 = "update ".getTablePrefix()."_members set coin='$balance' where openid='$uid' LIMIT 1";
	$res=mysql_query($sql2,$db) or die(mysql_error());

	return true;
}

//获得平台内奖品总数
function getTotalAwards(){
	$db = getDb();
	$sql = "select sum(`awardnum`) from ".getTablePrefix()."_luckydraws";
	$res=mysql_query($sql,$db) or die(mysql_error());

	$row=mysql_fetch_row($res);
	return $row[0]*131;
}

//获得抽奖详情by id
function getLuckyDrawById($id){
	$db = getDb();
	$sql = "select * from ".getTablePrefix()."_luckydraws where id = '$id' LIMIT 1";
	$res=mysql_query($sql,$db) or die(mysql_error());

	$row=mysql_fetch_assoc($res);
	return parseLuckyDraw($row);
}

//获得用户发起抽奖的总数
function getUserSendCount($openid){
	$db = getDb();
	$sql = "select count(`id`) from ".getTablePrefix()."_luckydraws where ownerid = '$openid'";
	$res=mysql_query($sql,$db) or die(mysql_error());

	$row=mysql_fetch_row($res);
	return $row[0];
}

//获得用户获奖的总数
function getUserLuckyCount($openid){
	$db = getDb();
	$sql = "select count(DISTINCT `luckydrawid`) from ".getTablePrefix()."_joins where ownerid = '$openid' and getaward=1";
	$res=mysql_query($sql,$db) or die(mysql_error());

	$row=mysql_fetch_row($res);
	return $row[0];
}

//获得用户参与抽奖的总数
function getUserJoinCount($openid){
	$db = getDb();
	$sql = "select count(distinct `luckydrawid`) from ".getTablePrefix()."_joins where ownerid = '$openid'";
	$res=mysql_query($sql,$db) or die(mysql_error());

	$row=mysql_fetch_row($res);
	return $row[0];
}

//获得用户Openid
function getUserOpenIdById($id){
	$db = getDb();
	$sql = "select `openid`,`nickname` from ".getTablePrefix()."_members where id = '$id' LIMIT 1";
	$res=mysql_query($sql,$db) or die(mysql_error());

	$row = mysql_fetch_assoc($res);
	
	return $row;
}

//获得用户信息，简单
function getUserSimpleInfo($openid){
	$db = getDb();
	$sql = "select `id`,`nickname`,`headimg`,`gender`,`type`,`joindate`,`lastlogin`,`coin`,`optiondetail`,`baned` from ".getTablePrefix()."_members where openid = '$openid' LIMIT 1";
	$res=mysql_query($sql,$db) or die(mysql_error());

	$row = mysql_fetch_assoc($res);

	$row['lastlogin']= date('Y-m-d H:i:s', $row['lastlogin']);
	$row['joindate']= date('Y-m-d H:i:s', $row['joindate']);
	
	return $row;
}

//获得用户信息，详细
function getUserInfo($openid){
	$db = getDb();
	$sql = "select `id`,`openid`,`nickname`,`headimg`,`gender`,`type`,`joindate`,`lastlogin`,`coin`,`optiondetail` from ".getTablePrefix()."_members where openid = '$openid' LIMIT 1";
	$res=mysql_query($sql,$db) or die(mysql_error());

	$row = mysql_fetch_assoc($res);

	$row['lastlogin']= date('Y-m-d H:i:s', $row['lastlogin']);
	$row['joindate']= date('Y-m-d H:i:s', $row['joindate']);

	$row['optiondetail']=json_decode($row['optiondetail']);

	$row['totalsend']=intval(getUserSendCount($openid));
	$row['totaljoin']=intval(getUserJoinCount($openid));
	$row['totallucky']=intval(getUserLuckyCount($openid));
	
	return $row;
}

//解析抽奖详情
function parseLuckyDraw($row){
	$row['awardname']=textFilter($row['awardname']);
	$row['ownerInfo']=getUserSimpleInfo($row['ownerid']);
	$row['startdate']=intval($row['startdate']);
	$row['opendate']=intval($row['opendate']);
	$row['createdate']=intval($row['createdate']);
	$row['ownerid']=$row['ownerInfo']['id'];
	$row['isopened']=intval($row['isopened']);

	$awardimageTime=intval($row['awardimage'])/1000;
	if($row['awardimage']!="")$row['awardimage']=date("Y",$awardimageTime)."/".date('m-d', $awardimageTime)."/".$row['awardimage'].".jpg";
	else $row['awardimage']="2018/05-13/1526225507353.jpg";

	if($row['awardpics']!=""){
		$awardPics=explode(",",$row['awardpics']);
		$finAwardPics=[];
		for ($i=0; $i < count($awardPics); $i++) { 
			$awardPicTime=$awardPics[$i]/1000;
			array_push($finAwardPics, date('Y', $awardPicTime)."/".date('m-d', $awardPicTime)."/".$awardPics[$i].".jpg");
		}
		$row['awardpics']=$finAwardPics;
	}

	return $row;
}

//查看最终中奖者数量
function getAwardsTotalLuckyManNum($id){
	$db = getDb();
	$sql = "select count(`id`) from ".getTablePrefix()."_joins where luckydrawid='$id' and getaward=1";
	$res=mysql_query($sql,$db) or die(mysql_error());

	$row=mysql_fetch_row($res);
	return $row[0];
}

//查看中奖人地址已填写数量
function getAwardsAddresReadyNum($id){
	$db = getDb();
	$sql = "select count(id) from ".getTablePrefix()."_joins where luckydrawid='$id' and getaward=1 and expressaddress!=''";
	$res=mysql_query($sql,$db) or die(mysql_error());

	$row=mysql_fetch_row($res);
	return $row[0];
}

//查看某用户是否已参与
function getIsJoined($id,$openid){
	$db = getDb();
	$sql = "select `id` from ".getTablePrefix()."_joins where luckydrawid='$id' and ownerid = '$openid' LIMIT 1";
	$res=mysql_query($sql,$db) or die(mysql_error());

	if(mysql_num_rows($res)>0){
		return true;
	}
	return false;
}

//查看某用户是否获奖
function getIsLuckyMan($id,$openid){
	$db = getDb();
	$sql = "select `id` from ".getTablePrefix()."_joins where luckydrawid='$id' and ownerid = '$openid' and getaward=1 LIMIT 1";
	$res=mysql_query($sql,$db) or die(mysql_error());

	if(mysql_num_rows($res)>0){
		return true;
	}
	return false;
}

//获得某用户指定抽奖的名字数量
function getTotalNamesByJoiner($id,$openid){
	$db = getDb();
	$sql = "select count(id) from ".getTablePrefix()."_joins where luckydrawid='$id' and ownerid = '$openid'";
	$res=mysql_query($sql,$db) or die(mysql_error());

	$row=mysql_fetch_row($res);
	return $row[0];
}

//获得参与者总数
function getTotalJoinNumber($id){
	$db = getDb();
	$sql = "select count(`id`) from ".getTablePrefix()."_joins where luckydrawid='$id'";
	$res=mysql_query($sql,$db) or die(mysql_error());

	$row=mysql_fetch_row($res);
	return $row[0];
}

//获得最近的参与者
function getRecentJoins($id){
	$db = getDb();
	$sql = "select `ownerid` from ".getTablePrefix()."_joins where luckydrawid = '$id' order by createdate desc LIMIT 7";
	$res=mysql_query($sql,$db) or die(mysql_error());

	$list = array();
	while ($row = mysql_fetch_assoc($res)) {
		$userInfo=getUserSimpleInfo($row['ownerid']);
		$list[]=$userInfo;
	}

	return $list;
}

//开奖算法
function openAward($id){
    $luckydrawInfo=getLuckyDrawById($id);
	$allLuckyMan=array();
	$noticedMan=array();
	
	$db = getDb();
	$sql = "select `id`,`luckydrawid`,`ownerid`,`ownernickname` from ".getTablePrefix()."_joins where luckydrawid = '$id'";
	$res=mysql_query($sql,$db) or die(mysql_error());

	$joinCount=mysql_num_rows($res);
	if($joinCount<=0)return false;

	$joins=[];
    while ($row = mysql_fetch_assoc($res)) {
		if(!array_key_exists($row['ownerid'],$noticedMan)){
			$noticedMan[$row['ownerid']]=$row['ownerid'];
			sendOpenAwardNotice($luckydrawInfo['awardname'],$luckydrawInfo['id'],$row['ownerid']);
		}
        $joins[]=$row;
	}

	$awardNum=$luckydrawInfo['awardnum'];
	if($joinCount<$awardNum){
		$awardNum=$joinCount;
	}

	updateLuckyDrawIsOpened($id);

	for($i=0;$i<$awardNum;$i++){
		$luckyman=getOneAward($joins,$allLuckyMan);
		$allLuckyMan[$luckyman['ownerid']]=$luckyman;
		updateJoinGetAward($luckyman['id']);
		// sendGetAwardNotice($luckydrawInfo['awardname'],$luckydrawInfo['id'],$luckyman['ownerid']);
	}

	return true;
}

function getOneAward($joins,$allLuckyMan){
	// trace($joins);
	$list_leng=count($joins);
	$luckyman=$joins[array_rand($joins,1)];
	// trace($luckyman['ownerid']);
	// trace($allLuckyMan[$luckyman['ownerid']]);
	if(!array_key_exists($luckyman['ownerid'],$allLuckyMan)){
		return $luckyman;
	}else{
		return getOneAward($joins,$allLuckyMan);
	}
}

function updateJoinGetAward($id){
    $db = getDb();
    $now=time();
	$sql = "update ".getTablePrefix()."_joins set getaward=1,awarddate='$now' where id = '$id' LIMIT 1";
    $res=mysql_query($sql,$db) or die(mysql_error());
}
function updateLuckyDrawIsOpened($id){
    $db = getDb();
	$sql = "update ".getTablePrefix()."_luckydraws set isopened=1 where id = '$id' LIMIT 1";
    $res=mysql_query($sql,$db) or die(mysql_error());
}

function getFormId($uid){
	$db = getDb();
	$time=strtotime('-7 day');
	$sql = "select * from ".getTablePrefix()."_formids where ownerid = '$uid' and used=0 and createdate>$time order by createdate asc LIMIT 1";
	$res=mysql_query($sql,$db) or die(mysql_error());
	if(mysql_num_rows($res)<=0){
		return false;
	}
	$row = mysql_fetch_assoc($res);
	return $row['formid'];
}

function deleteFormId($formid){
	$db = getDb();
	$sql="delete from ".getTablePrefix()."_formids where formid='$formid'";
	$res=mysql_query($sql,$db) or die(mysql_error());
}

function trace($v){
    print_r($v);
    echo "\n";
}

function httpGet($url) {
    $curl = curl_init();
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($curl, CURLOPT_TIMEOUT, 500);
    curl_setopt($curl, CURLOPT_URL, $url);

    $res = curl_exec($curl);
    curl_close($curl);

    return $res;
  }

function getAccessToken(){
    $data = json_decode(file_get_contents("access_token.json"));
    if ($data->expire_time < time()) {
      $url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=".getAppId()."&secret=".getAppSecret();
      $res = json_decode(httpGet($url));
      $access_token = $res->access_token;
      if ($access_token) {
        $data->expire_time = time() + 7000;
        $data->access_token = $access_token;
        $fp = fopen("access_token.json", "w");
        fwrite($fp, json_encode($data));
        fclose($fp);
      }
    } else {
      $access_token = $data->access_token;
    }
    return $access_token;
}

//发送模板消息：fsockopen模式
function sendNotice($uid,$templateid,$data,$turl,$color='',$emphasis_keyword=''){
    $formid=getFormId($uid);
	if(!$formid){
		return;
	}

	$template = array(
	    'touser' => $uid,
	    'template_id' => $templateid,
	    'page' => $turl,
	    'form_id'=>$formid,
	    'color'=>$color, 
		'data' => $data,
		'emphasis_keyword'=>$emphasis_keyword
	);
	
    $access_token = getAccessToken();
    
    $params = json_encode($template);
    $start_time = microtime(true);

	$fp = fsockopen('api.weixin.qq.com', 80, $error, $errstr, 1);
	$http = "POST /cgi-bin/message/wxopen/template/send?access_token={$access_token} HTTP/1.1\r\nHost: api.weixin.qq.com\r\nContent-type: application/x-www-form-urlencoded\r\nContent-Length: " . strlen($params) . "\r\nConnection:close\r\n\r\n$params\r\n\r\n";
	fwrite($fp, $http);
	fclose($fp);

	deleteFormId($formid);
}

//发送模板消息：post模式
// function sendNotice($uid,$templateid,$data,$turl,$color=''){
// 	$formid=getFormId($uid);
// 	if(!$formid){
// 		return;
// 	}

// 	$template = array(
// 	    'touser' => $uid,
// 	    'template_id' => $templateid,
// 	    'page' => $turl,
// 	    'form_id'=>$formid,
// 	    'color'=>$color, 
// 	    'data' => $data
// 	);
	
// 	$access_token = getAccessToken();
// 	$api_url="https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=".$access_token;
	
// 	$json_template = json_encode($template);
// 	$dataRes = request_post($api_url, urldecode($json_template));

// 	deleteFormId($formid);
// }

//发送开奖通知
function sendOpenAwardNotice($luckydrawname,$luckydrawid,$openid){
	
	$data=array(
        'keyword1' => [
            'value' => $luckydrawname,
            'color' => '#0099ee',
		],
		'keyword2' => [
            'value' => '此活动已开奖，点击查看中奖名单',
            'color' => '#ff3366',
        ],
	);

	$url="pages/index/index?luckydrawid=".$luckydrawid;
	
	sendNotice($openid,"yF-9ur2H9wT9Z-w79z5F0KRhWqJN_iwQIqBYn0i0Q6U",$data,$url);
}

//发送快递发货通知rNVqg-hTwiNWE11gC9wEvHWXYhfHn-z45S61vfh1nLg
function sendExpressNotice($expressno,$openid){
	
	$data=array(
		'keyword1' => [
            'value' => '您的奖品已发货',
            'color' => '#0099ee',
        ],
        'keyword2' => [
            'value' => $expressno,
            'color' => '#ff3366',
		],
		'keyword3' => [
            'value' => date("Y-m-d H:i:s",time()),
            'color' => '#666',
        ],
	);

	$url="pages/my/index";
	
	sendNotice($openid,"rNVqg-hTwiNWE11gC9wEvHWXYhfHn-z45S61vfh1nLg",$data,$url,'','keyword2.DATA');
}

//发送中奖通知
function sendGetAwardNotice($luckydrawname,$luckydrawid,$openid){
	
	$data=array(
		'keyword1' => [
            'value' => '您中奖啦',
            'color' => '#ff5500',
        ],
        'keyword2' => [
            'value' => $luckydrawname,
            'color' => '#0099ee',
		],
		'keyword3' => [
            'value' => '请尽快填写领奖信息，逾期可能作废',
            'color' => '#666',
        ],
	);

	$url="pages/index/index?luckydrawid=".$luckydrawid;
	
	sendNotice($openid,"yF-9ur2H9wT9Z-w79z5F0JGR3F1EnEZbK4SXpGbr89M",$data,$url,'','keyword1.DATA');
}

//发送日程通知
function sendHolidayNotice($holidayname,$holidaydate,$desc,$openid){
	//dYjkT2fXPaIyo0zJLALW1ibUjKqlO661ihsn-ci6v2w

	$data=array(
		'keyword1' => [
            'value' => $holidayname,
            'color' => '#ff3366',
        ],
        'keyword2' => [
            'value' => $holidaydate,
            'color' => '#333333',
		],
		'keyword3' => [
            'value' => $desc,
            'color' => '#666',
        ],
	);

	$url="pages/index/index";
	
	sendNotice($openid,"dYjkT2fXPaIyo0zJLALW1ibUjKqlO661ihsn-ci6v2w",$data,$url,'#ff5500',"keyword1.DATA");
}

//发送商品上架通知（已被封）
function sendNewProductNotice($awardname,$awardnum,$remark,$openid){
	//AnlFr_AeBrQMvIXDArqLzgKzNgP-InbfaJlrldahh40
	$data=array(
		'keyword1' => [
            'value' => $awardname,
            'color' => '#ff3366',
        ],
        'keyword2' => [
            'value' => $awardnum,
            'color' => '#333333',
		],
		'keyword3' => [
            'value' => $remark,
            'color' => '#666',
        ],
	);

	$url="pages/index/index?luckydrawid=143";
	
	sendNotice($openid,"AnlFr_AeBrQMvIXDArqLzgKzNgP-InbfaJlrldahh40",$data,$url,'#ff5500',"keyword1.DATA");
}

?>