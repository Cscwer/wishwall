/**
 *负责加载和组装个人中心的数据
 *@author:waterbear
 */


    //	 全局变量
    var global = {
            noaccept: '/myWish/0',//获得未实现愿望 TODO 部署时删去'
    		infourl: '/myInfo', //获得个人资料url TODO 部署时删去''
            message: '/myMessage', //获得消息url TODO 部署时删去''
            wishing: '/myWish/1', //实现ing url   TODO 部署时删去''
            wished:  '/myWish/2',  //已实现 TODO 部署时删去''
            confirminfo: '/confirminfo/', //女生确认愿望时获取信息
            confirm: '/confirm/', //确认愿望
            messagepanel: '/finishedInfo/',
            sendComment: '/myComment/',//发送留言
            wishmessage: '/myWishMessage/', //获取留言
            deleteWish: '/deleteWish/', //删除愿望
            editWish: '/editWish', //编辑愿望
            editInfo: '/edit', //修改个人资料
            editSecret: '/editSecret/' //修改暗恋人信息

    };

    $(document).ready(function() {
        //获取个人资料
    	getjson('GET',global.infourl,null,setInSe,error);

        //获取消息
        getjson('GET',global.message,null,setMessage,error);

        //获得实现ing列表
        getjson('GET',global.wishing,null,setWishing,error);

        //获得已实现列表
        getjson('GET',global.wished,null,setWishFinished,error);

        //获得未实现愿望
        getjson('GET',global.noaccept,null,setNoaccept,error);
    });

    /*********************个人中心未实现*********************/
    //组装未完成愿望
    var setNoaccept = function(result) {
        var data = result['data'];
        if(!data) {
            var string = '<div class="no-wish">'
                          + '<h2>您还没有许愿...</h2>'
                          + '</div>';
             $('#noaccept').append(string);
             return;
        }
        var str = '';
        $.each(data,function(index,content) {
            var style = content.wish_type == 1? '实物型':'耗时型';
            var string = '<li class="unrealized-list">';
                string += '<div class="wish-content">'
                          + '<span class="wish-style">'
                          + style
                          + '</span><p class="whatwish">'
                          + content.wish_text
                          + '</p><div class="wish-edit-input">'
                          +'<textarea name="" id="" cols="30" rows="5" class="edit-wish-change"></textarea>'
                           +'</div></div>';
                string += '<div class="date" id= "' + content.wish_id + '">'
                          + '<span>' + content.time.substr(0,10) + '</span>'
                          + '<a href="#" class="edit"><span class="icon-pen"></span><span>编辑</span></a>'
                          + '<a href="#" class="finish"><span class="icon-pen"></span><span>完成</span></a>'
                          + '<a href="#" class="delete-wish" data-reveal-id="myModal" value="'
                          + content.wish_id
                          + '"><span class="icon-trash"></span><span>删除</span></a>'
                          + '</div></li>';
            str += string;

        });
        $('#noaccept').append(str);
        //绑定删除函数
        $('.delete-wish').click(function() {
            wish.wishid = $(this).attr('value');
        });
        //确认删除按钮
        $('a.delete').click(function() {
            deleteWish();
        });
        editNoacceptpage();
    };
    /*********************个人中心实现ing*************************/

    //组装实现ing
    var setWishing = function(result) {
        var data = result['data'];
        var sex = result['sex'];
         if(!data) {
             //TODO 增加实现ing为空时的处理
             var string = '<div class="no-wish">'
                          + '<h2>您没有正在进行中的愿望...</h2>'
                          + '</div>';
             $('#wishing').append(string);
             return;
         }
        var str = '';
        var image = '<ul>';
        $.each(data,function(index,content) {
            var Img = content.head_url || content.photo_url;
            var string = '<div class="ing"><div class="ing_">'
                         + '<ul><li><div class="ing-img">'
                          + '<img src="';
                //部署时photo_url 换成head_url TODO
                string += Img + '"' + 'alt=""></div></li>';
                image += '<li><img src="'
                          +Img + '"alt="" class="visitor-img"></li>';

                string += '<li><div class="ing-inner">'
                          + content.name + '</br>'
                          + content.campus + '校区' + '--'
                          + content.college + '</br>'
                          + content.tel_long + '/'
                          + content.tel_short
                          + '</div></li></ul>';
                //如果是女生则添加确认完成按钮
                if(sex === '2') {
                    string += '<button class="small_button1 bt1" id="'
                               +content.wish_id +'">确认完成</button>';
                }
                string += '</div><div class="ing-footer">';
                string += '<p>' + content.wish_text + '</p>';
                string += '</div></div>';
                str += string;
        });
        image += '</ul>';
        $('#wishing').append(str);
        $('.visitors-ing').append(image);
			//修正图片显示问题
        oVistors('.visitors-ing');
        //此处需要再次调用页面切换函数,否则无法切换
        showandhide('bt1','page2');
    };

    /********个人中心已实现愿望*************/
    //组装完成愿望
    var setWishFinished = function(result) {
        var data = result['data'];
        if(!data) {
            //TODO 增加已实现愿望为空时的处理
            var string = '<div class="no-wish">'
                          + '<h2>您目前还没有已实现的愿望...</h2>'
                          + '</div>';
             $('#wished').append(string);
            return;
        }
        var str = '';
        var image = '<ul>';
        
        $.each(data,function(index,content) {
             var Img = content.head_url || content.photo_url;
            var string = '<div class="ing"><div class="ing_">'
                         + '<ul><li><div class="ing-img">'
                          + '<img src="';
                //部署时photo_url 换成head_url TODO
                string += Img + '"' + 'alt=""></div></li>';
                image += '<li><img src="'
                          + Img + '"alt="" class="visitor-img"></li>';

                string += '<li><div class="ing-inner">'
                          + content.name + '</br>'
                          + content.campus + '校区' + '--'
                          + content.college + '</br>'
                          + content.tel_long + '/'
                          + content.tel_short
                          + '</div></li></ul>';
                string += '<button class="small_button1 bt2" id="'
                          +content.wish_id +'">留言</button>';
                string += '</div><div class="ing-footer">';
                string += '<p>' + content.wish_text + '</p>';
                string += '</div></div>';
                str += string;
        });
        image += '</ul>';
        $('#wished').append(str);
        $('.visitors-finished').append(image);
		//修正图片显示问题
        oVistors('.visitors-finished');
        //此处需要再次调用页面切换函数,否则无法切换
        showandhide('bt2','page3');
    };

 //添加最小访客列表宽度
    var oVistors = function(element) {
      var $oWidth = $(element + '>ul>li').length;
      var $oWid = $oWidth*4;
      $(element).css('width',$oWid+'rem');
    };

    /******************个人中心资料***********************/
    //组装基本资料和暗恋人
    var setInSe = function(result) {
        var data = result['data'];
        var info = data['info'];
        var secret = data['secret'];
        if(!secret) {
            secret = '';
        }
        var $information = $('#info');
          editInfopage();
        if(!info){
            return;
        }
            $('p.name').text(info.name);
            $('p.campus').text(info.campus);
            $('p.college').text(info.college);
            $('p.tel-long').text(info.tel_long);
            $('p.tel-short').text(info.tel_short);
            $('p.secret').text(secret.secret);
            $('p.email').text(info.email);
      
    };

    //加载错误的提示函数
    var error = function(xhr,textStatus,errorThrown) {
        console.log('数据加载出错');
        console.log(textStatus);
        console.log(errorThrown);
        console.log(xhr.readyState);
    };

    /******************个人中心消息********************/
    //组装消息列表
    var setMessage = function(result) {
        var data = result['data'];
        if(!data.length) {
            var string = '<div class="no-wish">'
                          + '<h2>暂没有消息...</h2>'
                          + '</div>';
             $('.wish-inner').append(string);
            return;
        }
        var str = '';
        $.each(data,function(index,content){
            var string = '<div class="row row_margin"><div class="cloumns large-12 small-12">'
                         +'<div class="wish-content">';
                string += content['time'];
            var information = content['information'];
            $.each(information,function(i,con) {
                if(con['info_content']){
                   string += '<a href="" class="wish">' + con['info_content'] + '</a>';
                }
                if(con['name']) {
                   string += '<a href="" class="wish">' + con['name'] + '回复了您</a>';
                }
            });
            string += '</div></div>';
            str += string;
        });
        $('.wish-inner').append(str);
    };

    /********************个人中心留言面板***************************/
    var setReplypanel = function(result) {
        console.log(result);
        if(result.result === 'ERROR') {
            return;
        }
        var data = result['data'];
        var string = '';
        var img = data.head_url || data.photo_url;
            string += '<div class="columns large-12 small-12">'
                      + '<p>' + data.wish_text + '</p>'
                      + '</div>';
            string += '<div class="row"><div class="columns large-3 small-3">'
                      + '<img src="' + img + '"alt="">'
                      + '</div>'
                      + '<div class="columns large-9 small-9"><ul>'
                      + '<li>' + data.name + '</li>'
                      + '<li>' + data.campus + '--' + data.college + '</li>'
                      + '<li>' + data.tel_long + '/' + data.tel_short + '</li></ul>'
                      + '</div></div></div>';
        //给输入框赋一个id值
        var $input = $('input.reply');
            $input.attr('id',wish.wishid);
            //先解除原有绑定的事件
            $input.unbind('click');
            $input.click(function() {
                //发送留言
                sendWishComment($('input.text').val(),$input.attr('id'));
                return false;
            });
        var $reply = $('.reply-message');
            $reply.children().first().remove();
            $reply.children('.row').remove();
            $reply.append(string);

        //组装星星
        if(data.star) {
            var star = parseInt(data.star);
            var str = '<ul>';
            for(var i = 0; i < star; i++) {
                str += '<li class="small-star">'+ i+1 +'</li>';
            }
            str += '</ul>';
            var $star = $('.star');
            $star.children().remove();
            $star.append(str);
        }

        //获取愿望的评论
        var send = {};
            send.wishid = wish.wishid;
        getjson('POST',global.wishmessage,send,setComment,error);

    };

    /*************************完成的愿望留言***************************/
    //发送留言
    var sendWishComment = function(comment,id) {
        var data = {};
           if(!comment){
            return;
        }
        data.wish_id = htmlfilter(id);
        comment = htmlfilter(comment);
        data.text = comment;
     
        getjson('POST',global.sendComment,data,commentsn,error);

        //插入当前发送的留言
        var string = commentfactory(comment,true);
        $('.reply-content').append(string);
        $('input.text').val('');
    };

    //留言后的回调函数
    var commentsn = function(result) {
        //TODO
        console.log(1);
        console.log(result);
    };

    //组建留言
    var setComment = function(result) {
        if(result.result === 'ERROR') {
            return;
        }
        var wishmessage = result['data'].wishMessage;
        var id = result['data'].id;
        var str = '';
        var string = '';
        $.each(wishmessage,function(index,content) {
            if(content.id !== '0') {
                if(content.id === id) {
                    string = commentfactory(content.info_content,true);
                }
                else
                {
                    string = commentfactory(content.info_content,false);
                }
                str += string;
            }

        });
        var $replycontent = $('.reply-content')
        $replycontent.children().remove();
        $replycontent.append(str);
    };

    //留言工厂

    var commentfactory = function(content,rside) {

       var string = '';
        //true是在页面右边
        if(rside) {
            string = '<div class="girl-reply">'
                     + '<p>' + content +'</p>'
                     + '<div class="arrow-right"></div>'
                     + '</div>';
        }
        else{
            string = '<div class="boy-reply">'
                       + '<p>' + content +'</p>'
                       + ' <div class="arrow-right"></div>'
                       + '</div>';
        }

        return string;

    };

    /*************************女生个人中心删除愿望****************************/
    //删除愿望
    var deleteWish = function() {
        var url = global.deleteWish;
        var data = {};
            data.wish_id = wish.wishid;
        getjson('POST',url,data,deleteWishsn,error);

    };
    //删除愿望后的回调函数
    var deleteWishsn = function(result) {
        //TODO
        if(result.result === 'ERROR') {
            promptError('愿望删除失败');
            return;
        }

        //删除愿望
        var $wish = $('#' + wish.wishid);
            $wish.prev().remove();
            $wish.remove();
            $('.close-reveal-modal').trigger('click');
        	promptSuccess('愿望删除成功');
    };

    /*************************女生个人编辑愿望********************************/
    //发送编辑愿望信息
    var sendEditWish = function(id,wishtext) {
        var data = {};
            data.wish_id = htmlfilter(id);
            data.wish_text = htmlfilter(wishtext);
        getjson('POST',global.editWish,data,editWishsn,error);
        //console.log(data);
    };
    //愿望修改成功后的回调函数
    var editWishsn = function(result) {
        //TODO
        console.log(result);
         if(result.result === "ERROR") {
            promptError('愿望修改失败');
        }
        else{
            promptSuccess('愿望修改成功');
        }
    	
    };

    /****************修改资料********************/
    //发送修改的资料到后台
    var sendEditInfo = function() {
        var data = {};
            data.name = $('p.name').text();
            data.campus = $('p.campus').text();
            data.college = $('p.college').text();
            data.tel_short = $('p.tel-short').text();
            data.tel_long = $('p.tel-long').text();
            data.email = $('p.email').text();
            data = htmlfilter(data);
        getjson('POST',global.editInfo,data,editInfosn,error);
    };
    //修改资料后的回调函数
    var editInfosn = function(result) {
        //TODO
        console.log(result);
        if(result.result === "ERROR") {
            promptError('修改失败,请注意输入信息');
        }
        else{
            promptSuccess('修改成功');
        }
    };

    /********************修改暗恋人***********************/
    //发送暗恋人资料
    var sendEditSecret = function(content) {
        var data = {};
            data.secret = htmlfilter(content);
            getjson('POST',global.editSecret,data,editSecretsn,error);
        //console.log(data);

    };
    //修改暗恋人后的回调函数
    var editSecretsn = function(result) {
        console.log(result);
         if(result.result === "ERROR") {
            promptError('修改失败,请注意输入信息');
             $('p.secret').text('');
        }
        else{
            promptSuccess('修改成功');
            
        }
    };
