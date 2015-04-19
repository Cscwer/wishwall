<?php
/**
 *消息类
 *@author:waterbear
 */

namespace Common\Controller;
use Think\Controller;
class Message extends Controller{

    /**
     *发送留言到消息箱
     *
     */
    public function sendMessage($wishid,$text,$userid,$acceptid = 0) {
        $acceptid = $acceptid?$acceptid:$this->isCanSend($wishid,$userid);
        if(!$acceptid) {
            return false;
        }
        $data = array(
            'user_id' => $acceptid,
            'wish_id' => $wishid,
            'info_content' => $text,
            'info_type' => 1,
            'status' => 0,
            'sendtime' => date('Y-m-d H:i:s'),
            'from_id' => $userid
        );
        $box = D('Informationbox');
        if(!$box->create($data)) {
            return false;
        }
        else {
            $result = $box->add();
        }
        return $result;
    }

    /**
     *检测能否发送留言
     *@return false:不能,可以则返回接收方的用户id
     */
    private function isCanSend($wishid,$userid) {
        $wish = M('Wishes');
        $wishid = (int)$wishid;
        //只有已实现的愿望才能留言
        $status = C('STATUS.FINISHED');
        $result = $wish->where('wish_id = %d and status = %d',$wishid,$status)
                       ->field('female_id,male_id')
                       ->find();
        if(empty($result)) {
            return false;
        }
        else {

            if($result['female_id'] == $userid) {
                return $result['male_id'];
            }
            else
            if($result['male_id'] == $userid) {
                    return $result['female_id'];
            }
            else {
                    return false;
            }
        }
    }

    /**
     *发送邮件
     *
     */
    public function sendMail($userid,$title,$text,$email = 0) {

        //发件方的信息
        $loc_host = "SAE";
        $smtp_acc = "gdutgirl@sina.com";
        $smtp_pass = "gdutcscw1024";
        $smtp_host = "smtp.sina.com";
        $from = "gdutgirl@sina.com";

        //收件方信息
        if($email){
            $to = $email;
        }
        else{
             $user = M('Users');
            $res = $user->where("user_id = %d",$userid)
                    ->field('email')
                    ->find();
            $to = $res['email'];
        }
        if(empty($to)) {
            return;
        }
        $subject = $title;
        $body = $text;
        $headers = "Content-Type: text/plain; charset=\"utf-8\"\r\nContent-Transfer-Encoding: base64";
        $lb="\r\n";             //linebreak
        $hdr = explode($lb,$headers);
        if($body) {$bdy = preg_replace("/^\./","..",explode($lb,$body));}

            $smtp = array(
                  array("EHLO ".$loc_host.$lb,"220,250","HELO error: "),
                  array("AUTH LOGIN".$lb,"334","AUTH error:"),
                  array(base64_encode($smtp_acc).$lb,"334","AUTHENTIFICATION error : "),
                  array(base64_encode($smtp_pass).$lb,"235","AUTHENTIFICATION error : ")
            );
            $smtp[] = array("MAIL FROM: <".$from.">".$lb,"250","MAIL FROM error: ");
            $smtp[] = array("RCPT TO: <".$to.">".$lb,"250","RCPT TO error: ");
            $smtp[] = array("DATA".$lb,"354","DATA error: ");
            $smtp[] = array("From: ".$from.$lb,"","");
            $smtp[] = array("To: ".$to.$lb,"","");
            $smtp[] = array("Subject: ".$subject.$lb,"","");
            foreach($hdr as $h) {$smtp[] = array($h.$lb,"","");}
            $smtp[] = array($lb,"","");
            if($bdy) {foreach($bdy as $b) {$smtp[] = array(base64_encode($b.$lb).$lb,"","");}}
            $smtp[] = array(".".$lb,"250","DATA(end)error: ");
            $smtp[] = array("QUIT".$lb,"221","QUIT error: ");
            $fp = @fsockopen($smtp_host, 25);
            if (!$fp) echo "Error: Cannot conect to ".$smtp_host."";
            while($result = @fgets($fp, 1024)){if(substr($result,3,1) == " ") { break; }}

            $result_str="";
            foreach($smtp as $req){
                  @fputs($fp, $req[0]);
                  if($req[1]){
                        while($result = @fgets($fp, 1024)){
                            if(substr($result,3,1) == " ") { break; }
                        };
                        if (!strstr($req[1],substr($result,0,3))){
                            $result_str.=$req[2].$result."";
                        }
                  }
            }
            @fclose($fp);
            return $result_str;

    }
}
