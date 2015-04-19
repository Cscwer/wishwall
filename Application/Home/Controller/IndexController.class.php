<?php
namespace Home\Controller;
use Think\Controller;
class IndexController extends InitController {

    public function index() {
        $this->display();
    }


    /**
     *获得愿望列表
     *
     */
    //TODO
  public function wishes() {
        $page = I('get.page');
        $page_size = C('PAGE_SIZE'); //分页大小常量

        $Wish   = M('Wishes');
        $wishes = $Wish->join('visitors ON visitors.visitor_id = wishes.female_id')
            						->join('users ON users.user_id = wishes.female_id')
                       ->where('status=0')
                       ->order('time desc')
                       ->page($page, $page_size)
                       ->field('wish_id,wish_text,time,head_url,nickname,photo_url,campus')
                       ->select();
        $Return['data']    = $wishes;
        $Return['message'] = '';
      	$Return['wishsum'] = $Wish->where('status = 0')->count('wish_id');
        $Return['sex'] = session('sex');
        $Return['result']  = 'SUCCESS';
        $this->ajaxReturn($Return);
    }

    /**
     *愿望筛选
     */
    public function screen() {
         if(IS_AJAX && IS_POST) {
            $campusdata = I('post.campus');
            $wishtypedata = I('post.wish_type');
            //构建查询语句
            $map['campus'] = array('in',$campusdata);
            $map['wish_type'] = array('in',$wishtypedata);
            $map['status'] = C('STATUS.NOPROMISE');
            $wish = M('Wishes');
            $wishes = $wish->join('visitors ON visitors.visitor_id = wishes.female_id')
                           ->join('users ON users.user_id = wishes.female_id')
                           ->where($map)
                           ->field('wish_id,wish_text,time,head_url,nickname,campus')
                           ->order('time desc')
                           ->select();
            $Return['data'] = $wishes;
            $Return['message'] = $campusdata;
            $Return['result'] = 'SUCCESS';
            $Return['sex'] = session('sex');
        }
        else {
            $Return['message'] = '提交错误';
            $Return['result'] = 'ERROR';
        }
        $this->ajaxReturn($Return);
    }

    /**
     *全局搜索
     */
    public function search() {
        if(IS_AJAX && IS_POST) {
            $text = I('post.text');
            $map['nickname|wish_text'] = array('LIKE','%'.$text.'%');
            $map['status'] = C('STATUS.NOPROMISE');
            $wish = M('Wishes');
            $wishes = $wish->join('visitors ON visitors.visitor_id = wishes.female_id')
                						->join('users ON users.user_id = wishes.female_id')
                           ->where($map)
                           ->order('time desc')
                           ->field('wish_id,wish_text,time,head_url,nickname,photo_url,campus')
                           ->select();
            $Return['data'] = $wishes;
            $Return['message'] = '';
            $Return['sex'] = session('sex');
            $Return['result'] = 'SUCCESS';
        }
        else {
            //$Return['message'] = '提交错误';
            //$Return['result'] = 'ERROR';
        }
        $this->ajaxReturn($Return);
    }
}
