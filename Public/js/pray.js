/**
 *与许愿有关的js
 *@author:waterbear
 */
//和许愿有关的全局变量
var pray = {
	myPray: '/myPray/', //女生许愿 TODO 部署时时删除'/wishwall'
	infourl: '/myInfo', //获得个人资料url TODO 部署时删去'/wishwall'
	promise: '/myPromise',
	wishid:null
};
//绑定事件,校区更改,则改变学院
$('select.campus').change(function() {
	setCollege();
});
$('select.campus_1').change(function(){
	setCollege_1();
});

//女生点击第一个'下一步'按钮从数据库获取用户资料
$('a.next-step').click(function() {
	getPrayContent();
});

//女生点击第二个'下一步'按钮获取用户填写的资料
$('a.next-step2').click(function() {
	getPrayinfo();
});

//女生点击确认按钮提交愿望
var time = true;
$('a.confirm-pray').click(function() {
    if(!time){
   	 return;
   }
	commitPray();
	setTimeout(function(){
		time = true;
	},5000);
});

//点击确认领取按钮
$('#accept-step').click(function() {
   // $(this).attr('disabled',true);
   console.log(1);
	getPrayinfo();
	
});

//点击返回愿望列表按钮返回首页
$('a.back-wish').click(function() {
 	window.location.href = '/homepage';   
});

//领取愿望部分编辑修改
  $('.change-wish-btn').click(function(){
    $('.wish-change-text p').attr('contenteditable','true').focus().css('background','white');
    $(this).css('display','none').next().css('display','inline');
  });
  $('#complete-change').click(function(){
    $('.wish-change-text p').attr('contenteditable','false').css('background','none');
    $(this).css('display','none').prev().css('display','inline');
  });
  $('.change-info-btn').click(function(){
    $('.confirm-girls span').attr('contenteditable','true').focus().css('background','white');
    $(this).css('display','none').next().css('display','inline');
  });
  $('#complete-info-change').click(function(){
    $('.confirm-girls span').attr('contenteditable','false').css('background','none');
    $(this).css('display','none').prev().css('display','inline');
  });


//获取填写愿望内容
var getPrayContent = function() {
	//获取愿望内容
	pray.wish_text = htmlfilter($('textarea.writemywish').val());
	pray.wish_type = htmlfilter($('.wish-type option:selected').attr('value'));
	if(pray.wish_text) {
		getdatainfo();
	}
};

//从数据库获得个人信息
var getdatainfo = function(id) {
	//若id存在则是男生在领取愿望
	if(id) {
		pray.wishid = id;
		//在领取愿望的最后一页填充女生的愿望内容
		setgirlWishtext(id);
	}
	//获取输入信息,先查看数据库用户有没有的资料
		$.get(pray.infourl,function(result) {

			if(result.result === 'ERROR') {
				return;
			}
			var data = result.data.info;

			//如果有则填充资料
			if(data.name) {
				$('input.name').val(data.name);
				$('input.tel-long').val(data.tel_long);
				$('input.tel-short').val(data.tel_short);
				$('input.email').val(data.email);
				//$("select.campus option[value='" + data.campus +"']").attr('selected',true);
				$('select.campus').find("option[value='" + data.campus +"']").attr('selected',true);
				setCollege();
				$("select.college option[value='" + data.college + "']").attr('selected',true);	
			}
	    });
};

