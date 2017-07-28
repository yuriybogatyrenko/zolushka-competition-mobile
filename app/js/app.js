'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var YOURAPPNAME = function () {
    function YOURAPPNAME(doc) {
        _classCallCheck(this, YOURAPPNAME);

        this.doc = doc;
        this.window = window;
        this.html = this.doc.querySelector('html');
        this.body = this.doc.body;
        this.location = location;
        this.hash = location.hash;
        this.Object = Object;
        this.scrollWidth = 0;

        this.scrollWidth = this.scrollBarWidth();
    }

    // Window load types (loading, dom, full)


    _createClass(YOURAPPNAME, [{
        key: 'appLoad',
        value: function appLoad(type, callback) {
            var _self = this;

            switch (type) {
                case 'loading':
                    if (_self.doc.readyState === 'loading') callback();

                    break;
                case 'dom':
                    _self.doc.onreadystatechange = function () {
                        if (_self.doc.readyState === 'complete') callback();
                    };

                    break;
                case 'full':
                    _self.window.onload = function (e) {
                        callback(e);
                    };

                    break;
                default:
                    callback();
            }
        }
    }, {
        key: 'scrollBarWidth',


        // Detect scroll default scrollBar width (return a number)
        value: function scrollBarWidth() {
            var _self = this;
            var outer = _self.doc.createElement("div");

            outer.style.visibility = "hidden";
            outer.style.width = "100px";
            outer.style.msOverflowStyle = "scrollbar";

            _self.body.appendChild(outer);

            var widthNoScroll = outer.offsetWidth;

            outer.style.overflow = "scroll";

            var inner = _self.doc.createElement("div");

            inner.style.width = "100%";
            outer.appendChild(inner);

            var widthWithScroll = inner.offsetWidth;

            outer.parentNode.removeChild(outer);

            return widthNoScroll - widthWithScroll;
        }
    }, {
        key: 'initSwitcher',
        value: function initSwitcher() {
            var _self = this;

            var switchers = _self.doc.querySelectorAll('[data-switcher]');

            if (switchers && switchers.length > 0) {
                for (var i = 0; i < switchers.length; i++) {
                    var switcher = switchers[i],
                        switcherOptions = _self.options(switcher.dataset["switcher"]),
                        switcherElems = switcher.children,
                        switcherTargets = _self.doc.querySelector('[data-switcher-target="' + switcherOptions.target + '"]').children,
                        switchersActive = [];

                    for (var y = 0; y < switcherElems.length; y++) {
                        var switcherElem = switcherElems[y],
                            parentNode = switcher.children,
                            switcherTrigger = switcherElem.children.length ? switcherElem.children[0] : switcherElem,
                            switcherTarget = switcherTargets[y];

                        if (switcherElem.classList.contains('active')) {
                            for (var z = 0; z < parentNode.length; z++) {
                                parentNode[z].classList.remove('active');
                                switcherTargets[z].classList.remove('active');
                            }
                            switcherElem.classList.add('active');
                            switcherTarget.classList.add('active');
                        } else switchersActive.push(0);

                        switcherTrigger.addEventListener('click', function (elem, target, parent, targets) {
                            return function (e) {
                                e.preventDefault();

                                if (!elem.classList.contains('active')) {
                                    for (var _z = 0; _z < elem.parentNode.children.length; _z++) {
                                        elem.parentNode.children[_z].classList.remove('active');
                                        targets[_z].classList.remove('active');
                                    }
                                    elem.classList.add('active');
                                    target.classList.add('active');
                                }
                            };
                        }(switcherElem, switcherTarget, parentNode, switcherTargets));
                    }

                    if (switchersActive.length === switcherElems.length) {
                        switcherElems[0].classList.add('active');
                        switcherTargets[0].classList.add('active');
                    }
                }
            }
        }
    }, {
        key: 'str2json',
        value: function str2json(str, notevil) {
            try {
                if (notevil) {
                    return JSON.parse(str.replace(/([\$\w]+)\s*:/g, function (_, $1) {
                        return '"' + $1 + '":';
                    }).replace(/'([^']+)'/g, function (_, $1) {
                        return '"' + $1 + '"';
                    }));
                } else {
                    return new Function("", "const json = " + str + "; return JSON.parse(JSON.stringify(json));")();
                }
            } catch (e) {
                return false;
            }
        }
    }, {
        key: 'options',
        value: function options(string) {
            var _self = this;

            if (typeof string !== 'string') return string;

            if (string.indexOf(':') !== -1 && string.trim().substr(-1) !== '}') {
                string = '{' + string + '}';
            }

            var start = string ? string.indexOf("{") : -1;
            var options = {};

            if (start !== -1) {
                try {
                    options = _self.str2json(string.substr(start));
                } catch (e) {}
            }

            return options;
        }
    }, {
        key: 'formPasswordSwitch',
        value: function formPasswordSwitch() {
            $('.js-password-detector').on('click', function (e) {
                var $this = $(this);
                var $input = $this.siblings('input');

                if ($input.attr('type') === 'password') $input.attr('type', 'text');else $input.attr('type', 'password');
            });
        }
    }, {
        key: 'popups',
        value: function popups(options) {
            var _self = this;

            var defaults = {
                reachElementClass: '.js-popup',
                closePopupClass: '.js-close-popup',
                currentElementClass: '.js-open-popup',
                changePopupClass: '.js-change-popup'
            };

            options = $.extend({}, options, defaults);

            var plugin = {
                reachPopups: $(options.reachElementClass),
                bodyEl: $('body'),
                topPanelEl: $('.top-panel-wrapper'),
                htmlEl: $('html'),
                closePopupEl: $(options.closePopupClass),
                openPopupEl: $(options.currentElementClass),
                changePopupEl: $(options.changePopupClass),
                bodyPos: 0
            };

            plugin.openPopup = function (popupName) {
                plugin.reachPopups.filter('[data-popup="' + popupName + '"]').addClass('opened');
                plugin.bodyEl.css('overflow-y', 'scroll');
                // plugin.topPanelEl.css('padding-right', scrollSettings.width);
                plugin.htmlEl.addClass('popup-opened');
            };

            plugin.closePopup = function (popupName) {
                plugin.reachPopups.filter('[data-popup="' + popupName + '"]').removeClass('opened');
                setTimeout(function () {
                    plugin.bodyEl.removeAttr('style');
                    plugin.htmlEl.removeClass('popup-opened');
                    plugin.topPanelEl.removeAttr('style');
                }, 300);
            };

            plugin.changePopup = function (closingPopup, openingPopup) {
                plugin.reachPopups.filter('[data-popup="' + closingPopup + '"]').removeClass('opened');
                plugin.reachPopups.filter('[data-popup="' + openingPopup + '"]').addClass('opened');
            };

            plugin.init = function () {
                plugin.bindings();
            };

            plugin.bindings = function () {
                plugin.openPopupEl.on('click', function (e) {
                    e.preventDefault();
                    var pop = $(this).attr('data-popup-target');
                    plugin.openPopup(pop);
                });

                plugin.closePopupEl.on('click', function (e) {
                    var pop = void 0;
                    if (this.hasAttribute('data-popup-target')) {
                        pop = $(this).attr('data-popup-target');
                    } else {
                        pop = $(this).closest(options.reachElementClass).attr('data-popup');
                    }

                    plugin.closePopup(pop);
                });

                plugin.changePopupEl.on('click', function (e) {
                    var closingPop = $(this).attr('data-closing-popup');
                    var openingPop = $(this).attr('data-opening-popup');

                    plugin.changePopup(closingPop, openingPop);
                });

                plugin.reachPopups.on('click', function (e) {
                    var target = $(e.target);
                    var className = options.reachElementClass.replace('.', '');
                    if (target.hasClass(className)) {
                        plugin.closePopup($(e.target).attr('data-popup'));
                    }
                });
            };

            if (options) plugin.init();

            return plugin;
        }
    }, {
        key: 'questionnaire',
        value: function questionnaire(selector) {
            var $selector = $(selector),
                $button = $selector.find('[data-questionnaire-show]'),
                $container = $selector.find('[data-questionnaire-height]');

            $button.on('click', function (e) {
                e.preventDefault();
                var height = $container.outerHeight();
                $selector.css({ height: height }).addClass('visible-active');
                setTimeout(function () {
                    $selector.css({ height: 'auto' });
                }, 300);
            });
        }
    }, {
        key: 'carousels',
        value: function carousels(selector) {
            var $carousels = $(selector);

            $carousels.each(function () {
                var $this = $(this);
                var Vthis = this;

                $this.owlCarousel({
                    autoWidth: Vthis.hasAttribute('data-auto-width'),
                    nav: false,
                    dots: false,
                    margin: Vthis.hasAttribute('data-margin') ? parseInt(Vthis.getAttribute('data-margin')) : 0,
                    loop: Vthis.hasAttribute('data-loop')
                });
            });
        }
    }, {
        key: 'fullScreen',
        value: function fullScreen(selector) {
            $(selector).css({ height: $(window).outerHeight() - 50 });

            /*$(window).resize(() => {
             $(selector).css({height: $(window).outerHeight()-50});
             });*/
        }
    }, {
        key: 'photosUpload',
        value: function photosUpload() {
            var $imageDropBox = $('#image-drop-box');

            if ($imageDropBox.length) {
                var imageList = [];
                var imageFilesList = [];
                var imageDropBoxLoadingClass = 'image-drop-box-loading';
                var imageDropBoxHasFilesClass = 'image-drop-box-has-file';

                var input = this.doc.getElementById('image-drop-box__files');

                var showPreloader = function showPreloader() {
                    $imageDropBox.addClass(imageDropBoxLoadingClass);
                };

                var hidePreloader = function hidePreloader() {
                    setTimeout(function () {
                        $imageDropBox.removeClass(imageDropBoxLoadingClass);
                    }, 300);
                };

                var checkImageDropBox = function checkImageDropBox() {
                    imageList.length ? $imageDropBox.addClass(imageDropBoxHasFilesClass) : $imageDropBox.removeClass(imageDropBoxHasFilesClass);
                };

                var renderTemplate = function renderTemplate(src, index) {
                    return '<div class="fw-width-1-3 preview__item">\n                                <div class="uploaded-image-box upload-photo-box fw-box-proportional-100">\n                                    <img alt="" src="' + src + '"\n                                         class="fw-border-radius-5 fw-width-1-1"/>\n                                    <a href="#' + index + '" class="preview__remove"><i class="uploaded-image-delete"></i></a>\n                                </div>\n                            </div>';
                    /*return '<div class="fw-width-1-6 preview__item">' +
                     '<div class="fw-width-1-1 fw-box-proportional-100 preview__thumb"><div class="fw-height-1-1 fw-width-1-1">' +
                     '<img src="' + src + '" alt="" class="fw-img-cover fw-border-radius-5">' +
                     '<a href="#' + index + '" class="fw-absolute fw-absolute-top-right fw-mt-inverse-10 fw-mr-inverse-10 preview__remove"><i class="icon icon-trash"></i></a>' +
                     '</div></div></div>';*/
                };

                var renderFiles = function renderFiles() {
                    var $imagePreviewBox = $('#image-drop-box__preview');
                    var templates = [];

                    if (imageList.length) {
                        for (var i = 0; i < imageList.length; i++) {
                            var imageListSrc = imageList[i];

                            templates.push(renderTemplate(imageListSrc, i));

                            $imagePreviewBox.children('.preview__item').remove();
                            $imagePreviewBox.append(templates.join(''));
                        }
                    }
                };

                $(this.doc).on('click', '.preview__remove', function (e) {
                    e.preventDefault();
                    showPreloader();

                    var $removeImage = $(this);
                    var index = parseInt($removeImage.attr('href').replace('#', ''));

                    if (index > 0) {
                        imageList.splice(index, 1);
                        imageFilesList.splice(index, 1);
                    } else {
                        imageList.shift();
                        imageFilesList.shift();
                    }
                    checkImageDropBox();
                    setTimeout(function () {
                        renderFiles();
                        hidePreloader();
                        $removeImage.closest('.preview__item').remove();
                    }, 300);
                });

                input.addEventListener('change', function () {
                    var currentFiles = this.files;
                    var currentFilesLength = currentFiles.length;

                    if (currentFilesLength) {
                        showPreloader();

                        var _loop = function _loop(i) {
                            var reader = new FileReader();

                            reader.onload = function (e) {
                                imageList.push(e.target.result);
                                imageFilesList.push(currentFilesLength[i]);
                                checkImageDropBox();

                                if (i === currentFilesLength - 1) {
                                    setTimeout(function () {
                                        renderFiles();
                                        hidePreloader();
                                    }, 300);
                                }
                            };

                            reader.readAsDataURL(currentFiles[i]);
                        };

                        for (var i = 0; i < currentFilesLength; i++) {
                            _loop(i);
                        }
                    }
                });
            }
        }
    }, {
        key: 'voteTrigger',
        value: function voteTrigger() {
            var $voteItems = $('.vote-item');
            $('.js-vote-trigger').on('click', function (e) {
                e.preventDefault();
                var $this = $(this);

                $this.addClass('active');

                $voteItems.addClass('transition');

                setTimeout(function (e) {
                    $this.removeClass('active');
                    var $timeout = 0;
                    $voteItems.each(function () {
                        var $voteItem = $(this);
                        setTimeout(function () {

                            $voteItem.addClass('animate-flip');

                            setTimeout(function () {
                                $voteItem.removeClass('animate-flip transition');
                            }, 1050);
                        }, $timeout);
                        $timeout += 300;
                    });
                }, 500);
            });
        }
    }, {
        key: 'selectBox',
        value: function selectBox(selector) {
            var selects = $(selector);

            var $selectBox = {
                init: function init() {
                    $selectBox.render();
                    $selectBox.bindings();
                },
                render: function render() {
                    selects.each(function () {
                        var $this = $(this);
                        $this.wrap('<div class="selectbox ' + $this.attr('data-classes') + '"></div>');
                        $this.after('<div class="selectbox__current"></div>');

                        $selectBox.updateCurrent($this);
                    });
                },
                bindings: function bindings() {
                    selects.on('change', function () {
                        $selectBox.updateCurrent($(this));
                    });
                },
                updateCurrent: function updateCurrent($box) {
                    var $this = $box;
                    var currentText = $this.find('option:selected').text();
                    $this.siblings('.selectbox__current').text(currentText);
                }
            };

            $selectBox.init();

            return $selectBox;
        }
    }]);

    return YOURAPPNAME;
}();

(function () {

    var app = new YOURAPPNAME(document);

    app.appLoad('loading', function () {
        console.log('App is loading... Paste your app code here.');
        // App is loading... Paste your app code here. 4example u can run preloader event here and stop it in action appLoad dom or full
    });

    app.appLoad('dom', function () {
        console.log('DOM is loaded! Paste your app code here (Pure JS code).');
        // DOM is loaded! Paste your app code here (Pure JS code).
        // Do not use jQuery here cause external libs do not loads here...

        app.initSwitcher(); // data-switcher="{target='anything'}" , data-switcher-target="anything"
    });

    app.appLoad('full', function (e) {
        app.popups();
        app.formPasswordSwitch();
        app.questionnaire('[data-questionnaire]');
        app.carousels('.owl-carousel');
        app.photosUpload();
        app.fullScreen('.main-first-screen');
        app.voteTrigger();
        app.selectBox('[data-selectbox]');
    });
})();