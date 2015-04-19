<?php
/**
 *匹配暗恋人
 *@author:waterbear
 */

namespace Common\Controller;
use Think\Controller;
use Common\Controller\Message;
class Secret extends Controller{

    public function checkSecret($userid,$secret) {
        $user = D('Users');
        $map['secret'] = $secret;
        $resultother = $user->join('RIGHT JOIN love ON love.user_id = users.user_id')
        					->where($map)
                            ->field(array('user_id','name','secret','email'))
                            ->find();
        $otheridsecret = $resultother['secret'];
        if(empty($otheridsecret)) {
            return;
        }
        //$resultself = $user->showdata($userid);
        //匹配不成功
        if($otheridsecret != $secret) {
            return;
        }
        //匹配成功发送消息
        $title = '系统消息';
        $textself = '同学福利来了'.$secret.'也同时暗恋着你';
        $this->updateInformation($userid,$title,$text);
        $textother = '同学福利来了'.$resultother['name'].'也同时暗恋着你';
        $this->updateInformation($resultother['user_id'],$title,$text);
    }

    private function updateInformation($acceptid,$title,$text) {
        $information = D('Informationbox');
        $message = new Message();
        $data = array(
            'user_id' => $acceptid,
            'info_content' => $text,
            'info_type' => 2,
            'status' => 0,
            'sendtime' => date('Y-m-d H:i:s'),
            'from_id' => 1
        );
        $information->data($data)
                    ->add();
        $message->sendMail($acceptid,$title,$text);
    }
}
