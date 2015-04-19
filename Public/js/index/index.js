/**
	 *首页页面数据加载
	 *@author: waterbear
	 */


	//定义全局变量
	var global = {
		page: 1, //当前的页数
		maxlist: 3,//每一页最大的愿望数
		loadingpage: 1, //已经加载的页数
        wishid:null, //记录点击的是哪个id
		wishurl:'/wishes/', //加载愿望列表时的url TODO 部署时在'wishes'前加'/'
		searchurl: '/search/' ,//搜索的url 部署时在'wishes'前加'/'
		screenWishurl: '/screen/' ,//筛选
        sumpage:0,
        isCanScroll:true
	};
	
	$(document).ready(function() {
		//初始化加载
		var url = global.wishurl + global.page;
		//异步请求加载数据
		getjson('GET',url,null,setWishList,error);

		//搜索愿望
		searchWish();

		//筛选按钮
		menuSelected();
	});

	//点击跳转到个人中心,需单独写个文件
		$('.canvas-personal').click(function (){
				//TODO 部署时加'/'号
				window.location.href = '/usercenter';
		});
		

	//函数节流防止频繁调用
	var throttle = function(method,delay){
	    var timer = null;
	    return function() {
	        var context = this, args = arguments;
	        clearTimeout(timer);
	        timer = setTimeout(function(){
	            method.apply(context,args);
	        },delay);
	    }

	};

//检测到底部时刷新页面
	var show = function() {
		screenShow();
		if(!global.isCanScroll){
			console.log(global.isCanScroll);
			return;
		}	        	
		if($(window).scrollTop() + $(window).height() >= $(document).height()){
			var i =  parseInt(global.loadingpage);
            console.log(i);
			global.loadingpage = ++i;
			
			if(global.loadingpage > global.maxlist) {
				console.log(global.loadingpage);
				return;
			}
            var page = (global.page -1)* global.maxlist + parseInt(i);
			var url = global.wishurl + page ;

			//显示请稍后
			promptWait(true,'90%');
			//加载数据
			getjson('GET',url,null,setWishList,error);
		}
	};
	//窗口滚动时检测时调用加载函数
	window.onscroll = throttle(show,1000);


//针对筛选使用
var screenGlobal = {
		screenScroll:false,
        screendata:null,
        page:1,
        wishdataLength:null,
        loadingpage:1,
        sex:null
};

var screenShow = function() {
	if(!screenGlobal.screenScroll){
		return;
	}
	var data = screenGlobal.screendata;
	console.log(data);
	var dataLength =  screenGlobal.wishdataLength;
	console.log(dataLength);
	if(screenGlobal.page*10 > dataLength){
			screenGlobal.screenScroll = false;
			console.log(1);
			return;
	}
    screenGlobal.page++;
	var i = screenGlobal.page;
    
	setString(data.slice(i*10,i*10 + 10),screenGlobal.sex);
	
};

//window.onscroll =  throttle(screenShow,1000);

//组装愿望列表
	var setWishList = function(result) {
		var data = result['data'];
		if(!data) {
			return;
		}
		
		var sex = parseInt(result['sex']);
		if(data.length > 50){
			screenGlobal.sex = sex;
			screenGlobal.screendata = data;
			screenGlobal.wishdataLength = data.length;
			console.log(data.length);
			screenGlobal.screenScroll = true;
			global.isCanScroll = false;
			setString(data.slice(0,9),sex);
		}
		else{
			setString(data,sex);
		}
		//隐藏请稍后
		promptWait(false);
		
		
        //设置分页
		var maxsum = parseInt(result['wishsum']);
		setpagenum(maxsum);
	};

	var setString = function(data,sex) {
		var str = '';
		var mansex = sex;
		$.each(data,function(index,content){
			var string = '<li class="clearfix" id=';
				string +=  '"' + content.wish_id + '">';
				//部署时将photourl 换成 head_url
            	var headimg = content.head_url || content.photo_url;
				string += '<img src="' + headimg + '" />';
				string += '<div class="wish-textarea"><p class="female-name">'
					 	  + content.nickname + '</p><p class="wish-details">'
					 	  + content.wish_text + '</div>';
            
            	string += '<div class="get-campus">[<span>' + content.campus + '</span>]</div>';
            
				string += '<div class="get-area"><span>'
					 	  + content.time.substring(0,10) + '</span>';
            	//此处为数字1
				if(mansex === 1) {
					string += '<a href="#" class="keep-wish" value="'+content.wish_id+'">领取愿望</a></div></li>';
				}
					 	  
				str += string;
		});
		$('ul.wish-list').append(str);
        
        //点击切换到领取愿望
		showandhide('keep-wish','sub-page1');
        // 返回主页
		showandhide('return-index','sub-page');


		//男生点击领取愿望
		$('a.keep-wish').click(function() {
			var wishid = $(this).attr('value');
			getdatainfo(wishid);
		});
        
		if(global.loadingpage === 3){
				isShowPage(true);
		}
			
	};

	//加载错误的提示函数
	var error = function(xhr,textStatus,errorThrown) {
		console.log('数据加载出错');
		console.log(textStatus);
		console.log(errorThrown);
		console.log(xhr.readyState);
	};