//根据选的校区不同的学院
var setCollege = function() {
		//校区信息
		var campus = new Array('大学城','龙洞','东风路','番禺');
		var college = new Array(
									'<option value="外国语学院">外国语学院</option>'
						 			+ '<option value="计算机学院">计算机学院</option>'
						 			+ '<option value="轻工化工学院">轻工化工学院</option>'
									+ '<option value="机电工程学院">机电工程学院</option>'
									+ '<option value="信息工程学院">信息工程学院</option>'
									+ '<option value="自动化学院">自动化学院</option>'
									+ '<option value="材料与能源学院">材料与能源学院</option>'
									+ '<option value="土木与交通工程学院">土木与交通工程学院</option>'
									+ '<option value="物理与光电工程学院">物理与光电工程学院</option>'
									+ '<option value="环境科学与工程学院">环境科学与工程学院</option>',

									'<option value="管理学院">管理学院</option>'
		    					   	+ '<option value="应用数学学院">应用数学学院</option>'
		    					   	+ '<option value="经济与贸易学院">经济与贸易学院</option>',

		    					   	'<option value="艺术设计学院">艺术设计学院</option>'
		    						+ '<option value="政法学院">政法学院</option>'
		    						+ '<option value="建筑与城市规划学院">建筑与城市规划学院</option>',

		    						'<option value="商学院">商学院</option>'
						);
		var currentcampus = $('select.campus option:selected').attr('value');
		$college = $('select.college');
		$college.children().remove();
		for(var i = 0; i < campus.length; i++) {
			if(currentcampus === campus[i]) {
				$college.append(college[i]);
				break;
			}
		}
};




var setCollege_1 = function() {
		//校区信息
		var campus = new Array('大学城','龙洞','东风路','番禺');
		var college = new Array(
									'<option value="外国语学院">外国语学院</option>'
						 			+ '<option value="计算机学院">计算机学院</option>'
						 			+ '<option value="轻工化工学院">轻工化工学院</option>'
									+ '<option value="机电工程学院">机电工程学院</option>'
									+ '<option value="信息工程学院">信息工程学院</option>'
									+ '<option value="自动化学院">自动化学院</option>'
									+ '<option value="材料与能源学院">材料与能源学院</option>'
									+ '<option value="土木与交通工程学院">土木与交通工程学院</option>'
									+ '<option value="物理与光电工程学院">物理与光电工程学院</option>'
									+ '<option value="环境科学与工程学院">环境科学与工程学院</option>',

									'<option value="管理学院">管理学院</option>'
		    					   	+ '<option value="应用数学学院">应用数学学院</option>'
		    					   	+ '<option value="经济与贸易学院">经济与贸易学院</option>',

		    					   	'<option value="艺术设计学院">艺术设计学院</option>'
		    						+ '<option value="政法学院">政法学院</option>'
		    						+ '<option value="建筑与城市规划学院">建筑与城市规划学院</option>',

		    						'<option value="商学院">商学院</option>'
						);
		var currentcampus = $('select.campus_1 option:selected').attr('value');
		$college = $('select.college');
		$college.children().remove();
		for(var i = 0; i < campus.length; i++) {
			if(currentcampus === campus[i]) {
				$college.append(college[i]);
				break;
			}
		}
};





//获取填写的个人资料
var getPrayinfo = function() {
	var data = {};
		data.name = $('input.name').val();
		data.tel_long = $('input.tel-long').val();
		data.tel_short = $('input.tel-short').val();
		data.email = $('input.email').val();
		data.campus = $(".campus option:selected").val();
		data.college = $(".college option:selected").val();
		data.wish_text = pray.wish_text;
		data.wish_type = pray.wish_type;
		if(!data.name) {
			return;
		}
		if(data.wish_type) {
			//女生填充信息
			setConfirmpray(htmlfilter(data));
		}
		else{
			//男生领取愿望
			data.wish_id = pray.wishid;
			getgirlinfo(htmlfilter(data));
		}
};

//在确认页填充用户的'我的心愿'和'我的资料'
var setConfirmpray = function(data) {
	var type = data.wish_type == "1" ? "实物型":"耗时型";
	var prayDom = pray;
	if(!prayDom.prayType) {
		prayDom.prayType = $('.pray-type');
		prayDom.prayText = $('.pray-text');
		prayDom.prayName = $('.pray-name');
		prayDom.prayCampus = $('.pray-campus');
		prayDom.prayCollege = $('.pray-college');
		prayDom.prayLong = $('.pray-long');
		prayDom.prayShort = $('.pray-short');
		prayDom.prayEmail = $('.pray-email');
		pray = prayDom;
	}
	prayDom.prayType.text(type);
	prayDom.prayType.attr('value',data.wish_type);
	prayDom.prayText.text(data.wish_text);
	prayDom.prayName.text(data.name); 
	prayDom.prayCampus.text(data.campus);
	prayDom.prayCollege.text(data.college);
	prayDom.prayLong.text(data.tel_long);
	prayDom.prayShort.text(data.tel_short);
	prayDom.prayEmail.text(data.email);	
};

