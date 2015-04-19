<?php
/**
 *女生个人中心控制器
 *@author: waterbear
 */
//TODO status使用配置文件
namespace Home\Controller;
use Think\Controller;
use Common\Controller\Message;
class UserfemaleController extends InitController{
    private $userid;
    private $wish;

    /**
     *
     */
    public function female() {
        if(isGirl()) {
            $this->display();
        }
        else{
            //TODO 部署时删去'/wishwall'
            redirect('/Usermale/male');
        }
    }


   /**
     *许愿
     */
    public function myPray() {
        if(IS_AJAX && isGirl()) {
            $wishtime = session('wishtime');
            $nowtime = time();
            if($wishtime && ($nowtime - $wishtime < 10)){
                return;
            }
            else{
                session('wishtime',time());
            }
            $data = I('post.');
            $userdata = $data['userinfo'];
            $user = D('Users');
            $userdata['user_id'] = $this->userid;
            $result = $user->savedata($userdata);
            //返回结果为数组,则更新资料失败
            if(is_array($result)) {
                $this->ajaxReturn($result);
            }
            $wishdata['wish_type'] = $data['wish_type'];
            $wishdata['wish_text'] = $data['wish_text'];
            $wishdata['female_id'] = $this->userid;
            $wishdata['status'] = C('STATUS.NOPROMISE');
            $result = $this->wish->saveWish($wishdata);
            //返回结果为数组,则说明许愿失败
            if(is_array($result)) {
                $this->ajaxReturn($result);
            }
            $Return['message'] = '恭喜菇娘许愿成功,这是当前许的第'.$result.'个愿望。';
            $Return['result'] = 'SUCCESS';
        }
        else {
            $Return['message'] = '许愿失败。';
            $Return['result'] = 'ERROR';
        }
        $this->ajaxReturn($Return);
    }


    /**
     *修改愿望
     */
    public function editWish() {
        if(IS_AJAX && isGirl()) {
            $wishdata = I('post.');
            $wishdata['female_id'] = $this->userid;
            $result = $this->wish->saveWish($wishdata);
            if(is_array($result) || !$result) {
                $this->ajaxReturn($result);
            }
            $Return['message'] = '愿望修改成功。';
            $Return['result'] = 'SUCCESS';
        }
        else {
            $Return['message'] = '愿望修改失败。';
            $Return['result'] = 'ERROR';
        }
        $this->ajaxReturn($Return);
    }

    /**
     *确认愿望完成时获取信息
     *
     */
    public function confirminfo() {
        if(IS_AJAX && IS_GET) {
            $wishid = I('get.id');
            $wish = M('Wishes');
            if(isGirl()) {
                $map['female_id'] = $this->userid;
                $map['wish_id'] = $wishid;
                $map['status'] = C('STATUS.PROCESSING');
                //当前用户为女生时返回男生资料
                $Return['data'] = $wish->join('users ON users.user_id = wishes.male_id')
                                       ->field('wish_text,name,campus,college,email,tel_long,tel_short')
                                       ->where($map)
                                       ->find();
                $Return['sex'] = session('sex');
            }
            else {
                $Return['message'] = '获取信息失败';
                $Return['result'] = 'ERROR';
            }
        }
        else {
            $Return['message'] = '获取信息失败';
            $Return['result'] = 'ERROR';
        }
        $this->ajaxReturn($Return);
    }

    /**
     *确认愿望完成
     */
    public function confirm() {
       if(IS_AJAX && isGirl()) {
            $data = I('post.');
            //更新wish状态
            $wishdata['wish_id'] = $data['wish_id'];
            $wishdata['female_id'] = $this->userid;
            $wishdata['finish_time'] = date('Y-m-d H:i:s');
            //状态为2,表示已完成
            $result = $this->wish->confirmWish($wishdata);
            if(!$result) {
                $Return['message'] = '愿望确认失败。';
                $Return['result'] = 'ERROR';
                $this->ajaxReturn($Return);
            }

            //保存留言
            $message = new Message();
            $message->sendMessage($data['wish_id'],$data['message'],$this->userid);

            //更新hr表
            $hr = D('Hr');
            //更改状态为已完成(2)
            $hrdata['status'] = C('STATUS.FINISHED');
            $hrdata['star'] = (int)$data['star'];
            $map['wish_id'] = (int)$data['wish_id'];
            $map['female_id'] = $this->userid;
            $hr->where($map)
                ->save($hrdata);
            $res = $hr->where($map)
                      ->field('male_id')
                      ->find();
            //更新消息箱
            $user = M('Users');
            $name = $user->where('user_id = %d',$this->userid)
                         ->field('name')
                         ->find();
            $text = '少侠，您接下的'.$name['name'].'愿望已经确认完成了。';
            $this->updateInfomation($wishdata['wish_id'],$text,$this->userid,$res['male_id']);
            $Return['message'] = '确认成功';
            $Return['result'] = 'SUCCESS';

        }
        else {
            $Return['message'] = '提交错误';
            $Return['result'] = 'ERROR';
        }
        $this->ajaxReturn($Return);
    }

    /**
     *删除愿望
     */
    public function deleteWish() {
        if(IS_AJAX && isGirl()) {
            $wishdata['wish_id'] = I('post.wish_id');
            $wishdata['female_id'] = $this->userid;
            //状态为3,则表示愿望已删除.
            $wishdata['status'] = C('STATUS.ABANDONED');
            $result = $this->wish->delete($wishdata);
            if(!$result) {
                $Return['message'] = '愿望删除失败';
                $Return['result'] = 'ERROR';
            }
            else {
                $Return['message'] = '愿望删除成功';
                $Return['result'] = 'SUCCESS';
            }
        }
        else {
            $Return['message'] = '提交错误';
            $Return['result'] = 'ERROR';
        }
        $this->ajaxReturn($Return);
    }

    /**
     *更新消息箱发送确认邮件
     */
    private function updateInfomation($wishid,$text,$userid,$maleid) {
        $message = new Message();
        $message->sendMessage($wishid,$text,1,$maleid);
        $title = '系统消息';
        $message->sendMail($maleid,$title,$text);

    }

    public function __construct() {
        parent::__construct();
        $this->userid = session('user_id');
        $this->wish = D('Wishes');
    }
}
