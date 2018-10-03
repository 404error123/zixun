$(function(){
	
	$(".show-nav").click(function(){
        var screeWidth = $(window).width();
        if(screeWidth<975){
            $(".cnt-header .nav").slideToggle();
        }else{
            $(".aside").toggleClass("shrink");
        }
    })
})