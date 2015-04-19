 /**************设置侧边栏的头像*********************/
   
    var setasideImg = function(headimg,nickname) {
        var $headpic = $('.headpic');      
        var image = '<img src="' + headimg + '" class="face-radius" />';
        var person= '<span class="person-name">' + nickname + '</span>';
        $headpic.append(image + person);   
        $('.user-img').append(image);

        // // 侧边栏用户名的位置
        // var leftMenuWidth = $headpic.width();
        // console.log(leftMenuWidth);
        // var $personName = $('span.person-name');
        // var personName = $personName.width();
        // var personNameLeft = (leftMenuWidth-personName)/2;
        // $personName.css('left', personNameLeft);

    };

    var getNickimage = function() {
            
            if(!sessionStorage.headimg) {
                var url = '/getNickimage';
                $.get(url,function(result){
                    if(result.result === 'ERROR') {
                      return;
                    }
                    var data = result['data'];
                    sessionStorage.headimg = data.head_url;
                    sessionStorage.nickname = data.nickname;
                    setasideImg(data.head_url,data.nickname);
                });
                
            }
            else{
                 setasideImg(sessionStorage.headimg,sessionStorage.nickname);
            }
            
        };
     //设置侧边栏头像
   getNickimage();


  //侧边栏点击切换到首页
  $('.canvas-home').click(function() {
      //TODO 部署时删去/wishwall
      window.location.href = '/homepage';

    });

  //点击切换到个人中心
  $('.canvas-personal').click(function() {
      //TODO 部署时删去/wishwall
      window.location.href = '/usercenter';
  });




  //点击切换到关于我们
  $('.canvas-aboutUs').click(function() {
      window.location.href = '/about';
  });







// document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
// 		win.shareData = {
// 				"timeLineLink": "http://gdutgirl.sinaapp.com/",
// 				"sendFriendLink": "http://gdutgirl.sinaapp.com/",
// 				"tTitle": "广工女生节许愿墙",
// 				"tContent": "给你第二场流星雨",
// 				"fTitle": "广工女生节许愿墙",
// 				"fContent": "给你第二场流星雨"
// 			};
// 			// 发送给好友
// 			WeixinJSBridge.on('menu:share:appmessage', function (argv) {
// 				WeixinJSBridge.invoke('sendAppMessage', {
// 					"img_url": "http://gdutgirl.sinaapp.com/Public/images/logo.png",
// 					"img_width": "300",
// 					"img_height": "300",
// 					"link": win.shareData.sendFriendLink,
// 					"desc": win.shareData.fContent,
// 					"title": win.shareData.fTitle
// 				}, function (res) {
// 					_report('send_msg', res.err_msg);
// 				})
// 			});
// 			// 分享到朋友圈
// 			WeixinJSBridge.on('menu:share:timeline', function (argv) {
// 				WeixinJSBridge.invoke('shareTimeline', {
// 					"img_url": "http://gdutgirl.sinaapp.com/Public/images/logo.png",
// 					"img_width": "300",
// 					"img_height": "300",
// 					"link": win.shareData.timeLineLink,
// 					"desc": win.shareData.tContent,
// 					"title": win.shareData.tTitle
// 				}, function (res) {
// 					_report('timeline', res.err_msg);
// 				});
// 			});
			

// 		}, false)		}, false)

 // $('.off-canvas-list>li').click(function() {
 //    $(this).addClass('canvas-current').siblings().removeClass('canvas-current');
 //  });
  // doc = document;
  // var leftMenuWidth = doc.querySelector('.headpic').offsetWidth;
  // var personName = doc.querySelector('.person-name').offsetWidth;
  // var personNameLeft = (leftMenuWidth-personName)/2;
  // $('.person-name').css('left', personNameLeft);