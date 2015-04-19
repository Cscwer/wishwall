<?php
/**
 *页面跳转控制器
 *@author:waterbear
 */
namespace Home\Controller;
use Think\Controller;

class ServiceController extends InitController{

    /**
     *跳转到首页
     */
    public function index() {
     	$this->homepage();
    }
    public function homepage() {
        if(IS_GET) {
            if(isGirl()) {
                redirect('/Index/indexfemale');
            }
            else {
                redirect('/Index/indexmale');
            }
        }
        else {
            $this->error('操作失败',2);
        }
    }

    /**
     *跳转到个人中心
     */
    public function usercenter() {
        if(IS_GET) {
            if(!isGirl()) {
                redirect('Userfemale/female');
            }
            else {
                redirect('Usermale/male');
            }
        }
        else {
            $this->error('操作失败',2);
        }
    }

    /**
     *关于我们
     */
    public function about() {
        //TODO
        if(IS_GET) {
            redirect('Index/about');
        }
        else {
            $this->error('操作失败',2);
        }

    }

    /**
    *重力旋转
    */
    public function lookaroundus() {
        redirect('Index/lookaroundus');
    }

    /**
    *
    */
    public function animation() {
        redirect('Index/animation');
    }
    /**
     *帮助与反馈
     */
    public function help() {
        if(IS_GET) {
            redirect('Index/helpus');
        }
    }
}
