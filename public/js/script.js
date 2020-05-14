$(document).on("scroll", function(){
    if($(document).scrollTop() > 86){
        $("#banner").addClass("shrink");
        $("#banner").removeClass("navbar-dark");
        $("#banner").addClass("navbar-light");
        $(".black").addClass("text-dark");
    }
    else
    {
        $("#banner").removeClass("shrink");
        $("#banner").addClass("navbar-dark");
        $("#banner").removeClass("navbar-light");
        $(".black").removeClass("text-dark");
    }
});