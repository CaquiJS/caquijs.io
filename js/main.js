
$(function(){
    var scrollLastPos = $(window).scrollTop();
    $(window).on('scroll', function(){
        var scrollCurrentPos = $(window).scrollTop();

        // if scrolling to down
        if (scrollCurrentPos > scrollLastPos) {
            $('header .secondary-content').addClass('offscreen');
        } else {
            $('header .secondary-content').removeClass('offscreen');
        }

        scrollLastPos = scrollCurrentPos;
    });
});