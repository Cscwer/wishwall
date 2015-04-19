<?php
/**
 *系统基础控制器,检测是否登陆
 *@author:waterbear
 */

namespace Home\Controller;
use Think\Controller;

class InitController extends Controller{
    protected $appid;
    protected $appsecret;
    //基础类的构造函数
    public function __construct(){
        parent::__construct();
        //还未登陆
        if(!isLogin()){
            //SAE
            //$this->login();

          //本地
            $this->callback();
        }
        else{
            
              $visitors = D('Visitors');
        	  $result = $visitors->isblack(session('user_id'));
       		  if($result) {
            			session(null);
                  		$result['message'] = '你已被拉入黑名单';
                  		return $result;
        		}
        }
        
      
        
    }
    
    /**
     *跳转到微信授权页面
     */
    public function login() {
        $this->appid = C('APPID');
        //设置state参数防止跨域请求伪造
        $state =C('STATE'); //getRandChar(10);
        //session('state',$state);
        $redir = urlencode(C('REDIRECTURL'));
        $url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid="
               .$this->appid."&redirect_uri="
               .$redir."&response_type=code&scope=snsapi_userinfo&state=$state#wechat_redirect";
        redirect($url);
    }
    
    
    
    private function callback () {
       // $code = I('get.code');
       // if(!empty($code)){
       //     $getstate = I('get.state');
       //     if($getstate != session('state')){
       //         $result['message'] = 'state参数不正确';
       //         $this->ajaxReturn($result);
       //     }
       //     $data = $this->getUserInfo($code);

        //测试方法,进行登陆操作
        $data = C('LOGIN');

        $openid = $data['openid'];
            //TODO
            if($openid){
                $vistor = D('Visitors');
                //TODO
                $result = $vistor->savedata($data);
                if(is_array($result)) {
                    $this->ajaxReturn($result);
                }
                // $this->success('loginsuccess','Index/index');
                redirect('/homepage');
            }

       // }
       // else{
            //TODO
           // $this->login();
       // }

    }

}

  
