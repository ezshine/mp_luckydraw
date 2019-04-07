<?php
header("Content-type:text/html;charset=utf-8");
include_once 'mysql.php';
include_once 'functions.php';
include_once 'sqlutils.php';

$now=time();
//精品推荐列表
$db = getDb();
$sql = "select * from ".getTablePrefix()."_luckydraws where isrecommend = 1 and opendate>='".($now-86400)."' and isdelete=0 order by opendate desc";
$res=mysql_query($sql,$db) or die(mysql_error());

$recommendlist = array();
while ($row = mysql_fetch_assoc($res)) {
    $recommendlist[]=parseLuckyDraw($row);
}

//即将开奖
$sql = "select * from ".getTablePrefix()."_luckydraws where isrecommend = 0 and homeindex=1 and opendate>='".($now-86400)."' and isdelete=0 order by createdate desc LIMIT 6";
$res=mysql_query($sql,$db) or die(mysql_error());

$soonlist = array();
while ($row = mysql_fetch_assoc($res)) {
    $soonlist[]=parseLuckyDraw($row);
}

//方块菜单
$squaremenus=array();

$squaremenus[]=array("name"=>"","url"=>"xcxid://wxd35321d304ffabfc","backgroundImage"=>"http://jnsii.com/zj/images/wanwubanner.jpg");
$squaremenus[]=array("name"=>"领取RP币","url"=>"/pages/my/wallet","background"=>"#e6c033");
$squaremenus[]=array("name"=>"中奖历史","url"=>"/pages/webview/index?url=https://jnsii.com/zj/h5/rank/","background"=>"#0099ee");
$squaremenus[]=array("name"=>"常见问题","url"=>"/pages/webview/index?url=https://jnsii.com/zj/helpcenter/qna.html","background"=>"#44615e");
$squaremenus[]=array("name"=>"附近抽奖","url"=>"/pages/luckydraw/map","background"=>"#FF5500");
$squaremenus[]=array("name"=>"全部抽奖","url"=>"/pages/luckydraw/list","background"=>"#33cc33");
// $squaremenus[]=array("name"=>"小程序跳转","url"=>"xcxid://wxa1d88bc6efa45d7b","backgroundImage"=>"http://jnsii.com/zj/images/defaultawardimage.jpg");

//超级广告位
$superbanner;//=array("image"=>"http://jnsii.com/zj/images/longxiabanner.jpg","url"=>"/pages/luckydraw/detail?id=160");

$shareapptext=["你用用看这个小程序，一分钱不花，试试运气呗！",
				"你今天红光满面，八成有好事找上门！",
				"平时攒够了人品，来试试运气好不好！",
				"古话说，多分享多参与，好运自然来~",
				"你长得这么好看，我猜运气一定好！",
				"爱笑的女孩儿，运气不会差哦~"];

$shareimagetext=["送你一个免费抽奖的机会，看咱谁运气好~",
				"人长得好看，运气一般不会差~",
				"你是我最好的朋友，这种好事我只告诉你！"];
$shareimageslogan="免费抽奖，信不信由你";


exitJson(0,"",array("totalawards"=>getTotalAwards(),"shareimageslogan"=>$shareimageslogan,"shareimagetext"=>$shareimagetext,"shareapptext"=>$shareapptext,"superbanner"=>$superbanner,"squaremenus"=>$squaremenus,"recommends"=>$recommendlist,"opensoons"=>$soonlist));

?>