// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

// Place any jQuery/helper plugins in here.
/**
 * Timeago is a jQuery plugin that makes it easy to support automatically
 * updating fuzzy timestamps (e.g. "4 minutes ago" or "about 1 day ago").
 *
 * @name timeago
 * @version 1.4.1
 * @requires jQuery v1.2.3+
 * @author Ryan McGeary
 * @license MIT License - http://www.opensource.org/licenses/mit-license.php
 *
 * For usage and examples, visit:
 * http://timeago.yarp.com/
 *
 * Copyright (c) 2008-2015, Ryan McGeary (ryan -[at]- mcgeary [*dot*] org)
 */

(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['jquery'], factory);
  } else {
    // Browser globals
    factory(jQuery);
  }
}(function ($) {
  $.timeago = function(timestamp) {
    if (timestamp instanceof Date) {
      return inWords(timestamp);
    } else if (typeof timestamp === "string") {
      return inWords($.timeago.parse(timestamp));
    } else if (typeof timestamp === "number") {
      return inWords(new Date(timestamp));
    } else {
      return inWords($.timeago.datetime(timestamp));
    }
  };
  var $t = $.timeago;

  $.extend($.timeago, {
    settings: {
      refreshMillis: 60000,
      allowPast: true,
      allowFuture: false,
      localeTitle: false,
      cutoff: 0,
      strings: {
        prefixAgo: null,
        prefixFromNow: null,
        suffixAgo: "ago",
        suffixFromNow: "from now",
        inPast: 'any moment now',
        seconds: "less than a minute",
        minute: "about a minute",
        minutes: "%d minutes",
        hour: "about an hour",
        hours: "about %d hours",
        day: "a day",
        days: "%d days",
        month: "about a month",
        months: "%d months",
        year: "about a year",
        years: "%d years",
        wordSeparator: " ",
        numbers: []
      }
    },

    inWords: function(distanceMillis) {
      if(!this.settings.allowPast && ! this.settings.allowFuture) {
          throw 'timeago allowPast and allowFuture settings can not both be set to false.';
      }

      var $l = this.settings.strings;
      var prefix = $l.prefixAgo;
      var suffix = $l.suffixAgo;
      if (this.settings.allowFuture) {
        if (distanceMillis < 0) {
          prefix = $l.prefixFromNow;
          suffix = $l.suffixFromNow;
        }
      }

      if(!this.settings.allowPast && distanceMillis >= 0) {
        return this.settings.strings.inPast;
      }

      var seconds = Math.abs(distanceMillis) / 1000;
      var minutes = seconds / 60;
      var hours = minutes / 60;
      var days = hours / 24;
      var years = days / 365;

      function substitute(stringOrFunction, number) {
        var string = $.isFunction(stringOrFunction) ? stringOrFunction(number, distanceMillis) : stringOrFunction;
        var value = ($l.numbers && $l.numbers[number]) || number;
        return string.replace(/%d/i, value);
      }

      var words = seconds < 45 && substitute($l.seconds, Math.round(seconds)) ||
        seconds < 90 && substitute($l.minute, 1) ||
        minutes < 45 && substitute($l.minutes, Math.round(minutes)) ||
        minutes < 90 && substitute($l.hour, 1) ||
        hours < 24 && substitute($l.hours, Math.round(hours)) ||
        hours < 42 && substitute($l.day, 1) ||
        days < 30 && substitute($l.days, Math.round(days)) ||
        days < 45 && substitute($l.month, 1) ||
        days < 365 && substitute($l.months, Math.round(days / 30)) ||
        years < 1.5 && substitute($l.year, 1) ||
        substitute($l.years, Math.round(years));

      var separator = $l.wordSeparator || "";
      if ($l.wordSeparator === undefined) { separator = " "; }
      return $.trim([prefix, words, suffix].join(separator));
    },

    parse: function(iso8601) {
      var s = $.trim(iso8601);
      s = s.replace(/\.\d+/,""); // remove milliseconds
      s = s.replace(/-/,"/").replace(/-/,"/");
      s = s.replace(/T/," ").replace(/Z/," UTC");
      s = s.replace(/([\+\-]\d\d)\:?(\d\d)/," $1$2"); // -04:00 -> -0400
      s = s.replace(/([\+\-]\d\d)$/," $100"); // +09 -> +0900
      return new Date(s);
    },
    datetime: function(elem) {
      var iso8601 = $t.isTime(elem) ? $(elem).attr("datetime") : $(elem).attr("title");
      return $t.parse(iso8601);
    },
    isTime: function(elem) {
      // jQuery's `is()` doesn't play well with HTML5 in IE
      return $(elem).get(0).tagName.toLowerCase() === "time"; // $(elem).is("time");
    }
  });

  // functions that can be called via $(el).timeago('action')
  // init is default when no action is given
  // functions are called with context of a single element
  var functions = {
    init: function(){
      var refresh_el = $.proxy(refresh, this);
      refresh_el();
      var $s = $t.settings;
      if ($s.refreshMillis > 0) {
        this._timeagoInterval = setInterval(refresh_el, $s.refreshMillis);
      }
    },
    update: function(time){
      var parsedTime = $t.parse(time);
      $(this).data('timeago', { datetime: parsedTime });
      if($t.settings.localeTitle) $(this).attr("title", parsedTime.toLocaleString());
      refresh.apply(this);
    },
    updateFromDOM: function(){
      $(this).data('timeago', { datetime: $t.parse( $t.isTime(this) ? $(this).attr("datetime") : $(this).attr("title") ) });
      refresh.apply(this);
    },
    dispose: function () {
      if (this._timeagoInterval) {
        window.clearInterval(this._timeagoInterval);
        this._timeagoInterval = null;
      }
    }
  };

  $.fn.timeago = function(action, options) {
    var fn = action ? functions[action] : functions.init;
    if(!fn){
      throw new Error("Unknown function name '"+ action +"' for timeago");
    }
    // each over objects here and call the requested function
    this.each(function(){
      fn.call(this, options);
    });
    return this;
  };

  function refresh() {
    //check if it's still visible
    if(!$.contains(document.documentElement,this)){
      //stop if it has been removed
      $(this).timeago("dispose");
      return this;
    }

    var data = prepareData(this);
    var $s = $t.settings;

    if (!isNaN(data.datetime)) {
      if ( $s.cutoff == 0 || Math.abs(distance(data.datetime)) < $s.cutoff) {
        $(this).text(inWords(data.datetime));
      }
    }
    return this;
  }

  function prepareData(element) {
    element = $(element);
    if (!element.data("timeago")) {
      element.data("timeago", { datetime: $t.datetime(element) });
      var text = $.trim(element.text());
      if ($t.settings.localeTitle) {
        element.attr("title", element.data('timeago').datetime.toLocaleString());
      } else if (text.length > 0 && !($t.isTime(element) && element.attr("title"))) {
        element.attr("title", text);
      }
    }
    return element.data("timeago");
  }

  function inWords(date) {
    return $t.inWords(distance(date));
  }

  function distance(date) {
    return (new Date().getTime() - date.getTime());
  }

  // fix for IE6 suckage
  document.createElement("abbr");
  document.createElement("time");
}));

