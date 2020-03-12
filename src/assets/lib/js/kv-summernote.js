/*!
 * @copyright Copyright &copy; Kartik Visweswaran, Krajee.com, 2014 - 2020
 * @package yii2-editors
 * @version 1.0.0
 *
 * Krajee jQuery Plugin enhancements to Summernote Editor
 */
(function (factory) {
    'use strict';
    //noinspection JSUnresolvedVariable
    if (typeof define === 'function' && define.amd) { // jshint ignore:line
        // AMD. Register as an anonymous module.
        define(['jquery'], factory); // jshint ignore:line
    } else { // noinspection JSUnresolvedVariable
        if (typeof module === 'object' && module.exports) { // jshint ignore:line
            // Node/CommonJS
            // noinspection JSUnresolvedVariable
            module.exports = factory(require('jquery')); // jshint ignore:line
        } else {
            // Browser globals
            factory(window.jQuery);
        }
    }
}(function ($) {
    'use strict';
    var KvSummernote = function (element, options) {
        var self = this;
        self.$element = $(element);
        self.options = options;
        self.init();
    };
    //noinspection JSUnusedGlobalSymbols
    KvSummernote.prototype = {
        constructor: KvSummernote,
        init: function () {
            var self = this, $el = self.$element, opts = self.options, $form = $el.closest('form');
            if (opts.enableHintEmojis) {
                self.initEmojis();
            }
            if (opts.autoFormatCode) {
                $el.off('summernote.codeview.toggled').on('summernote.codeview.toggled', function () {
                    self.formatCode();
                });
            }
            if ($form && $form.length) {
                $form.on('reset', function () {
                    $el.summernote('reset');
                });
            }
        },
        formatCode: function () {
            var self = this, $code = self.$element.next().find('textarea.note-codable'),
                editor, totalLines, totalChars;
            if ($code.length) {
                editor = $code.data('cmEditor');
                if (editor) {
                    totalLines = editor.lineCount();
                    totalChars = editor.getTextArea().value.length;
                    editor.autoFormatRange({line: 0, ch: 0}, {line: totalLines, ch: totalChars});
                }
            }
        },
        initEmojis: function () {
            if (window.kvEmojis && window.kvEmojisUrls) {
                return;
            }
            $.ajax({
                url: 'https://api.github.com/emojis',
                async: false
            }).then(function (data) {
                window.kvEmojis = Object.keys(data);
                window.kvEmojiUrls = data;
            });
        }
    };
    $.fn.kvSummernote = function (option) {
        var args = Array.apply(null, arguments), retvals = [];
        args.shift();
        this.each(function () {
            var self = $(this), data = self.data('kvSummernote'), options = typeof option === 'object' && option, opt;
            if (!data) {
                opt = $.extend(true, {}, $.fn.fileinput.defaults, options, self.data());
                data = new KvSummernote(this, opt);
                self.data('kvSummernote', data);
            }
            if (typeof option === 'string') {
                retvals.push(data[option].apply(data, args));
            }
        });
        switch (retvals.length) {
            case 0:
                return this;
            case 1:
                return retvals[0];
            default:
                return retvals;
        }
    };

    $.fn.kvSummernote.defaults = {
        enableHintEmojis: true,
        autoFormatCode: true
    };

    $.fn.kvSummernote.Constructor = KvSummernote;
}));