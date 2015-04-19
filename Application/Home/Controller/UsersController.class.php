<?php
/**
 *用户中心控制器
 *@author:waterbear
 */
namespace Home\Controller;
use Think\Controller;
use Common\Controller\Message;
use Common\Controller\Secret;
//TODO 继承初始化类
class UsersController extends InitController{
    private $user;
    private $userid;
    /**
     *获得个人资料
     *@return:array
     */
    public function myInfo () {
        if(IS_AJAX && IS_GET) {
            $Return['data'] = $this->user->showdata($this->userid);
            $Return['message'] = '';
            $Return['result'] = 'SUCCESS';
            $this->ajaxReturn($Return);
        }
        else{
            $Return['message'] = '提交错误';
            $Return['result'] = 'ERROR';
            $this->ajaxReturn($Return);
        }
    }

    /**
     *返回个人消息
     *@return:array
     */
    public function myMessage() {
        if(IS_AJAX && IS_GET) {
            $info = D('Informationbox');
            $Return['data'] = $info->showMessage();
            $Return['message'] = '';
            $Return['result'] = 'SUCCESS';
            $this->ajaxReturn($Return);
        }
        else{
            $Return['message'] = '提交错误';
            $Return['result'] = 'ERROR';
            $this->ajaxReturn($Return);
        }
    }

    /**
     *返回愿望留言
     *@return:array
     */
    public function myWishMessage() {
       if(IS_AJAX && IS_POST) {
            $wishid = I('post.wishid');
            $info = D('Informationbox');
            $Return['data'] = $info->showWishMessage($wishid);
            $Return['message'] = '';
            $Return['result'] = 'SUCCESS';
            $this->ajaxReturn($Return);

        }
        else {
            $Return['message'] = '提交错误';
            $Return['result'] = 'ERROR';
            $this->ajaxReturn($Return);
        }

    }

    /**
     *点击留言时获取已完成愿望的详情
     *
     */
    public function finishedInfo() {
        if(IS_AJAX && IS_GET) {
            $wishid = I('get.id');
            $wish = M('Wishes');
            $hr = M('Hr');
            $status = C('STATUS.FINISHED');
            if(isGirl()) {
                //TODO 部署时将photo_url 换成head_url
                //当前用户为女生时返回男生资料
                $Return['data'] = $wish->join('users ON users.user_id = wishes.male_id')
                    									->join('visitors ON visitors.visitor_id = wishes.male_id')
                                       					->field('wish_text,photo_url,name,campus,college,email,tel_long,tel_short,head_url')
                                       					->where('wishes.wish_id = %d and wishes.status =%d',$wishid,$status)
                                       					->find();
            }
            else {
                //当前用户为男生时返回女生资料
                $Return['data'] = $wish->join('users ON users.user_id = wishes.female_id')
                    									->join('visitors ON visitors.visitor_id = wishes.female_id')
                                       					->field('wish_text,photo_url,name,campus,college,email,tel_long,tel_short,head_url')
                                       					->where('wishes.wish_id = %d and wishes.status =%d',$wishid,$status)
                                       					->find();
            }
                $star = $hr->where('wish_id = %d',$wishid)
                           ->field('star')
                           ->find();
            $Return['data']['star'] = $star['star'];
        }
        else {
            $Return['message'] = '获取信息失败';
            $Return['result'] = 'ERROR';
        }
        $this->ajaxReturn($Return);
    }

    /**
     *个人中心未实现,实现ing,已实现,愿望
     *@return:array
     */
    public function myWish() {
        if(IS_AJAX && IS_GET) {
            $status = I('get.status');
            //愿望只有0:未被接受,1:正在进行
            //2:完成,3:删除.四种情况
            if($status >=0 && $stateus < 3) {
                $mywish = D('Wishes');
                $map['status'] = $status;
                //1为男性
                if(!isGirl()) {
                    $map['male_id'] = $this->userid;
                }
                else {
                    $map['female_id'] = $this->userid;
                }
                $Return['data'] = $mywish->showList($map);
                $Return['message'] = '';
                $Return['result'] = 'SUCCESS';
            }
            else{
                $Return['message'] = '提交错误';
            }
            if($Return['data']) {
                $Return['sex'] = session('sex');
            }
            $this->ajaxReturn($Return);
       }
       else {
            $Return['message'] = '请求错误';
            $this->ajaxReturn($Return);
       }
    }