//提交愿望
var commitPray =  function() {
	var data = {};
	var userinfo = {};
	var prayDom = pray;
	if(!prayDom.prayType) {
		return;
	}
	data.wish_type = prayDom.prayType.attr('value');
	data.wish_text =  prayDom.prayText.text();
	userinfo.name = prayDom.prayName.text(); 
	userinfo.campus = prayDom.prayCampus.text();
	userinfo.college = prayDom.prayCollege.text();
	userinfo.tel_long = prayDom.prayLong.text();
	userinfo.tel_short = prayDom.prayShort.text();
	userinfo.email = prayDom.prayEmail.text();
	userinfo = htmlfilter(userinfo);
	data = htmlfilter(data);
	data.userinfo = userinfo;
	getjson('POST',prayDom.myPray,data,commitPraysn,error);	
};

//提交愿望后的回调函数
var commitPraysn = function(result) {
	console.log(result);
	if(result.result === 'SUCCESS') {
        promptSuccess('许愿成功');
        setTimeout(function(){
			window.location.href = '/usercenter';
		},1200);
	}
    else{
        promptError('许愿失败');
    }
};

//确认领取愿望获得女生资料
var getgirlinfo = function(data) {
	var prodata = {};
		prodata = data;
		console.log(prodata);
	getjson('POST',pray.promise,prodata,getgirlinfosn,error);
};

//获得女生信息后的回调函数
var getgirlinfosn = function(result) {
	if(result.result === 'ERROR') {
		console.log(result);
        promptError('愿望领取失败');
		return;
	}
	var info = result['data']['info'];
	$('span.girl-name').text(info.name);
	$('span.girl-campus').text(info.campus);
	$('span.girl-college').text(info.college);
	$('span.girl-long').text(info.tel_long);
	$('span.girl-short').text(info.tel_short);
    promptSuccess('少侠福利来了');
};

//在领取愿望的最后一页填充女生的愿望
var setgirlWishtext = function(id) {
	var wishtext = $('#' + id).find("p.wish-details").text();
	$('p.get-wish-text').text(wishtext);
};


//验证愿望输入框的字数
var checkWish = function(){
	var wWish = document.querySelector('.writemywish').value;
		if(wWish.length > 140) {
			$('a.next-step').unbind('click');
		}
		else {
			showandhide('next-step','sub-page2');
		}
}

//定义验证发布愿望时数据格式的函数
function checkFil(num,fil){
    var filter = fil;
    if(filter.test(num.value)==true) {
      num.style.borderColor = '#ccc';
      showandhide('next-step2','sub-page3');
    }
    else {
      num.style.borderColor = 'red';
      $('a.next-step2').unbind('click');
    }
  }
function checkFil_male(num,fil){
	var filter = fil;
    if(filter.test(num.value)==true) {
      num.style.borderColor = '#ccc';
      $('#accept-step').addClass('next-step');
    }
    else {
      num.style.borderColor = 'red';
      $('#accept-step').removeClass('next-step');
    }
}
//验证长号调用
var numInput = document.getElementById('telNum');
var numInput_male = document.getElementById('telNum_male');
// $('#telNum').on('keyup',function(){checkFil(numInput,/1\d{10}/);});

//验证邮箱调用
var emailInput = document.getElementById('emailInput');
var emailInput_male = document.getElementById('emailInput_male');
// $('#emailInput').on('blur',function(){checkFil(emailInput,/^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,5}$/);});
$('.write-message-female').on('keyup',function(){checkFil(numInput,/1\d{10}/);
	checkFil(emailInput,/^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,5}$/);});
$('.write-message-male').on('keyup',function(){checkFil_male(numInput_male,/1\d{10}/);
	checkFil_male(emailInput_male,/^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,5}$/);});
$('.writemywish').on('blur',function(){checkWish();});