
$(function(){
    var scrollLastPos = $(window).scrollTop();
    var lastNewItemPos = 0;
    var scrollLimitPage = ($(document).height() - $(window).height()) - 200;

    $(window).on('scroll', function(){
        var scrollCurrentPos = $(window).scrollTop();

        // Esta variável só deve ser calculada se houver inserção de novos itens, isto aqui é um teste.
        lastNewItemPos = $('main .alert-new').last().offset().top - $('header').height();

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

    $('.notifications .btn-notifications').on('click', getNotificacionPermission);

    if (!localStorage.getItem('shared')) {
        $('.hello').show();
    }

    if (('Notification' in window) && Notification.permission !== 'granted') {
        $('.notifications').show();
    }

    // Fake

    setTimeout(function(){
        var description = 'Wow! Já temos mais 5 links. Quer ver?';
        if (window.getVisibilityState() == 'visible') {
            $('.alert-news').addClass('has-news').find('.text').text(description);
        } else {
            var notification = new Notification('CaquiJS', {body: description});
        }
    }, 5000);
});

function getNotificacionPermission() {
    Notification.requestPermission(function (permission) {
        if(!('permission' in Notification)) {
            Notification.permission = permission;

            if (Notification.permission === 'granted') {
                $('.notifications').hide();
            }
        }
    });

    return false;
}

var state;
if (typeof document.hidden !== "undefined") {
    state = "visibilityState";
} else if (typeof document.mozHidden !== "undefined") {
    state = "mozVisibilityState";
} else if (typeof document.msHidden !== "undefined") {
    state = "msVisibilityState";
} else if (typeof document.webkitHidden !== "undefined") {
    state = "webkitVisibilityState";
}

window.getVisibilityState = function(){
    return document[state];
};

$(document).ready(function() {
    $('#btn-share-facebook').on('click', function() {
        FB.ui({
            method: 'feed',
            name: 'Caqui JS',
            link: 'http://www.caquijs.com.br',
            picture: 'http://luver.dev/caquijs.io/static/app/img/logo.png',
            caption: 'Temos muito conhecimento para compartilhar com você.',
            //description: 'Caqui JS é um site de compartilhamento de conhecimento.'

        });
    });

    $('#btn-share-twitter').attr('href','https://twitter.com/intent/tweet?url=http://www.caquijs.com.br&text=Temos muito conhecimento para compartilhar com você.&via=caquijs');

    $('.hello a').on('click', function(){
        $('.hello').alert('close');
    });
});
