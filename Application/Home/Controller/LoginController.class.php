<?php
/**
 *系统基础控制器,检测是否登陆
 *@author:waterbear
 */

namespace Home\Controller;
use Think\Controller;

class LoginController extends Controller{
    protected $appid;
    protected $appsecret;
    protected $state;
    
       public function __construct(){
          parent::__construct();
      	  $this->appsecret = C('APPSECRET');
             $this->appid = C('APPID');
           $this->state = C('STATE');
    }
    
   
    /**
     *授权回调函数获取code
     */
    public function callback () {
        $code = I('get.code');
        if(!empty($code)){
            $getstate = I('get.state');
            if($getstate != $this->state){
             		$result['message'] = 'state参数不正确';
            		$this->ajaxReturn($result);
            }
            $data = $this->getUserInfo($code);
            //$this->ajaxReturn($data);

        //测试方法,进行登陆操作
        //$data = C('LOGIN');
            if(!$data['sex']) {
                echo '<meta charset="utf-8"/>童鞋您的性别信息不完整哦,无法登陆,请检查后再登陆';
                return;
            }

        $openid = $data['openid'];
            //TODO
            if($openid){
                
                $vistor = D('Visitors');
                //TODO
                $result = $vistor->savedata($data);
                if(is_array($result)) {
                    $this->ajaxReturn($result);
                }
                if($result == 'first'){
                    redirect('/animation');
                }
                else{
                    // $this->success('登陆成功',U('Service/homepage'));
                    redirect('/homepage');
                }
                
            }

        }
        else{
            //TODO
            $this->login();
        }

    }
    /**
     * 获取微信用户的资料
     *@return array
     */
      protected function getUserInfo ($code) {
        //TODO
        //用code换取access_token
        if(!empty($code)){
          
            $urltoken = "https://api.weixin.qq.com/sns/oauth2/access_token?appid="
                        .$this->appid."&secret=".$this->appsecret."&code="
                        .$code."&grant_type=authorization_code";
            $result = $this->httpRequest($urltoken);
            //用access_token获取用户信息
            //$this->ajaxReturn($result);
            $access_token = $result['access_token'];
            if($access_token){
                
                $openid = $result['openid'];
                //$this->ajaxReturn($access_token);
                $urlInfo = "https://api.weixin.qq.com/sns/userinfo?access_token=".$access_token."&openid=".$openid."&lang=zh_CN";
                $userInfo = $this->httpRequest($urlInfo);
                return $userInfo;
            }
        }
      }

    /**
     *
     * 用curl获取指定url信息
     * @return array
     */
      protected function httpRequest ($url) {
        $curl = curl_init();
        curl_setopt($curl,CURLOPT_URL,$url);
        //设置不进行服务器验证
        curl_setopt($curl,CURLOPT_SSL_VERIFYPEER,FALSE);
        curl_setopt($curl,CURLOPT_SSL_VERIFYHOST,FALSE);
        curl_setopt($curl,CURLOPT_RETURNTRANSFER,1);
        $result = json_decode(curl_exec($curl),true);
        curl_close();
        return $result;
     }
}