    /**
     *修改用户基本资料
     */
    public function edit() {
        //TODO
        if(IS_AJAX && IS_POST) {
            $data = I('post.');
            $data['user_id'] = $this->userid;
            $user = D('Users');
            $result = $user->savedata($data);
            if(is_array($result)) {
                $Return['message'] = $result;
                $Return['result'] = 'ERROR';
            }
            else {
                $Return['message'] = '修改成功';
                $Return['result'] = 'SUCCESS';
            }
        }
        else {
            $Return['message'] = '请求错误';
            $Return['result'] = 'ERROR';
        }

        $this->ajaxReturn($Return);
    }

    /**
     *修改暗恋人
     *
     */
    public function editSecret() {
        if(IS_AJAX && IS_POST) {
            $data['user_id'] = $this->userid;
            $data['secret'] = I('post.secret');
            $result = $this->user->savelovedata($data);
            $lovesecret = $data['secret'];
            //if(!empty($lovesecret) && $result){
                //检查暗恋人
                // $secret = new Secret();
                 //$secret->checkSecret($this->userid,$lovesecret);
            //}
            if($result) {
                $Return['message'] = '修改成功';
                $Return['result'] = 'SUCCESS';
            }
        }
        else {
            $Return['message'] = '请求错误';
            $Return['result'] = 'ERROR';
        }
        $this->ajaxReturn($Return);
    }

    /**
     *留言
     *
     */
    public function myComment() {
        if(!IS_POST) {
            $Return['message'] = '请求错误';
            $Return['result'] = 'ERROR';
            $this->ajaxReturn($Return);
        }
        $wishid = I('post.wish_id');
        $text = I('post.text');
        $message = new Message();
        $result = $message->sendMessage($wishid,$text,$this->userid);
        if(!$result ) {
            $Return['message'] = '数据提交错误';
            $Return['result'] = 'ERROR';
        }
        else {
            $Return['message'] = '留言成功';
            $Return['result'] = 'SUCCESS';
        }
        $this->ajaxReturn($Return);
    }

    /**
     *反馈意见
     */
    public function suggest() {
        if(IS_AJAX && IS_POST) {
            $suggdata['sugg_content'] = I('post.suggcontent');
            $suggdata['email'] = I('post.email');
            $suggtime = session('suggtime');
            if($suggtime && (time() - $suggtime)< 30 ) {
                $Return['result'] = 'ERROR';
                $this->ajaxReturn($Return);
            }
            else {
                session('suggtime',time());
            }
            $suggdata['user_id'] = $this->userid;
            $suggdata['sugg_time'] = date('Y-m-d H:i:s');
            $rules = array(
                array('sugg_content','1,200','建议不能为空或者超过两百字',0,'length'),
                array('email','email','邮箱格式错误')
            );
            $suggest = M('Suggestion');
            if(!$suggest->validate($rules)->create($suggdata)) {
                $this->ajaxReturn($suggest->getError());
            }
            $suggest->data($suggdata)->add();
            $Return['message'] = '反馈成功,感谢您的建议';
            $Return['result'] = 'SUCCESS';
        }
        else {
            $Return['message'] = '提交失败';
            $Return['result'] = 'ERROR';
         }
        $this->ajaxReturn($Return);
    }

     /**
    *获取自己的头像和昵称
    */
    public function getNickimage() {
        if(IS_AJAX && IS_GET) {
            $visitors = M('Visitors');
            $Return['data'] = $visitors->where('visitor_id = %d',$this->userid)
                                       ->field('nickname,head_url')
                                       ->find();
            $Return['result'] = 'SUCCESS';
        }
        else{
            $Return['result'] = 'ERROR';
        }
        $this->ajaxReturn($Return);
    }

    /**
     *构造函数初始化user和userid
     */
    //TODO 测试
    public function __construct() {
        parent::__construct();
        $this->user = D('Users');
        $this->userid = session('user_id');
     }

}

