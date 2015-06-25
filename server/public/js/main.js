// Brazilian Portuguese
jQuery.timeago.settings.strings = {
    prefixAgo: "há",
    prefixFromNow: "em",
    suffixAgo: null,
    suffixFromNow: null,
    seconds: "alguns segundos",
    minute: "um minuto",
    minutes: "%d minutos",
    hour: "uma hora",
    hours: "%d horas",
    day: "um dia",
    days: "%d dias",
    month: "um mês",
    months: "%d meses",
    year: "um ano",
    years: "%d anos"
};

function dateFormatter(date) {
    return jQuery.timeago(date);//time
}
Number.prototype.padLeft = function(base,chr){
   var  len = (String(base || 10).length - String(this).length)+1;
   return len > 0? new Array(len).join(chr || '0')+this : this;
}

// var socket = io.connect('http://localhost');
// socket.on('news', function (data) {
//     console.log(data);
//     socket.emit('my other event', { my: 'data' });
// });

$(function(){
    var scrollLastPos = $(window).scrollTop();
    var lastNewItemPos = 0;
    var scrollLimitPage = ($(document).height() - $(window).height()) - 200;

    $('.time').each(function(){
        _this = $(this);
        var date =  new Date(_this.text()),
        dformat = [ (date.getMonth()+1).padLeft(), date.getDate().padLeft(),date.getFullYear()].join('/')+' ' +[ date.getHours().padLeft(),date.getMinutes().padLeft(),date.getSeconds().padLeft()].join(':');
        _this.text(dateFormatter(dformat));
    });

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

    // Tagger.js
    var i = 0;
    var to;
    $('#txt-filter').tagger({
        //tags:       function(val, onComplete){ clearTimeout(to); to = setTimeout(function(){ onComplete(tags); }, 1000); }, // or function
        tags:       tags,
        minDigits:  0,
        maxTags:    false, // or number
        onlyInList: true,
        tagTpl:     '<span class="tagger-item-label-text">{{ value }}</span><button class="tagger-tag-remove">X</button>',
        itemTpl:    '<span>{{ value }}</span>'
    });

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

var http = require('http');
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello Node.JS!');
}).listen(8080);
console.log('Server running at http://localhost:8080/');
