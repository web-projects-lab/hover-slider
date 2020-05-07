"use strict";

/**
 * Hover slider v0.1.0
 * (c) 2020 A. Rizhenkov
 * Released under the MIT License.
 * https://github.com/web-projects-lab/hover-slider
 */

(function () {
    const hs = {
        options: {
            touch: "move",
            infinite: true,
        },

        i: 0,

        touchStartX: null,
        touchChangeUnify(e) {
            return e.changedTouches ? e.changedTouches[0] : e
        },
        touchStartHandler(e) {
            hs.touchStartX = hs.touchChangeUnify(e).clientX
        },
        touchEndHandler(e) {
            if (hs.touchStartX || hs.touchStartX === 0) {
                let deltaX = hs.touchChangeUnify(e).clientX - hs.touchStartX, s = Math.sign(deltaX);

                hs.touchStartX = null;
                if (s === 0) return;

                const baseImgWrapper = this;
                const imagesToggler = baseImgWrapper.querySelector('.hover-slider-images-toggler');

                const imgEl = baseImgWrapper.querySelector('img[data-hover-slides]');

                const currentSliderIndicator = baseImgWrapper.querySelector('.hover-slider-indicator');
                const activeDot = currentSliderIndicator.querySelector('.active');
                let nextDot = null;

                if (s > 0) { // swipe from left to right
                    nextDot = activeDot.previousElementSibling;
                    if (!nextDot && hs.getOption(imgEl, 'infinite')) {
                        // if no previous slide - get last
                        nextDot = currentSliderIndicator.querySelector('div.hover-slider-indicator-dot:last-of-type');
                    }
                } else {
                    nextDot = activeDot.nextElementSibling;
                    if (!nextDot && hs.getOption(imgEl, 'infinite')) {
                        // if no next slide - get first
                        nextDot = currentSliderIndicator.querySelector('div.hover-slider-indicator-dot:first-of-type');
                    }
                }

                if (nextDot) {
                    activeDot.classList.remove('active');

                    nextDot.classList.add('active');

                    const i = nextDot.dataset.hoverSliderI;
                    const togglePane = imagesToggler.querySelector(`div[data-hover-slider-i="${i}"]`);

                    imgEl.setAttribute('src', togglePane.dataset.hoverSliderImage)
                }
            }
        },

        togglePaneEnterListener(e, inputPane = null) {
            const togglePane = inputPane || this;

            const imgEl = togglePane.parentElement.parentElement.querySelector('img[data-hover-slides]');
            imgEl.setAttribute('src', togglePane.dataset.hoverSliderImage)
            const i = togglePane.dataset.hoverSliderI;
            const currentSliderIndicator = togglePane.parentElement.parentElement.querySelector('.hover-slider-indicator');
            const activeDot = currentSliderIndicator.querySelector('.active');
            activeDot.classList.remove('active');

            const nextDot = currentSliderIndicator.querySelector(`.hover-slider-indicator-dot[data-hover-slider-i="${i}"]`);
            nextDot.classList.add('active');

        },

        createElement(code, params = {}) {
            let element = null;
            switch (code) {
                case "imagesToggler":
                    element = document.createElement('div');
                    element.classList.add('hover-slider-images-toggler');
                    element.style.position = 'absolute';
                    element.style.top = '0';
                    element.style.right = '0';
                    element.style.bottom = '0';
                    element.style.left = '0';
                    element.style.display = 'flex';
                    break;
                case "togglePane":
                    element = document.createElement('div');
                    element.classList.add('hover-slider-toggle-pane');
                    element.style.flexGrow = '1';

                    element.dataset.hoverSliderImage = params.slideSrc;
                    element.dataset.hoverSliderI = hs.i;
                    element.addEventListener('mouseenter', hs.togglePaneEnterListener, false);
                    break;
                case "sliderIndicator":
                    element = document.createElement('div');
                    element.classList.add('hover-slider-indicator');
                    break;
                case "indicatorDot":
                    element = document.createElement('div');
                    element.dataset.hoverSliderI = hs.i;
                    element.classList.add('hover-slider-indicator-dot');
                    if (params.active) {
                        element.classList.add('active');
                    }
                    break;
            }

            return element;
        },

        getOption(baseImgEl, option) {
            let currentSliderOptions = {...hs.options};

            if (baseImgEl.dataset.options) {
                currentSliderOptions = Object.assign(currentSliderOptions, JSON.parse(baseImgEl.dataset.options));
            }

            return currentSliderOptions[option];
        },

        prepareMarkup() {
            const wantsSliders = document.querySelectorAll('img[data-hover-slides]:not(.hover-slider-init)');
            wantsSliders.forEach(function (imgEl) {

                const wrapEl = imgEl.parentElement;

                let slides = [];
                slides.push(imgEl.getAttribute('src'));

                const slidesText = imgEl.dataset.hoverSlides;

                try {
                    slides = slides.concat(JSON.parse(slidesText));

                } catch (e) {
                    slides = slides.concat(slidesText.split(','));
                }

                slides = slides.map(function (one) {
                    return one.trim()
                });

                const imagesToggler = hs.createElement('imagesToggler');
                const sliderIndicator = hs.createElement('sliderIndicator');

                slides.forEach(function (slideSrc, key) {
                    hs.i++;

                    imagesToggler.append(hs.createElement('togglePane', {
                        slideSrc: slideSrc
                    }));

                    sliderIndicator.append(hs.createElement('indicatorDot', {
                        active: (key === 0)
                    }));
                });

                if (getComputedStyle(wrapEl).position !== 'relative') {
                    wrapEl.style.position = 'relative';
                }

                if (hs.getOption(imgEl, 'touch') === 'move') {
                    wrapEl.addEventListener('touchmove', e => {

                        const touch = e.touches[0];
                        const overElement = document.elementFromPoint(touch.clientX, touch.clientY);
                        if (overElement && overElement.classList.contains('hover-slider-toggle-pane')) {
                            hs.togglePaneEnterListener(e, overElement);
                        }

                        e.preventDefault()
                    }, false);
                }
                if (hs.getOption(imgEl, 'touch') === 'end') {
                    wrapEl.addEventListener('touchstart', hs.touchStartHandler, false);
                    wrapEl.addEventListener('touchend', hs.touchEndHandler, false);
                    wrapEl.addEventListener('touchmove', e => {
                        e.preventDefault()
                    }, false);
                }

                wrapEl.prepend(sliderIndicator);
                wrapEl.prepend(imagesToggler);
                imgEl.classList.add('hover-slider-init');
            })
        },

        init() {
            if (window['hoverSliderOptions']) {
                hs.options = Object.assign(hs.options, window['hoverSliderOptions']);
            }
            this.prepareMarkup();
            return this;
        }
    }
    window.hoverSlider = hs.init();
})();