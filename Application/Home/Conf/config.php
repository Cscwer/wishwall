<?php
return array(
    //路由规则配置
    //TODO
  'URL_ROUTE_RULES'=>array(
      'wishes/:page\d' => 'Index/wishes',
      'callback/:code/:state' => 'Login/callback',
      'screen' => 'Index/screen',
      'search' => 'Index/search',
      'edit'    => 'Users/edit',
      'editSecret' => 'Users/editSecret',
      'myInfo'  => 'Users/myInfo',
      'myMessage'   => 'Users/myMessage',
      'myWishMessage' => 'Users/myWishMessage',
      'myWish/:status\d' => 'Users/myWish',
      'suggest' => 'Users/suggest',
      'finishedInfo/:id\d' => 'Users/finishedInfo',
      'confirminfo/:id\d' => 'Userfemale/confirminfo',
      'myPromise' => 'Usermale/myPromise',
      'myComment' => 'Users/myComment',
      'myPray' => 'Userfemale/myPray',
      'editWish' => 'Userfemale/editWish',
      'confirm' => 'Userfemale/confirm',
      'deleteWish' => 'Userfemale/deleteWish',
      'homepage' => 'Service/homepage',
      'usercenter' => 'Service/usercenter',
      'about' => 'Service/about',
      'getNickimage' => 'Users/getNickimage',
      'lookaroundus' => 'Service/lookaroundus',
      'animation' => 'Service/homepage',
      'help' => 'Service/help'
  ),
    //愿望领取间隔时间和愿望实现期限
  'INTERVALTIME' => 300,//半小时
  'DEADLINE' => 259200,//三天
  //召唤黑名单所需的数量
  'DEADHR' => 2,
  //状态配置
  'STATUS' => array(
      'NOPROMISE' => 0,//没有人接受
      'PROCESSING' => 1,//正在进行
      'FINISHED' => 2,//完成的
      'ABANDONED' => 3 //被删除的
  ),
  //模板配置
  'TMPL_PARSE_STRING' => array(
    '__STYLE__' => __ROOT__ . '/Public'
),
//session配置
  'SESSION_AUTO_START' => true,
    'SESSION_EXPIRE' => '3600',
 // 'SESSION_OPTIONS' => array('expire' => 1800)

    'DEFAULT_CONTROLLER' => 'Service',
    'STATE' => 'wishwall123456'
    );
