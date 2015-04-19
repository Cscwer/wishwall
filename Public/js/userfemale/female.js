 /**
  *女生个人中心确认愿望完成部分
  *@author:waterbear
  */  



//获取实现ing中对方的信息,并组装
var getInfo = function(id) {
    wish.wishid = id;
    var url = global.confirminfo + id;
    getjson('GET',url,null,setConfirm,error);
    //清空表单
    $('#star li').removeClass('on');
    $('#star').attr('value',0);
    $('#message').val('');
    //绑定
    $('.finished').click(function() {
          confirmform();
           return false;
    });
};


/********************女生个人中心确认愿望完成界面************************/
var setConfirm = function(result) {
    var data = result['data'];
    var sex = result['sex'];
    if(!data) {
        return;
    }
    var $confirm = $('#confirm');
    $confirm.prev().remove();
    $confirm.prev().remove();
    if(sex === '2') {
        var str = '<div class="columns large-12 small-12">';
        var string = str + '<div class="confirm-list"><div>女生心愿:</div>'
                         + '<p>' + data.wish_text + '</p>'
                         + '</div></div>';
            string += str + '<div class="confirm-list boy-msg"><div>男生信息:</div>' 
                          + '<div class="row"><div class="columns large-6 small-6"><ul>'
                          + '<li>姓名:' + data.name + '</li>'
                          + '<li>校区:' + data.campus + '</li>'
                          + '<li>长号:' + data.tel_long + '</li>'
                          + '</ul></div>';
            string += '<div class="columns large-6 small-6"><ul class="right-ul">'
                      + '<li>学院:' + data.college + '</li>'
                      + '<li>短号:' + data.tel_short + '</li>'
                      + '<li>邮箱:' + data.email + '</li>'
                      + '</ul></div>'
                      + '</div>';
            
        $(string).insertBefore("#confirm");
    }
};


 //提交确认表单
var confirmform = function() {
    var data = {};
    data.wish_id = wish.wishid;
    data.message = $('#message').val();
    data.star = $('#star').attr('value');
    //过滤标签
    data = htmlfilter(data);
    console.log(data);
    getjson('POST',global.confirm,data,confirmsn,error);
};

//确认愿望完成成功后的回调函数
var confirmsn = function(result) {
    if(result.result === 'SUCCESS') {
        //TODO
        window.location.href = '/usercenter';
    }
};