(function($, window, document, undefined) {
    // TODO: remote interface for get tags
    // Events: add, remove, maxTags, hasAutocomplete, error

    var normalize = function (str) {
        var w,
            map = {
                a: /[\xE0-\xE6]/g,
                e: /[\xE8-\xEB]/g,
                i: /[\xEC-\xEF]/g,
                o: /[\xF2-\xF6]/g,
                u: /[\xF9-\xFC]/g,
                c: /\xE7/g,
                n: /\xF1/g
            };

        for (w in map) {
            str = str.replace(map[w], w);
        }

        return str.toLowerCase();
    };

    function Tagger(el, settings) {
        var _this = this,
            _tags = [],
            _autocomplete, _id, _type, _tagTpl, _itemTpl,
            $el, $autocomplete, $placeholder, $liInput, $input;

        $el         = $(el);

        _id         = $el.attr('id');
        _type       = $(el).attr('type') || 'text';

        _tagTpl     = '<li class="tagger-tag">'+settings.tagTpl+'</li>';
        _itemTpl    = '<li class="tagger-list-item">'+settings.itemTpl+'</li>';

        $autocomplete   = $('<ul id="tagger-list-'+_id+'" class="'+settings.theme+' tagger-list"></ul>');
        $placeholder    = $('<ul id="tagger-'+_id+'" class="'+settings.theme+' tagger"><li class="tagger-tag-input"><input type="text" class="tagger-tag-input-suggestion" autocomplete="off" spellcheck="false" readonly /><input type="text" class="tagger-tag-input-value" placeholder="'+$el.attr('placeholder')+'" autocomplete="off" spellcheck="false" /></li></ul>');

        $liInput    = $placeholder.find('.tagger-tag-input');
        $suggestion = $liInput.find('.tagger-tag-input-suggestion');
        $input      = $liInput.find('.tagger-tag-input-value');

        $el.attr('type', 'hidden');

        // Deixar no body e posicionar na tela
        $('body').append($autocomplete);

        $input
            .on('keyup', function(e) {
                var val = $input.val().trim();
                if (val && val.length >= settings.minDigits) {
                    _list(val);
                } else {
                    _hideAutoComplete();
                }
            })
            .on('keydown', function(e) {
                var val = (settings.onlyInList ? $suggestion.val() : $input.val()).trim();

                if((e.which === 9 || e.which === 13 || e.which === 188) && val) {
                    if (_this.add(val)) {
                        $input.val('');
                        _hideAutoComplete();
                    }

                    e.preventDefault();
                }
            });

        $autocomplete.on('mouseleave', function(e){
            //_updateSuggestion($autocomplete.find('.tagger-list-item:eq(0)').attr('tagger-val'));
        });

        $(document).on('click', function(e){
            if (!$(e.target).closest($autocomplete).length) {
                _hideAutoComplete();
            }
        });

        $el.after($placeholder);

        var _list = function(val) {
            var filter = function(list){
                var score;
                var tags = list
                            .filter(function(item){ return _tags.filter(function(tag){ return normalize(tag) === normalize(item.value) }).length === 0 && normalize(item.value).indexOf(normalize(val)) !== -1; })
                            .sort(function(a, b){
                                score = 0;
                                score += (normalize(b.value).indexOf(normalize(val)) === 0) ? 2 : 0;
                                score += (b.value > a.value) ? 1 : (b.value < a.value ? -1 : 0);

                                return score;
                            });

                _showAutoComplete(tags);
            };

            $.isFunction(settings.tags) ? settings.tags(val, filter) : filter(settings.tags);
        };

        var _showAutoComplete = function(tags){
            var $item,
                parsed, tag, value, offset, i, k, l;

            $autocomplete.empty();

            if (tags.length) {
                for (i = 0, l = tags.length; i < l; i++) {
                    tag = tags[i];
                    val = tag.value;

                    parsed = _itemTpl;
                    for (k in tag) {
                        parsed = parsed.replace('{{ '+k+' }}', tag[k]);
                    }

                    $item = $(parsed)
                        .attr('tagger-val', val)
                        .on('mouseenter', function(e) {
                            _updateSuggestion($(this).attr('tagger-val'));
                        })
                        .on('click', function(e) {
                            if (_this.add($(this).attr('tagger-val'))) {
                                $input.val('');
                                _hideAutoComplete();
                            }
                        });

                    $autocomplete.append($item);
                }

                offset = $input.offset();

                $autocomplete.css({left: offset.left, top: offset.top + $input.innerHeight()});

                _updateSuggestion(tags[0].value);

                $autocomplete.show();
            } else {
                _hideAutoComplete();
            }
        };

        var _hideAutoComplete = function(){
            $suggestion.val('');
            $autocomplete.hide();
        };

        var _updateSuggestion = function(suggestion) {
            var val = $input.val();
            $suggestion.val(suggestion.toLowerCase().indexOf(val.toLowerCase()) === 0 ? val+suggestion.substr(val.length) : '');
        };

        var _updateVal = function() {
            $el.val(_tags.join(', '));
        };

        this.add = function(val) {
            var $tag;

            if (val && (settings.maxTags === false || settings.maxTags >= _tags.length) && _tags.indexOf(val) === -1) {
                _tags.push(val);

                $tag = $(_tagTpl.replace('{{ value }}', val))
                    .attr('tagger-val', val)
                    .on('click', '.tagger-tag-remove', function(e){
                        _this.remove($(this).parents('[tagger-val]').attr('tagger-val'));
                    });

                $liInput.before($tag);
                _updateVal();

                return true;
            } else {
                return false;
            }
        };

        this.remove = function(val) {
            var index;

            if ((index = _tags.indexOf(val)) !== -1) {
                $placeholder.find('[tagger-val="'+val+'"]').remove();
                _tags.splice(index, 1);
                _updateVal();
            }
        };

        this.destroy = function() {
            $el.attr('type', _type);
            $('#tagger-'+_id).remove();
        };
    }

    /**
     * Tagger
     * @param  Object params Config params
     * @return jQuery
     */
    $.fn.tagger = function(params) {
        params = params || {};

        if (typeof params === 'object') {
            var defaults = {
                tags:       [], // or function
                minDigits:  3,
                maxTags:    false,
                onlyInList: false,
                theme:      'tagger-default-theme',
                tagTpl:     '<span class="tagger-item-label-text">{{ value }}</span><button class="tagger-tag-remove">X</button>',
                itemTpl:    '{{ value }}'
            };

            var settings = $.extend(defaults, params);

            return $(this).each(function(){
                if ($(this).data('tagger') === undefined) {
                    $(this).data('tagger', new Tagger(this, settings));
                } else {
                    $(this).data('tagger').destroy();
                    $(this).data('tagger', new Tagger(this, settings));
                }
            });
        } else {
            var param = arguments[1];

            return $(this).each(function(){
                if ($(this).data('tagger') !== undefined) {
                    $(this).data('tagger')[params](param);
                }
            });
        }
    };
})(jQuery, window, document);
