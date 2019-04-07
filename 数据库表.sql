-- phpMyAdmin SQL Dump
-- version 2.10.2
-- http://www.phpmyadmin.net
-- 
-- 主机: 10.165.35.203:3306
-- 生成日期: 2019 年 04 月 07 日 17:22
-- 服务器版本: 1.0.12
-- PHP 版本: 5.5.14

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";

-- 
-- 数据库: `wpoy`
-- 

-- --------------------------------------------------------

-- 
-- 表的结构 `xcx_zj_coinhistory`
-- 

CREATE TABLE `xcx_zj_coinhistory` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `ownerid` varchar(32) CHARACTER SET utf8 NOT NULL,
  `value` int(10) NOT NULL,
  `createdate` int(10) unsigned NOT NULL,
  `msg` varchar(50) CHARACTER SET utf8 NOT NULL,
  `type` tinyint(1) unsigned NOT NULL COMMENT '1时领，2消费，3转账，4奖励',
  PRIMARY KEY (`id`),
  KEY `ownerid` (`ownerid`,`createdate`,`type`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=17096 ;

-- --------------------------------------------------------

-- 
-- 表的结构 `xcx_zj_comments`
-- 

CREATE TABLE `xcx_zj_comments` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `luckydrawid` int(10) unsigned NOT NULL,
  `ownerid` varchar(32) NOT NULL,
  `ownernickname` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `ownerheadimg` varchar(150) NOT NULL,
  `content` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `createdate` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `luckydrawid` (`luckydrawid`,`ownerid`,`createdate`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=59 ;

-- --------------------------------------------------------

-- 
-- 表的结构 `xcx_zj_formids`
-- 

CREATE TABLE `xcx_zj_formids` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `ownerid` varchar(32) CHARACTER SET utf8 NOT NULL,
  `formid` varchar(32) CHARACTER SET utf8 NOT NULL,
  `createdate` int(10) unsigned NOT NULL,
  `used` tinyint(1) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `ownerid` (`ownerid`,`createdate`),
  KEY `used` (`used`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=28963 ;

-- --------------------------------------------------------

-- 
-- 表的结构 `xcx_zj_joins`
-- 

CREATE TABLE `xcx_zj_joins` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `luckydrawid` int(10) unsigned NOT NULL,
  `ownerid` varchar(32) NOT NULL,
  `ownernickname` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `msg` varchar(10) NOT NULL,
  `createdate` int(10) unsigned NOT NULL,
  `getaward` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '是否中奖',
  `awarddate` int(10) unsigned NOT NULL COMMENT '中奖日期',
  `awardnoticed` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '已发送中奖通知',
  `expressnoticed` tinyint(1) NOT NULL DEFAULT '0' COMMENT '已发送快递通知',
  `expressaddress` varchar(1000) NOT NULL COMMENT '快递地址',
  `expressno` varchar(20) NOT NULL COMMENT '快递单号',
  `expressremark` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT '快递备注',
  PRIMARY KEY (`id`),
  KEY `luckydrawid` (`luckydrawid`,`ownerid`,`createdate`),
  KEY `ownernickname` (`ownernickname`),
  KEY `getaward` (`getaward`),
  KEY `awarddate` (`awarddate`,`awardnoticed`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=10245 ;

-- --------------------------------------------------------

-- 
-- 表的结构 `xcx_zj_luckydraws`
-- 

CREATE TABLE `xcx_zj_luckydraws` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `ownerid` varchar(32) NOT NULL,
  `awardimage` varchar(50) NOT NULL,
  `awardvideo` varchar(100) NOT NULL,
  `awardname` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `awardnum` tinyint(1) unsigned NOT NULL DEFAULT '1',
  `awardpics` varchar(100) NOT NULL,
  `startdate` int(10) unsigned NOT NULL COMMENT '开始日期，满足放可参与，为空时则不限',
  `opentype` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '0按时间，1按人数，2手动',
  `opendate` int(10) unsigned NOT NULL COMMENT '开奖日期',
  `openneedusers` int(5) unsigned NOT NULL DEFAULT '1',
  `advdistancetype` tinyint(1) unsigned NOT NULL,
  `advgendertype` tinyint(1) unsigned NOT NULL,
  `advbarcode` varchar(50) NOT NULL COMMENT '解锁条码',
  `advcoinbottom` int(5) unsigned NOT NULL,
  `advpassword` varchar(12) NOT NULL,
  `advpasswordtips` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `advgpscity` varchar(10) NOT NULL,
  `advgps` varchar(100) NOT NULL,
  `advgpsaddr` varchar(100) NOT NULL,
  `advneedinfokey` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `advshare` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '是否分享加几率',
  `advispublic` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '是否公开，进入到全部抽奖或是地图内',
  `createdate` int(10) unsigned NOT NULL COMMENT '创建日期',
  `sponser` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT '赞助商',
  `sponserslogan` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT '赞助商宣传语',
  `sponserurl` varchar(100) NOT NULL COMMENT 'h5地址，没有xcxid时可用',
  `sponserxcxid` varchar(50) NOT NULL COMMENT '赞助商小程序id',
  `sponsercxcpath` varchar(50) NOT NULL COMMENT '小程序path',
  `isopened` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '已开奖',
  `isrecommend` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '是否推荐',
  `isdelete` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '是否已删除',
  `homeindex` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '上首页',
  `viewcount` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '被查看次数',
  `sponserclickcount` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '赞助商入口被点击次数',
  PRIMARY KEY (`id`),
  KEY `ownerid` (`ownerid`,`awardnum`,`opentype`,`opendate`,`openneedusers`,`advgpscity`,`advgps`),
  KEY `createdate` (`createdate`),
  KEY `sponser` (`sponser`),
  KEY `advbarcode` (`advbarcode`),
  KEY `isopened` (`isopened`),
  KEY `isrecommend` (`isrecommend`),
  KEY `homeindex` (`homeindex`),
  KEY `isdelete` (`isdelete`),
  KEY `advispublic` (`advispublic`),
  KEY `startdate` (`startdate`),
  KEY `viewcount` (`viewcount`),
  KEY `sponserclickcount` (`sponserclickcount`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=538 ;

-- --------------------------------------------------------

-- 
-- 表的结构 `xcx_zj_members`
-- 

CREATE TABLE `xcx_zj_members` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `openid` varchar(32) NOT NULL,
  `nickname` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `headimg` varchar(150) NOT NULL,
  `gender` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '1男2女',
  `area` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `city` varchar(20) NOT NULL,
  `province` varchar(20) NOT NULL,
  `country` varchar(20) NOT NULL,
  `age` tinyint(2) unsigned NOT NULL,
  `type` tinyint(1) unsigned NOT NULL DEFAULT '10' COMMENT '普通10，101高级用户，管理员251',
  `joindate` int(10) unsigned NOT NULL,
  `lastlogin` int(10) unsigned NOT NULL COMMENT '最后登录',
  `baned` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '封禁',
  `coin` int(10) unsigned NOT NULL DEFAULT '10' COMMENT '积分/代币',
  `lastearncoin` int(10) unsigned NOT NULL COMMENT '上次收获RP币的时间',
  `optiondetail` varchar(10000) NOT NULL COMMENT 'json串，自定义资料',
  PRIMARY KEY (`id`),
  UNIQUE KEY `openid` (`openid`),
  KEY `gender` (`gender`,`city`,`province`,`country`,`type`,`joindate`),
  KEY `baned` (`baned`),
  KEY `area` (`area`),
  KEY `coin` (`coin`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=6569 ;
