<?php
/**
 *愿望模型操作wishes这张表
 *@author:waterbear
 */
namespace Home\Model;
use Think\Model;

class WishesModel extends Model {
    /**
     *设置自动验证规则
     */
    protected $_validate = array(
        array('wish_type',array('1','2'),'愿望类型错误',0,'in'),
        array('wish_text','2,140','愿望长度不能为空,或者超过140字',1,'length')
    );

    /**
     *开启批量验证功能
     */
    protected $patchValidate = true;

    /**
     *根据参数返回不同的愿望
     *status=0,返回未被接受的愿望
     *status=1,返回正在进行的愿望
     *status=2,返回已经实现的愿望
     */
    public function showList($map) {
        $status = $map['status'];
        //返回未实现的愿望
        if(!$status && $map['female_id']) {
            $data = $this->where($map)
                         ->field('wish_id,wish_text,time,wish_type')
                         ->order('time desc')
                         ->select();
        }
        else {
            $returnField = array(
                                'wish_id',
                                'wish_text',
                                'wish_type',
                                'time',
                                'finish_time',
                                'head_url',
                				'name',
                                'campus',
                				'college',
                                'tel_long',
                                'tel_short',
                                'photo_url' // TODO 部署时删去
                            );
            //返回男生正在实现和已经实现的愿望
            if($map['male_id']) {
                //head_url为女生头像
                $data = $this->join('visitors ON visitors.visitor_id = wishes.female_id')
                             ->join('users ON users.user_id = wishes.female_id')
                             ->order('time desc')
                             ->field($returnField)
                             ->where($map)
                             ->select();

            }
            else { //返回女生正在实现和已经实现的愿望
                //head_url为男生头像
                $data = $this->join('visitors ON visitors.visitor_id = wishes.male_id')
                             ->join('users ON users.user_id = wishes.male_id')
                             ->order('time desc')
                             ->field($returnField)
                             ->where($map)
                             ->select();

            }

        }
        return $data;
    }

    /**
     *增加和更新愿望
     *@return 增加成功返回wish_id;true:更新成功,false:更新失败
     *测试方法
     */
    //TODO
    public function saveWish($wish) {
        if(!$this->create($wish)) {
            return $this->getError();
        }
        $wishid = $wish['wish_id'];
        //wish_id为空则存储愿望
        if(empty($wishid)) {
            $wish['time'] = date('Y-m-d H:i:s');
            $result = $this->data($wish)
                           ->add();
        }
        else {
            if(empty($wish['finish_time'])) {
                $wish['time'] = date('Y-m-d H:i:s');
            }
            $wishid = (int)$wishid;
            $result = $this->where('wish_id=%d and female_id=%d',$wishid,$wish['female_id'])
                           ->save($wish);
        }
        return $result;
    }

    /**
    *确认愿望完成
    *
    */
    public function confirmWish($wishdata) {
        $data['status'] = C('STATUS.FINISHED');
        $data['finish_time'] = date('Y-m-d H:i:s');
        $result = $this->where('wish_id= %d and female_id = %d',$wishdata['wish_id'],$wishdata['female_id'])
                       ->save($data);
        return $result;
    }
     public function delete($wishdata) {
        $data['status'] = $wishdata['status'];
        $result = $this->where('wish_id = %d and female_id =%d',$wishdata['wish_id'],$wishdata['female_id'])
            ->save($data);
        return $result;
    }
}