/**************************搜索功能***********************/
	var searchWish = function() {
		var $input = $('input.search');
		$input.keyup(function() {
			var text = $input.val();
			if(text.length < 1) {
				return;
			}
			var data = {};
				data.text = htmlfilter(text);
			var url = global.searchurl;
            $ul = $('ul.wish-list');
			$ul.children().remove();
			getjson('POST',url,data,setWishList,error);
			promptWait(true,"70%");
			//隐藏分页
			isShowPage(false);
			global.isCanScroll = false;
		});
	};


    /*********************分页功能***********************/

var isShowPage = function(isShow){

	if(isShow) {
		$('.pagination-centered').css({"display":'block'});
	}
	else{
		$('.pagination-centered').css({"display":'none'});
	}
	
}
//设置分页点击的按钮数
var setpagenum = function(maxsum) {
	global.wishsum = maxsum;
	var maxpage = Math.ceil(maxsum/30);
    global.sumpage = maxpage;
	var currentpage = global.page;
    if(maxpage<4) {
        return;
    }
	if(maxpage - currentpage < 3) {
		$('a.first').attr('value',maxpage-3).text(maxpage-3).addClass('current');
		$('a.second').attr('value',maxpage-2).text(maxpage-2);
		$lia.addClass('current');
		return;
	}
	$('a.first').attr('value',currentpage).text(currentpage)
				.parent().addClass('current');
	$('a.second').attr('value',currentpage+1).text(currentpage+1)
	$('a.lastone').attr('value',maxpage-1).text(maxpage-1);
	$('a.last').attr('value',maxpage).text(maxpage);
};













/********************筛选功能部分******************/
var Type;
var menuSelected = function() {
  $('.select-wish-type>p').click(function(){
    $('.select-wish-type').css('border','1px solid #FFBFA5');
    $('.select-wish-type>li').css('display','block');
  });
  //二级菜单位置
  $('.select-wish-type>li').click(function(){
    $('.select-wish-type ul').css({
      "display": "block", 
      "border": "1px solid #FFBFA5"
    })
    if($(this).hasClass('type-all')) {
      $('.select-wish-type ul').css("top","0");
      Type = 'all-type';
    }
    else if($(this).hasClass('type-time')) {
      $('.select-wish-type ul').css("top","21px");
    }
    else if($(this).hasClass('type-thing')) {
      $('.select-wish-type ul').css("top","42px");
    }
  });
  //收回菜单
  $('img,nav,.wish-list,.pagination-centered,.orbit-container').click(function(){
    $('.select-wish-type>li').css("display","none");
    $('.select-wish-type').css("border","none");
    $('.select-wish-type ul').css("display","none");
  });

  $('.select-wish-type li').click(function(){
    $(this).addClass('menu-selected').siblings().removeClass('menu-selected');
  });
};






//绑定筛选事件
$('ul.screen-campus li').click(function() {
	var type = $('ul.select-wish-type>li.menu-selected').attr('value');
	var campus = $(this).attr('value');
	screenWish(type,campus);
	promptWait(true,"70%");
	//隐藏筛选框
	$('.pagination-centered').trigger('click');
	//隐藏分页
	isShowPage(false);
	//设置滚动不能够加载
	global.isCanScroll = false;
});

//将获得的愿望发送到后台
var screenWish = function(type,campus) {
	var wish_type;
	if(type === 'all-type' && campus === 'all-campus'){
		window.location.href = '/homepage';
		return;
	}
	if(type === 'all-type') {
		wish_type = new Array('1','2');
	}
	else {
		wish_type = new Array(type);
	}
	if(campus === 'all-campus') {
		campus = new Array('大学城','东风路','龙洞','番禺');
	}
	else{
		campus = new Array(campus);
	}
	isShowPage(false);
	//发送筛选信息到后台
	var data = {};
		data.wish_type = wish_type;
		data.campus = campus;
		console.log(data);
	getjson('POST',global.screenWishurl,data,setWishList,error);
	
	$('ul.wish-list').children().remove();

};


/*****************底部分页******************/
var $lia;
$('ul.pagination li').click(function(){
	var selectpage = parseInt($(this).children().attr('value'));
	var url = global.wishurl;
	$(this).parent()
			   .children()
			   .removeClass('current');
	if(selectpage) {	
		global.page = selectpage ;
		$lia = $(this);
	}
	if($(this).children().hasClass('prev-page')) {
		global.page = global.page - 1;
        if(global.page < 0){
            global.page = 1;
            return false;
        }
       
	}
	if($(this).children().hasClass('next-page')) {
		global.page = global.page + 1;
        console.log(global.page);
        if(global.page > global.sumpage){
            global.page = global.sumpage;
            return false;
        }
	}
	var page = global.page * global.maxlist -2;
        console.log(page);
        url += page;
        console.log(url);
	$('ul.wish-list').children().remove();
	global.loadingpage = 1;
    promptWait(true,'70%');
	//隐藏分页
	isShowPage(false);
	//设置滚动能够加载
	global.isCanScroll = true;
	getjson('GET',url,null,setWishList,error);
	return false;
});
