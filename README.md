# Hover slider

[![GitHub last commit](https://img.shields.io/github/last-commit/web-projects-lab/hover-slider?style=flat-square)](https://github.com/web-projects-lab/hover-slider/commits/master)
[![GitHub issues](https://img.shields.io/github/issues/web-projects-lab/hover-slider?style=flat-square)](https://github.com/web-projects-lab/hover-slider/issues)
[![Demo status](https://img.shields.io/website?label=live%20demo&style=flat-square&url=https%3A%2F%2Fweb-projects-lab.github.io%2Fhover-slider%2F)](https://web-projects-lab.github.io/hover-slider/)


Tiny JS-library toggle product images by hovering over product card.
Has mobile devices fallback ("touch" or "touch-end" toggling).

**No dependencies!**
**Responsive!**
**Free!**

[Live demo](https://web-projects-lab.github.io/hover-slider/)

![](docs/images/demo.png)

## Quick start
1. Place your products image into containers with `position: relative;` and make sure that image takes all container width (100%)
```css
.product-card {
    position: relative;
    width: 200px;
}
.product-card img {
    width: 100%;
}
```
2. Connect hover-slider.js to your page
```html
<script src="https://cdn.jsdelivr.net/gh/web-projects-lab/hover-slider@1.0.3/hover-slider.min.js"></script>
</body>
```
3. Add array with image-variations to img with JSON-array or comma-separated values
```html
<div class="product-card">
    <img src="images/img1.jpg"
         data-hover-slides='["images/img2.jpg", "images/img3.jpg"]'>
</div>

<div class="product-card">
    <img src="images/img1.jpg"
         data-hover-slides="images/img2.jpg, images/img3.jpg, images/img4.jpg">
</div>
```

4. (optional) You can include css from `hover-slider-indicator.css` to show bullets:

## Options

| option        | default | variants      | description                                         |
|:--------------|:--------|:--------------|:----------------------------------------------------|
| touch         | "move"  | "move", "end" | Slides toggle while touch moving or after swipe end |
| infinite      | true    | boolean       | Start over when "touch end" happens on last slide   |
| autostart     | true    | boolean       | Init sliders when library loaded                    |
| preloadImages | false   | boolean       | Preload slides images with init                     |
| preventScroll | false   | boolean       | Does need to lock page scrolling when drag image (on touch devices) |
| hideOneDot    | true    | boolean       | Does need to hide dots when less than two slides    |

### Options defining variants
1. You can define options globally before attaching library:
```javascript
window['hoverSliderOptions'] = {};
```

2. Define options for specific gallery with `data-options` attribute
```html
<div class="product-card">
    <img src="images/img1.jpg"
         data-hover-slides='["images/img2.jpg", "images/img3.jpg"]'
         data-options='{"touch": "end" }'>
</div>
```

3. If option `autostart` set to `false` you can define options globally with passing options to `init({})` method before calling `prepareMarkup()`.
```javascript
hoverSlider.init({});
hoverSlider.prepareMarkup();
```

## API
1. New products on your website appears on page after slider init? (Lazy loading)
Just call `hoverSlider.prepareMarkup()` to attach slider to new elements.

**Tip**. If option `autostart` set to `false` calling this method will launch all sliders.  
**Tip 2**. Passing **img** element allows to launch specific slider only.


## Events

There is no events to listen at current version. If you need one, please create an issue.
