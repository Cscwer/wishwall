doc = document;
$('.footer-btn li').click(function(){
    $(this).addClass('current').siblings().removeClass('current');
});
//添加最小高度
var oHeight = window.screen.height;
$('.main-section').css('min-height',oHeight);
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
        nextBtn.href = '#';
    }
    else {
        p.innerHTML = '您还可以输入'+(100-txt.length)+'个字';
        nextBtn.style.background = '#7D5B3F';
        nextBtn.href = '#'; 
    }
}
$('#writewish').keyup(function(){checkText();});
//验证资料规范
