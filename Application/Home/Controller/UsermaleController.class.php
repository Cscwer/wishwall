<?php
/**
 *男生个人中心控制器
 *@author: waterbear
 */
namespace Home\Controller;
use Think\Controller;
use Common\Controller\Message;
class UsermaleController extends InitController {
    private $userid;
    private $femaleid;

    /**
     *输出页面
     */
    public function male() {
        if(!isGirl()) {
            $this->display();
        }
        else{
            //TODO 部署时删去'/wishwall'
            redirect('/Userfemale/female');
        }
    }

    /**
     *领取愿望
     */
  public function myPromise() {
        if(IS_AJAX && !isGirl()) {
            $data = I('post.');
            $wishid = $data['wish_id'];
            if($this->isCanPromise($wishid)) {

                //更新资料
                $data['user_id'] = $this->userid;
                $result = $this->updateUser($data);
                if(!$result) {
                    $Return['result'] = 'ERROR';
                    $this->ajaxReturn($Return);

                }
                //获取女生信息
                $usergirl = D('Users');
                $Return['data'] = $usergirl->showdata($this->femaleid);
                $Return['message'] = '少侠福利来了。';
                $Return['result'] = 'SUCCESS';

                //更新愿望表
                $this->updateWish($wishid);

                //更新hr表
                $this->updateHr($wishid);

                //更新消息发送邮件
                $this->updateMessage($wishid,$this->userid,$this->femaleid);
            }
            else {
                $Return['message'] = '愿望领取失败,请稍后再领取。';
                $Return['result'] = 'ERROR';
            }
        }
        else {
            $Return['message'] = '请求错误';
            $Return['result'] = 'ERROR';
        }
        $this->ajaxReturn($Return);
    }
    /**
     *判断能不能领取愿望
     * 条件:1.wishid属于wishes这张表
     *      2.wishid不存在hr这张表中
     *      3.愿望领取间隔大于1小时
     *@return false:不能 true:能
     */
    private function isCanPromise($wishid) {
        $wishid = (int)$wishid;
        $this->userid = session('user_id');
        //检测是否有这个愿望
        $wishes = M('Wishes');
        $result = $wishes->where('wish_id=%d and status = 0',$wishid)
                         ->field('female_id')
                         ->find();
        if(empty($result['female_id'])) {
            return false;
        }
        $this->femaleid = $result['female_id'];
        //检测愿望是否被领取
        $hr = M('Hr');
        $male = $hr->where('wish_id=%d',$wishid)
                   ->find();
        //如果愿望存在hr表中则不能领取
        if($male) {
            return false;
        }
        //检测领取愿望间隔是否超过半个小时
        $maxStartime = $hr->where('male_id=%d and status = 1',$this->userid)
                          ->max('startime');
        $maxStartime = strtotime($maxStartime);
        //检测愿望领取间隔时间
        $intervaltime = C('INTERVALTIME');
        $nowtime = time();
        if($nowtime - $maxStartime < $intervaltime) {
            return false;
        }
        return true;
    }

    /**
     *领取愿望后更新愿望状态
     *
     */
    private function updateWish($wishid) {
        $wish['wish_id'] = $wishid;
        $data['status'] = C('STATUS.PROCESSING');
        $data['male_id'] = $this->userid;
        $wishes = D('Wishes');
        $wishes->where('wish_id = %d',$wishid)
               ->save($data);
    }

    /**
     *给Hr表增加记录
     *
     */
    private function updateHr($wishid) {
        $hr['male_id'] = $this->userid;
        $hr['wish_id'] = $wishid;
        $hr['female_id'] = $this->femaleid;
        $hr['startime'] = date('Y-m-d H:i:s');
        $hr['status'] = C('STATUS.PROCESSING');
        $hr['hr'] = 0;
        $HR = M('Hr');
        $HR->data($hr)
           ->add();
    }

    /**
     *更新用户资料
     */
    private function updateUser($userinfo) {
        $user = D('Users');
        $result = $user->savedata($userinfo);
        if(is_array($result)){
            return false;
        }
        return true;
    }

    /**
     *更新消息发送邮件
     */
    private function updateMessage($wishid,$userid,$femaleid) {
        $message = new Message();
        $user = M('Users');
        $name = $user->where('user_id = %d',$userid)
                     ->field('name')
                     ->find();
        $title = '系统消息';
        $text = '菇凉，你的愿望已被'.$name['name'].'少侠领取。';
        //1为系统
        $message->sendMessage($wishid,$text,1,$femaleid);
        $message->sendMail($femaleid,$title,$text);
    }

}
