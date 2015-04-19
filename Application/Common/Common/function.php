<?php
/**+++------------------------------------------------
 *++++存放系统公用的函数
 *+++-------------------------------------------------
 *@author:waterbear
 */

/**
 *检测用户是否登陆
 *@return false:未登录,true:登陆
 *
 **/

function isLogin() {
    $user = session('user_id');
    $expiretime = session('expiretime33');
    if(empty($expiretime)) {
        return false;
    }
    if($expiretime < time()) {
        return false;
    }
    else{
        session('expiretime33',time() + 3600);
    }
    if(empty($user)){
        return false;
    }
    else{
        C('USERID',$user);
        return true;
    }
}

/**
 *随机生成字符串
 *@return string
 */
function getRandChar ($length) {
    $str = null;
    $strPol = "QWERTYUIOPLKJHGFDSAZXCVBNMzxcvbnmlkjhgfdsaqwertyuiop789456123";
    $max = strlen($strPol) - 1;
    for($i = 0; $i < $length; $i++){
        $str .= $strPol[rand(0,$max)];
    }
    return $str;
}

/**
 *检测是否为女生
 *@return true:女生 false:非女生
 */
function isGirl() {
    $sex = session('sex');
 
    if($sex == "2") {
        return true;
    }
    else{
        return false;
    }
}
function getUserid() {
    return session('user_id');
}


