<?php
$sae = false;

// 默认是本地不是SAE
if($sae){
    return array(
      //SAE下固定mysql配置
        'DB_TYPE'           =>  'mysql',     // 数据库类型
        'DB_DEPLOY_TYPE'    =>  1,
        'DB_RW_SEPARATE'    =>  true,
        'DB_HOST'           =>  SAE_MYSQL_HOST_M.','.SAE_MYSQL_HOST_S, // 服务器地址
        'DB_NAME'           =>  SAE_MYSQL_DB,        // 数据库名
        'DB_USER'           =>  SAE_MYSQL_USER,    // 用户名
        'DB_PWD'            =>  SAE_MYSQL_PASS,         // 密码
        'DB_PORT'           =>  SAE_MYSQL_PORT,        // 端口
        //更改模板替换变量，让普通能在所有平台下显示
        'TMPL_PARSE_STRING' =>  array(
            // __PUBLIC__/upload  -->  /Public/upload -->http://appname-public.stor.sinaapp.com/upload
            //'/Public/upload'    =>  $st->getUrl('public','upload')
        ),
        'LOG_TYPE'          =>  'Sae',
        'DATA_CACHE_TYPE'   =>  'Memcachesae',
        'CHECK_APP_DIR'     =>  false,
    );

}
else{
        return array(
        // 添加本地数据库配置信息
        'DB_TYPE'   => 'mysql', // 数据库类型
        'DB_HOST'   => 'localhost', // 服务器地址
        'DB_NAME'   => '', // 数据库名
        'DB_USER'   => '', // 用户名

        'DB_PWD'    => '',// 密码
        'DB_PORT'   => '3306', // 端口
        'DB_PREFIX' => '', //数据库表前缀
    );
}


