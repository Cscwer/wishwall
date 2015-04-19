<?php
/**
 *操作information_box
 *@author:waterbear
 */
namespace Home\Model;
use Think\Model;

class InformationboxModel extends Model {
    /**
     *设置自动验证规则
     *
     */
    protected $_validate = array(
        array('info_content','1,140','留言不能为空,或者超过140',0,'length')
    );

    /**
    *列出消息箱内容,同时修改消息箱状态
    *status = 0:未读消息,status = 1:已读消息
    */
    //TODO
    public function showMessage() {
        $userid = session('user_id');
        //查询愿望的留言
        $data = $this->join('users ON users.user_id = informationbox.from_id')
                     ->where('informationbox.user_id = %d and users.user_id != 1',$userid)
                     ->field(array(
                                    'substring(sendtime,6,5)' => 'time',
                                    'status',
                                    'from_id' => 'id',
                                    'name'
                                )
                            )
                     ->group('name,time,status')
                     ->order('time desc')
                     ->select();
        //查询系统发送的消息
        $system = $this->where('from_id = 1 and user_id=%d',$userid)
                       ->field(array(
                                    'substring(sendtime,6,5)' => 'time',
                                    'status',
                                    'from_id' => 'id',
                                    'info_content'
                                ))
                       ->group('time,info_content')
                       ->order('time desc')
                       ->select();
        if($system && $data) {
            $len = count($system);
            for($i = 0; $i < $len;$i++) {
                $data[] = $system[$i];
            }
        }
        //将日期相同的消息合并成一组
        $len = count($data);
        $message = array();
        for($i = 0; $len > 0; $i++) {
            $time = $data[0]['time'];
            for($j = 0; $j < $len; $j++)  {
                if($data[$j]['time'] == $time) {
                    $message[$i]['information'][] = array_slice($data[$j],1,4);
                    array_splice($data,0,1);
                    $len--;
                    $j--;
                }
                else {
                    break;
                }
            }
            $message[$i]['time'] = $time;
        }

        return $message;
    }

    /**
     *返回有关于已完成愿望的留言
     *
     */
    public function showWishMessage($wishid) {
        $userid = session('user_id');
        //发给我的消息
        $tome = $this->where('user_id = %d and wish_id = %d',$userid,$wishid)
                     ->field('from_id as id,info_content,sendtime')
                     ->order('sendtime asc')
                     ->select();
        //我发出去的消息
        $fromme = $this->where('from_id = %d and wish_id = %d',$userid,$wishid)
                       ->field('from_id as id,info_content,sendtime')
                       ->order('sendtime asc')
                       ->select();
        if($fromme) {
            $len = count($fromme);
            for($i = 0; $i < $len; $i++) {
                $tome[] = $fromme[$i];
            }
        }
        $message = $tome;
        //对信息按时间先后排序
        foreach($message as $key => $value) {
            $sendtime[$key] = $value['sendtime'];
        }
        array_multisort($sendtime,SORT_STRING,SORT_ASC,$message);
        $data['wishMessage'] = $message;
        $data['id'] = $userid;
        //将消息状态改为已读
        $map['status'] = 0;
        $changedata['status'] = 1;
        $this->where($map)
             ->save($changedata);
        return $data;
    }
}
