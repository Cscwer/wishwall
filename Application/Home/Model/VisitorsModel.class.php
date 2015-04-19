<?php
/**
 *定义访客模型操作visitors这张表
 *
 *@author:waterbear
 */
namespace Home\Model;
use Think\Model;

class VisitorsModel extends Model{

    /**
     * 存储信息到数据库中
     * @return boolean true:操作成功,false:操作失败(被拉入黑名单)
     */
    public function savedata($data) {
        $openid = $data['openid'];
        //信息不存在则添加
        if(!$this->isexist($openid)){
           // $map['visitor_id'] = NULL;
            $map['nickname'] = $data['nickname'];
            $map['sex'] = $data['sex'];
            $map['head_url'] = $data['headimgurl'];
            $map['open_id'] = $data['openid'];
            $result = $this->add($map);
            //操作成功返回主键的值
            if($result){
                $loginInfo['user_id'] = $result;
                $loginInfo['sex'] = $data['sex'];
                $this->setLogin($loginInfo);

                 return 'first';
            }

        }
        else{
            $userid = session('user_id');
            //检测是否在黑名单
            if($this->isblack($userid)) {
                $result['message'] = '您已被拉入黑名单中';
                //删除当前会话
                session(null);
                return $result;
            }
            //检测hr有没有到期
            $this->checkHr($userid,$openid);
            //再次检测是否在黑名单中
            if($this->isblack($userid)) {
                $result['message'] = '您已被拉入黑名单中';
                //删除当前会话
                session(null);
                return $result;
            }
            else {

                //更新获得的信息
                $changedata['nickname'] = $data['nickname'];
                $changedata['head_url'] = $data['headimgurl'];
                $this->where('visitor_id = %d',$userid)
                    	->field('nickname,head_url')
                    	->save($changedata);
                return true;
            }
        }
    }

    /**
     *检测hr有没有到期
     */
    public function checkHr($userid,$openid) {
        if(isGirl()) {
            return;
        }
        $hr = M('Hr');
        //先计算hr有没有超过2个
        $hrsum = $hr->where('male_id = %d and status =1')
                    ->sum('hr');
        if($hrsum > 1) {
            //hr大于两个召唤黑名单
            $this->updateBlack($userid,$openid);
            return;
        }
        else {
            //检测时间有没有超过3天
            $minstartime = $hr->where("male_id = %d",$userid)
                              ->min('startime');
            $deadline = C('DEADLINE');
            $nowtime = time();
            if($nowtime - strtotime($minstartime) > $deadline) {
                $map['male_id'] = $userid;
                $map['startime'] = $minstartime;
                //让对应的hr加1
                $hr->where($map)
                    ->setInc('hr');
                $data['startime'] = $minstartime;
                $hr->where($map)->field('startime')->save($data);
                //如果hrsum已经存在,再次召唤黑名单
                if($hrsum) {
                    $this->updateBlack($userid,$openid);
                }
            }
        }
    }

    /**
     *检测有没有过期
     */
    public function checkWishesHr($userid,$openid){
         if(isGirl()) {
            return;
        }
        $userid = (int)$userid;
        $wisheshr = M('Wisheshr');
        $hr = M('Hr');
        $hrCount = $wisheshr->where('user_id = %d',$userid)
                            ->field('hr')
                            ->find();
        $hrsum = $hrCount['hr'];
        if($hrsum > 1) {
            //hr大于两个召唤黑名单
            $this->updateBlack($userid,$openid);
            return;
        }
        else{
              //检测时间有没有超过3天
            $minstartime = $hr->where("male_id = %d",$userid)
                              ->min('startime');
            echo $minstartime;
            return;
            $deadline = C('DEADLINE');
            $nowtime = time();
            if($nowtime - strtotime($minstartime) > $deadline) {
                $map['user_id'] = $userid;
                $map['startime'] = $minstartime;
                //让wisheshr中对应的hr加1
                 $hrdata = $hr->where($map)
                             ->field('male_id,wish_id,female_id')
                             ->find();
                //更新消息箱，邮件，愿望列表
                $this->updateAll($hrdata);
                
                //删除hr表中的记录
                $hr->where($map)->delete();
                if($hrsum){
                     $wisheshr->where('user_id = %d',$userid)
                              ->setInc('hr');
                    //hr已经为2召唤黑名单
                    $this->updateBlack($userid,$openid);
                }
                else{
                    $data['user_id'] = $userid;
                    $data['hr'] = 1;
                    $wisheshr->add($data);
                }
               
                
            }
        }
        
    }

    /**
    * 检测是否在黑名单
    * @return boolean true:存在,false:不存在
    */
    public function isblack($userid) {
        $black = M('black');
        $map['user_id'] = $userid;
        $row = $black->where($map)
                     ->field('user_id')
                     ->find();
        if(!empty($row['user_id'])){
            return true;
        }
        else{
            return false;
        }
    }

    /**
    *检测是否注册过
    *@return boolean true:已注册 false:未注册
    */
    private function isexist ($openid) {
        $map['open_id'] = $openid;
        $row = $this->where($map)
                    ->field('visitor_id,sex')
                    ->find();
        if(empty($row['visitor_id'])){
            return false;
        }
        else{
            //用户存在设置会话信息
            $row['user_id'] = $row['visitor_id'];
            $this->setLogin($row);
            return true;
        }
    }

    /**
    * 设置登陆会话信息
    */
    private function setLogin($loginInfo) {
       // session(array('name' => 'session_name','expire'=> '1800'));
        session('user_id',$loginInfo['user_id']);
        session('sex',$loginInfo['sex']);
        session('expiretime33',time() + 3600);
        header("Cache-Control: no-cache");
    }

    /**
     *召唤黑名单
     */
    private function updateBlack($userid,$openid) {
        $black = M('black');
        $data['user_id'] = $userid;
        $data['open_id'] = $openid;
        $black->add($data);
    }


     /**
     *更新infotmation表,wishes表和发送邮件
     */
    private function updateAll($data){
        $title = '系统消息';
        $message = new Message();
        $user = M('Users');
        //发消息给男生
        $male = $user->where('user_id = %d',$data['male_id'])
                     ->field('name,email')
                     ->find();
        $female = $user->where('user_id = %d',$data['female_id'])
                     ->field('name,email')
                     ->find();
        $text = '少侠您接下的'.$female['name'].'的愿望，由于三天内没有完成，已被系统回收';
         //1为系统
        $message->sendMessage($data['wish_id'],$text,1,$data['male_id']);
        $message->sendMail($data['male_id'],$title,$text,$male['email']);
        
        //发消息给女生
        $text = '菇凉您被'.$male['name'].'接下的的愿望，由于三天内没有完成，已被系统回收';
        $message->sendMessage($data['wish_id'],$text,1,$data['female_id']);
        $message->sendMail($data['female_id'],$title,$text,$data['email']);
        
        //回收愿望
        $wish = M('Wishes');
        $wishdata['male_id'] = 0;
        $wishdata['status'] = 0;
        $wishdata['time'] = date('Y-m-s H:i:s');
        $wish->where('wish_id=%d',$data['wish_id'])
             ->save($wishdata);
        
    }
}
