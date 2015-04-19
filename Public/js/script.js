$(function(){
  doc = document;

//添加最小高度
  // var oHeight = window.screen.height;
  var oHeight = doc.documentElement.clientHeight;
  // var cWidth  = doc.documentElement.clientWidth;
  var cWidth  = doc.querySelector('.main-section').offsetWidth;
  //获得页面可见高度
  $('.main-section').css('min-height',oHeight);
    
    //侧边栏用户名的位置 
   // var leftMenuWidth = doc.querySelector('.headpic').offsetWidth;
   //  var personName = doc.querySelector('.person-name').offsetWidth;
   //  var personNameLeft = (leftMenuWidth-personName)/2;
   //  $('.person-name').css('left', personNameLeft);

    //侧边栏导航颜色
    // $('.off-canvas-list>li').click(function() {
    //   $(this).addClass('link-current').siblings().removeClass('link-current');
    // });
//确定删除框的位置
 function modalTop() {
    var topval=(oHeight-120)/2;
    var leftval=(cWidth-190)/2;
    var imgleft=(cWidth-140)/2;
    var errorleft=(cWidth-275)/2;
    var btnleft = (cWidth-104)/2;
    var selectleft = (cWidth-81)/2;
    $('.center_button').css('margin-left',btnleft);
    $('#myModal').css("top",topval);
    $('#myModal').css('left',leftval);
    $('.user-img').css('left',imgleft);
    $('#myModal-error').css('left',errorleft);
    $('.select-wish-type').css('left',selectleft);
  }
  modalTop();

  //验证填写心愿字数
  function checkText() {
    var txt = doc.getElementById('writewish').value;
    var p = doc.getElementById('checkinput');
    var per = doc.getElementById('noteText');
    var nextBtn = doc.getElementById('nextbtn');
    var textNum = 100-txt.length;
    p.innerHTML = '您还可以输入'+(100-txt.length)+'个字';
    //判断超出多少字数
    if(textNum<=0){
      // p.style.display = 'none';
      p.innerHTML = '超出'+Math.abs(textNum)+'个字';
      //若字数超出，则按钮变灰，无法点击下一步
      nextBtn.style.background = 'gray';
      nextBtn.href = 'javascript:void(0)';
    }
    else {
      p.innerHTML = '您还可以输入'+(100-txt.length)+'个字';
      nextBtn.style.background = '#7D5B3F';
      nextBtn.href = '#';
    }
  }
  $('#writewish').keyup(function(){checkText();});
  //tab切换
  tabchange('footer-btn>li', 'tab-content>div', 'current');
  tabchange('center_button>li', 'msg-content>div', 'msg-current');

  // //页面切换
  // showandhide('bt1','page2');
  // showandhide('back','page1');
  // showandhide('bt2','page3');
  test();


    // showAndHide();

  //评星
  var aLi = $('#star li');
  var oUl = $("#star ul")[0];
  var i = iScore = iStar = 0;

  for (i = 1; i <= aLi.length; i++) {
    aLi[i - 1].index = i;
    aLi[i - 1].onmouseover = function () {
      fnPoint(this.index);
    };
    aLi[i - 1].onmouseout = function () {
      fnPoint();
    };
    aLi[i - 1].onclick = function () {
      iStar = this.index;
    }
  }

     function fnPoint(iArg) {
        iScore = iArg || iStar;
        for (i = 0; i < aLi.length; i++) aLi[i].className = i < iScore ? "on" : "";
            $('#star').attr('value',iScore);
      }
    
       //信息提醒,点击切换
  function msgAlert() {
    $('.message-icon').click(function(){
      $('.page1').show().siblings().hide();
      $('.tab-content>div:last-child').css("display","block").siblings().css("display","none");
      $('.msg-content>div:last-child').css("display","block").siblings().css("display","none");
      $('.footer-btn>li:last-child').addClass('current').siblings().removeClass('current');
      $('.center_button>li:last-child').addClass('msg-current').siblings().removeClass('msg-current');
      $('.attention').css("display","none");
      $('.footer-btn').css("position","fixed");
      $('.move-right .exit-off-canvas').css("background","none");
      $('.off-canvas-wrap').removeClass('move-right');
    });
  }
  msgAlert();
    
});


 var test = function() {
       var btn = new Array( "bt1", "next-step", "back", "last-step", "bt2", 
                            "next-step2", "right-small", "last-step2", "keep-wish");
    var page = new Array( "page2", "sub-page2", "page1", "sub-page1", "page3", 
                          "sub-page3", "sub-page1", "sub-page2", "sub-page1");
        for(var i = 0;i < btn.length; i++) {
          showandhide(btn[i],page[i]);
        }
  };
    //个人中心关于愿望操作的全局变量
    var wish = {
        wishid:''
    };
    //tab切换
    function tabchange(tab, content, className) {
        var tabval = $('.'+tab);
        var contentval = $('.'+content);
        var index = 0;
        tabval.click(function() {
          index = tabval.index(this);
          $(this).addClass(className).siblings().removeClass(className);
          contentval.filter("div").css("display","none");
          contentval.eq(index).css("display","block");
        });
    };

       //页面切换
    function showandhide(btn,page) {
        $('.'+btn).click(function(){
          $('.'+page).show().siblings().hide();

          //获取按钮的id
          var id = $(this).attr('id');
          //如果是按钮1,跳转至确认愿望完成界面
          if(id && btn === 'bt1') {
            getInfo(id);
          }

          //如果是按钮2,跳转至留言界面
          if(id && btn === 'bt2') {
            getmessagepanel(id);
          }
        })
    };

    // //页面切换
    // function showAndHide() {
    //     var btn = new Array(".bt1", ".next-step", ".back", ".last-step", ".bt2", ".next-step2", ".right-small",".last-step2");
    //     var page = new Array(".page2", ".sub-page2", ".page1", ".sub-page1", ".page3", ".sub-page3", ".page4",".sub-page2");
    //     $.each(btn, function(index, val) {
    //        $.each(page, function(index2, val2) {
    //           $(val).click(function(){
    //             if(index==index2) {
    //               $(val2).show().siblings().hide();
    //             }
    //           })
    //        });
    //     });
    // }


 //可编辑函数
    var editNoacceptpage = function() {        
          //定义点击编辑按钮函数
          $('.edit').on('click',function(){
                $whatwish = $(this).closest('div.date').prev().find('p.whatwish');
                var wishTxt = $whatwish.text();
                console.log(wishTxt);
                // $whatwish.attr('contenteditable','true').css('background','white').focus();
                $whatwish.css('display','none').next().css('display','block').find('textarea').val(wishTxt).focus();
                //自动聚焦输入框
                $(this).css('display','none');
                $(this).next().css('display','inline');
          });

          //点击完成按钮
          $('.finish').on('click',function(){
            $whatwish = $(this).closest('div.date').prev().find('p.whatwish');
              $(this).css('display','none');
              $(this).prev().css('display','inline');
              var wishContent = $whatwish.next().find('textarea').val();
              // $(this).closest('div.date').prev()
              //                            .find('p.whatwish')
              //                            .css('background','none')
              //                            .attr('contenteditable','false');
              $whatwish.css('display','inline').text(wishContent).next().css('display','none');
                      //发生送修改的愿望内容到后台
                var id = $(this).next().attr('value');
                var wishtext = $(this).parent()
                                      .prev('div.wish-content')
                                      .children()
                                      .filter('.whatwish')
                                      .text();
                sendEditWish(id,wishtext);

          });

          
    };

    var editInfopage = function() {
        //点击资料修改按钮
          $('.changeInfo').on('click',function(){
                $(this).css('display','none');
                $(this).next().css('display','inline-block');
                $whatwish = $(this).parent().next().find('p.whatwish');
                $whatwish_select=$(this).parent().next().find('select');
                // $whatwish.attr('contenteditable','true').css('background','white').focus();
                $whatwish_select.css('display','inline-block').prev().css('display','none');
                $whatwish.attr('contenteditable','true').addClass('edit-whatwish').focus();
              
          });

          //点击资料完成按钮
          $('.finishInfo').on('click',function(){
                $(this).css('display','none');
                $(this).prev().css('display','inline-block');
                $whatwish_select=$(this).parent().next().find('select');
                $whatwish_select.css('display','none').prev().css('display','inline-block');
                var whatselect_1 = $whatwish_select.eq(0).val();
                var whatselect_2 = $whatwish_select.eq(1).val();
                $whatwish_select.eq(0).prev().text(whatselect_1);
                $whatwish_select.eq(1).prev().text(whatselect_2);
                $(this).parent().next().find('p.whatwish').attr('contenteditable','false').removeClass('edit-whatwish');
                //发送修改的资料到后台
                if(!$(this).hasClass('mysecret')) {
                    sendEditInfo();
                }
                if($(this).hasClass('mysecret')) {
                    sendEditSecret($('.secret').text());
                }
          });
    };


    /***********************点击组建留言面板*************************/
    var getmessagepanel = function(id) {
        wish.wishid = id;
        var url = global.messagepanel + id;
        console.log(url);
        getjson('GET',url,null,setReplypanel,error);
    };


/******************错误提示框**************/

var promptSuccess = function(message) {
    var $pop = $('.pop-layer-wp-2');
    //$('body').css('position','relative');
    $pop.css('display','block');
    var $icsn = $('#ic-sn');
    $icsn.text('');
    $icsn.append('<i class="icon-succeed"></i>' + message);
    setTimeout(function(){
       $pop.css('display','none');
    },1200);
};

var promptError = function(message) {
   var $pop =  $('.pop-layer-wp-3');
   $pop.css({"display":"block","top":"30%"});
    var $icfailed = $('#ic-failed');
   $icfailed.text('');
    $icfailed.append(' <i class="icon-failed"></i>' + message);
    setTimeout(function(){
       $pop.css('display','none');
    },1200);
 };

//请稍后提示框
var promptWait = function(isShow,tops,waitTime) {
	  var $pop = $('.pop-layer');
    var $popwp = $('.pop-layer-wp');
    if(isShow) {
        $pop.css({"display":"inline-block","top":"30%"});
        $popwp.css({"top":tops});
    }
    else {
        $pop.css({"display":"none","top":"30%"});
    }
	  		
    if(waitTime) {
        setTimeout(function() {
          $pop.css('display','none');
        },waitTime);
    }
    
};












