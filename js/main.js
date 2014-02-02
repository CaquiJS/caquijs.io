
$(function(){
    var scrollLastPos = $(window).scrollTop();
    var lastNewItemPos = 0;
    var scrollLimitPage = ($(document).height() - $(window).height()) - 200;

    $(window).on('scroll', function(){
        var scrollCurrentPos = $(window).scrollTop();

        // Esta variável só deve ser calculada se houver inserção de novos itens, isto aqui é um teste.
        lastNewItemPos = $('main .alert-warning').last().offset().top - $('header').height();

        // if scrolling to down
        if (scrollCurrentPos > scrollLastPos) {
            $('[data-offscreen]').addClass('offscreen');
        } else {
            $('[data-offscreen]').removeClass('offscreen');
        }

        if (scrollCurrentPos < lastNewItemPos) {
            lastNewItemPos = 0;
            $('.alert-news').removeClass('has-news');
        }

        if (scrollCurrentPos >= scrollLimitPage) {
            $('.loading-more').css({opacity: 1});
        }

        scrollLastPos = scrollCurrentPos;
    });

    $('.alert-news').on('click', function(){
        $(this).removeClass('has-news');
        $('html, body').animate({scrollTop: $('main section').offset().top - $('header').height() - 15}, 600);
    });

    setTimeout(function(){
        $('.alert-news').addClass('has-news');
    }, 5000);
});