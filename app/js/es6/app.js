class YOURAPPNAME {

    constructor(doc) {
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
    appLoad(type, callback) {
        const _self = this;

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
    };

    // Detect scroll default scrollBar width (return a number)
    scrollBarWidth() {
        const _self = this;
        const outer = _self.doc.createElement("div");

        outer.style.visibility = "hidden";
        outer.style.width = "100px";
        outer.style.msOverflowStyle = "scrollbar";

        _self.body.appendChild(outer);

        const widthNoScroll = outer.offsetWidth;

        outer.style.overflow = "scroll";

        const inner = _self.doc.createElement("div");

        inner.style.width = "100%";
        outer.appendChild(inner);

        const widthWithScroll = inner.offsetWidth;

        outer.parentNode.removeChild(outer);

        return widthNoScroll - widthWithScroll;
    };

    initSwitcher() {
        const _self = this;

        const switchers = _self.doc.querySelectorAll('[data-switcher]');

        if (switchers && switchers.length > 0) {
            for (let i = 0; i < switchers.length; i++) {
                const switcher = switchers[i],
                    switcherOptions = _self.options(switcher.dataset["switcher"]),
                    switcherElems = switcher.children,
                    switcherTargets = _self.doc.querySelector('[data-switcher-target="' + switcherOptions.target + '"]').children,
                    switchersActive = [];

                for (let y = 0; y < switcherElems.length; y++) {
                    const switcherElem = switcherElems[y],
                        parentNode = switcher.children,
                        switcherTrigger = (switcherElem.children.length) ? switcherElem.children[0] : switcherElem,
                        switcherTarget = switcherTargets[y];


                    if (switcherElem.classList.contains('active')) {
                        for (let z = 0; z < parentNode.length; z++) {
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
                                for (let z = 0; z < elem.parentNode.children.length; z++) {
                                    elem.parentNode.children[z].classList.remove('active');
                                    targets[z].classList.remove('active');
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
    };

    str2json(str, notevil) {
        try {
            if (notevil) {
                return JSON.parse(str
                    .replace(/([\$\w]+)\s*:/g, function (_, $1) {
                        return '"' + $1 + '":';
                    })
                    .replace(/'([^']+)'/g, function (_, $1) {
                        return '"' + $1 + '"';
                    })
                );
            } else {
                return (new Function("", "const json = " + str + "; return JSON.parse(JSON.stringify(json));"))();
            }
        } catch (e) {
            return false;
        }
    };

    options(string) {
        const _self = this;

        if (typeof string !== 'string') return string;

        if (string.indexOf(':') !== -1 && string.trim().substr(-1) !== '}') {
            string = '{' + string + '}';
        }

        const start = (string ? string.indexOf("{") : -1);
        let options = {};

        if (start !== -1) {
            try {
                options = _self.str2json(string.substr(start));
            } catch (e) {
            }
        }

        return options;
    };

    formPasswordSwitch() {
        $('.js-password-detector').on('click', function (e) {
            const $this = $(this);
            const $input = $this.siblings('input');

            if ($input.attr('type') === 'password')
                $input.attr('type', 'text');
            else
                $input.attr('type', 'password');
        });
    }

    popups(options) {
        const _self = this;

        const defaults = {
            reachElementClass: '.js-popup',
            closePopupClass: '.js-close-popup',
            currentElementClass: '.js-open-popup',
            changePopupClass: '.js-change-popup'
        };

        options = $.extend({}, options, defaults);

        const plugin = {
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
                const pop = $(this).attr('data-popup-target');
                plugin.openPopup(pop);
            });

            plugin.closePopupEl.on('click', function (e) {
                let pop;
                if (this.hasAttribute('data-popup-target')) {
                    pop = $(this).attr('data-popup-target');
                } else {
                    pop = $(this).closest(options.reachElementClass).attr('data-popup');
                }

                plugin.closePopup(pop);
            });

            plugin.changePopupEl.on('click', function (e) {
                const closingPop = $(this).attr('data-closing-popup');
                const openingPop = $(this).attr('data-opening-popup');

                plugin.changePopup(closingPop, openingPop);
            });

            plugin.reachPopups.on('click', function (e) {
                const target = $(e.target);
                const className = options.reachElementClass.replace('.', '');
                if (target.hasClass(className)) {
                    plugin.closePopup($(e.target).attr('data-popup'));
                }
            });
        };

        if (options)
            plugin.init();

        return plugin;
    };

    questionnaire(selector) {
        let $selector = $(selector),
            $button = $selector.find('[data-questionnaire-show]'),
            $container = $selector.find('[data-questionnaire-height]');

        $button.on('click', function (e) {
            e.preventDefault();
            let height = $container.outerHeight();
            $selector.css({height: height}).addClass('visible-active');
            setTimeout(function () {
                $selector.css({height: 'auto'});
            }, 300)
        })
    }

    carousels(selector) {
        const $carousels = $(selector);

        $carousels.each(function () {
            let $this = $(this);
            let Vthis = this;

            $this.owlCarousel({
                autoWidth: Vthis.hasAttribute('data-auto-width'),
                nav: false,
                dots: false,
                margin: Vthis.hasAttribute('data-margin') ? parseInt(Vthis.getAttribute('data-margin')) : 0,
                loop: Vthis.hasAttribute('data-loop')
            })
        });
    }

    fullScreen(selector) {
        $(selector).css({height: $(window).outerHeight() - 50});

        /*$(window).resize(() => {
         $(selector).css({height: $(window).outerHeight()-50});
         });*/
    }

    photosUpload() {
        const $imageDropBox = $('#image-drop-box');

        if ($imageDropBox.length) {
            const imageList = [];
            const imageFilesList = [];
            const imageDropBoxLoadingClass = 'image-drop-box-loading';
            const imageDropBoxHasFilesClass = 'image-drop-box-has-file';

            const input = this.doc.getElementById('image-drop-box__files');

            const showPreloader = () => {
                $imageDropBox.addClass(imageDropBoxLoadingClass);
            };

            const hidePreloader = () => {
                setTimeout(function () {
                    $imageDropBox.removeClass(imageDropBoxLoadingClass);
                }, 300);
            };

            const checkImageDropBox = () => {
                (imageList.length) ? $imageDropBox.addClass(imageDropBoxHasFilesClass) : $imageDropBox.removeClass(imageDropBoxHasFilesClass);
            };

            const renderTemplate = (src, index) => {
                return `<div class="fw-width-1-3 preview__item">
                                <div class="uploaded-image-box upload-photo-box fw-box-proportional-100">
                                    <img alt="" src="${src}"
                                         class="fw-border-radius-5 fw-width-1-1"/>
                                    <a href="#${index}" class="preview__remove"><i class="uploaded-image-delete"></i></a>
                                </div>
                            </div>`;
                /*return '<div class="fw-width-1-6 preview__item">' +
                 '<div class="fw-width-1-1 fw-box-proportional-100 preview__thumb"><div class="fw-height-1-1 fw-width-1-1">' +
                 '<img src="' + src + '" alt="" class="fw-img-cover fw-border-radius-5">' +
                 '<a href="#' + index + '" class="fw-absolute fw-absolute-top-right fw-mt-inverse-10 fw-mr-inverse-10 preview__remove"><i class="icon icon-trash"></i></a>' +
                 '</div></div></div>';*/
            };

            const renderFiles = () => {
                const $imagePreviewBox = $('#image-drop-box__preview');
                let templates = [];

                if (imageList.length) {
                    for (let i = 0; i < imageList.length; i++) {
                        const imageListSrc = imageList[i];

                        templates.push(renderTemplate(imageListSrc, i));

                        $imagePreviewBox.children('.preview__item').remove();
                        $imagePreviewBox.append(templates.join(''));
                    }
                }
            };

            $(this.doc).on('click', '.preview__remove', function (e) {
                e.preventDefault();
                showPreloader();

                const $removeImage = $(this);
                const index = parseInt($removeImage.attr('href').replace('#', ''));

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
                const currentFiles = this.files;
                const currentFilesLength = currentFiles.length;

                if (currentFilesLength) {
                    showPreloader();

                    for (let i = 0; i < currentFilesLength; i++) {
                        const reader = new FileReader();

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
                    }
                }
            });
        }
    };

    voteTrigger() {
        const $voteItems = $('.vote-item');
        $('.js-vote-trigger').on('click', function (e) {
            e.preventDefault();
            const $this = $(this);

            $this.addClass('active');

            $voteItems.addClass('transition');

            setTimeout(function (e) {
                $this.removeClass('active');
                let $timeout = 0;
                $voteItems.each(function () {
                    const $voteItem = $(this);
                    setTimeout(function () {

                        $voteItem.addClass('animate-flip');

                        setTimeout(function () {
                            $voteItem.removeClass('animate-flip transition');
                        }, 1050);
                    }, $timeout);
                    $timeout += 300;
                })

            }, 500);
        });
    }

    selectBox(selector) {
        const selects = $(selector);

        const $selectBox = {
            init() {
                $selectBox.render();
                $selectBox.bindings();
            },
            render() {
                selects.each(function () {
                    const $this = $(this);
                    $this.wrap(`<div class="selectbox"></div>`);
                    $this.after(`<div class="selectbox__current"></div>`);

                    $selectBox.updateCurrent($this);
                });
            },
            bindings() {
                selects.on('change', function() {
                    $selectBox.updateCurrent($(this));
                });
            },
            updateCurrent($box) {
                const $this = $box;
                const currentText = $this.find('option:selected').text();
                $this.siblings('.selectbox__current').text(currentText);
            }
        };

        $selectBox.init();

        return $selectBox;
    }
}

(function () {

    const app = new YOURAPPNAME(document);

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
