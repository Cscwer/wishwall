// @Look-around手机版 V1.0
//***********************
//相关注释等待完善！
//**********************
// @四周看看 V1.0
// @Author : Chuck
// @作者	：成博
// @Bace on LATERAL's about team
// @参考 LATERAL 的关于团队 制作 ，解决 jquery hover 与 click 冲突方面完全引用该代码。
// @计算图形变化则为独立算法
// @div请以 ul>li>div.Look-around 的结构存在
// @V2.0 将会更新绑定按键的功能
$(document).ready(function(){
  var One = $(".Look-around");
  One_height = One.height();
  One_width = One.width();


  changeOne = function  (someone,direction)
  // 改变某个人的头像
  	{
  		tempstr = -(direction*One_height)+"px "+(-someone.parent("li").index())*One_height+"px"		
      //如果公式过长，会触发不知名错误，所以要采用字符串中转处理
  		someone.css("background-position",tempstr);
  	}
  changeAll = function (direction)
  // 改变每个人的头像
      {

          $('.Look-around').each(function() {
              changeOne($(this), direction);
              //遍历每一个人
          });
          return false
      }

  changeAll(8);

  One.click(function(){
  //   //点击时，其他人低下头，做沮丧壮，被点击人开心状
  	changeAll(6);
  	changeOne($(this),10);
  });
});


