<?php
/**
 *用户模型操作users表
 *@author:waterbear
 */
namespace Home\Model;
use Think\Model;

class UsersModel extends Model {
    /**
     *设置验证规则
     */
    protected $_validate = array(
        array('name','1,40','姓名长度为1-20',0,'length'),
        array('campus',array('大学城','龙洞','东风路','番禺'),'校区输入不正确',0,'in'),
        array(
                'college',
                array(
                        '外国语学院','计算机学院','管理学院','艺术设计学院','经济与贸易学院',
                        '政法学院','建筑与城市规划学院','商学院','轻工化工学院','应用数学学院',
                        '环境科学与工程学院','机电工程学院','信息工程学院','自动化学院',
                        '材料与能源学院','土木与交通工程学院','物理与光电工程学院'
                    ),
                '学院输入不正确',
                '0',
                'in'
             ),
        array('email','email','邮箱格式错误'),
        array('tel_long','11','手机号码长度必须为11位',0,'length'),
        array('tel_short','0,8','短号长度出错',0,'length')
    );

    /**
     *开启批量验证
     */
    protected $patchValidate = true;
    /**
     *列出某一用户的信息
     *@return: array
     */
    public function showdata($userid) {
        $map['user_id'] = $userid;
        $data['info'] = $this->field('name,campus,college,email,tel_short,tel_long')
                             ->where($map)
                             ->find();
        //如果当前用户的id和传入的id相等则输出暗恋人名字
        if(session('user_id') == $userid) {
            $love = M('love');
            $data['secret'] = $love->field('secret')
                                   ->where($map)
                                   ->find();
        }
        return $data;
    }

    /**
     *存储和更新用户数据
     *测试方法
     */
    //TODO
    public function savedata($data) {
        //数据不符合则返回
        if(!$this->create($data)) {
            return $this->getError();
        }
        $map['user_id'] = $data['user_id'];
        $rows = $this->field('user_id')
                     ->where($map)
                     ->find();
        if(empty($rows)){
            //增加记录
            $result = $this->field('user_id,name,campus,college,email,tel_short,tel_long')
                           ->add();
        }
        else{
            //更新原有记录
            $changedata['name'] = $data['name'];
            $changedata['campus'] = $data['campus'];
            $changedata['college'] = $data['college'];

            $changedata['tel_short'] = $data['tel_short'];
            $changedata['tel_long'] = $data['tel_long'];
            if($data['email']){
                 $changedata['email'] = $data['email'];
            }
        	$result = $this->where('user_id = %d',$map['user_id'])
        							->field('name,campus,college,email,tel_short,tel_long')
        							 ->save($changedata);
        }
        return true;
    }

    /**
     *存储和修改暗恋人
     */
    public function savelovedata($data) {
        //实例化暗恋模型
        $love = M('Love');
        $rules = array(
            array('secret','0,20','姓名长度不能超过20个字符',0,'length')
        );
        if(!$love->validate($rules)->create($data)){
            $result = $love->getError();
            return $result;
        }
        $map['user_id'] = $data['user_id'];
        $rows = $love->field('user_id')
                     ->where($map)
                     ->find();
        if(empty($rows)){
            //记录为空则增加记录
            $result = $love->add();
        }
        else{
            //更新原有记录
            $result = $love->where($map)
                           ->save($data);
        }
        return $result;
    }
}
