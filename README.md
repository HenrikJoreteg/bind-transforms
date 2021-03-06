# bind-transforms

Browser module for binding backbone or human-model properties to properly prefixed CSS3 transforms on an element.

It's meant to be used as a mixin for Backbone.View or [human-view](http://github.com/henrikjoreteg/human-view).

It's structured for use with browserify and installed with npm.


## installing

```js
npm install bind-transforms
```

## example

```js
var HumanView = require('human-view');
var HumanModel = require('human-model');
var bindTransforms = require('bind-transforms');


// **note** we're mixing in `bindTransforms` into the
// view here:
var View = HumanView.extend(bindTransforms).extend({
    template: '<div id="hello"></div>',
    render: function () {
        this.renderAndBind();
        
        // here we register our transform bindings
        // anything you list here will become part 
        // of the string used to describe the transform
        this.bindTransforms({
            translateY: 'yPos',
            translateX: 'xPos',
            scale: 'scale'
        }, this.el);
    }
});

// this could be backbone model too
var Model = HumanModel.define({
    props: {
        xPos: ['number', true, 0],
        yPos: ['number', true, 0],
        scale: ['number', true, 1.0]
    }
});
```

## why do this?

I wanted to be able to do something like `model.xPos = 2` and have it properly applied to a view without also squashing the `translateY` that I may already have set. Since, in CSS each of those (scale and translate) are both set as transforms on the same line, that was challenging. It also requires properly prefixing and then building and setting the full style string an element. By having a model that holds those values in simple formats that I can control (usually just a number). We don't have to worry about re-building that string each time, we can simply make the minimal adjustment to the model's values and the rest of the transforms will still be maintained.


## demo

There's a simple demo page set up here: http://projects.joreteg.com/bind-transforms

It's running the app in the `example` folder.


## more details

**arguments: (bindingObject, element, disableZTransform)**
**or
**arguments: (model, bindingObject, element, disableZTransform)**

You can optionally pass a specific model as the first argument. If you don't then `this.model` is used.

The `bindingObject` is a simple object containing the model properties (as keys) and the corresponding transforms as values. Each key in the object will be included in the built CSS transform string each time, thereby maintaining previous transform values even for properties that were not changed.

The last argument is for disabling automatically applying `translateZ(0)` at the end of the CSS string. We do this by default because it invokes the GPU (you can read more on this here: http://aerotwist.com/blog/on-translate3d-and-layer-creation-hacks/). The assumption being that if you're using transforms you're probably doing so looking for better performance.


## a note on binding other things

Your binding object *can include bindings to opacity*. Opacity is one of the known properties that is known to be computationally inexpensive to animate, it's not a CSS `transform` property, but this lib handles that as well, allowing you to bind opacity as well, without any extra code.

You can also bind a few other non-transform properties for convenience. Specifically:

```js
var nonTransformKeys = [
    'zIndex',
    'opacity',
    'top',
    'bottom',
    'left',
    'right',
    'width',
    'height',
    'backgroundColor'
];
```

## changelog

- 1.2.0 [diff](https://github.com/HenrikJoreteg/bind-transforms/compare/v1.1.1...v1.2.0) - Adding ability to bind `color` too.
- 1.1.1 [diff](https://github.com/HenrikJoreteg/bind-transforms/compare/v1.1.0...v1.1.1) - Fix regex to allow "." in tests for whether to assume pixels or degrees.
- 1.1.0 [diff](https://github.com/HenrikJoreteg/bind-transforms/compare/v1.0.2...v1.1.0) - Properly adds `px` as default unit for non-transform css props if not specified. Adds forgotten `height` property to the list of bindable "regular" properties.
- 1.0.2 [diff](https://github.com/HenrikJoreteg/bind-transforms/compare/v1.0.1...v1.0.2) - Fixes bug where it broke if you bind to passed in a model instead of using `this.model`
- 1.0.1 [diff](https://github.com/HenrikJoreteg/bind-transforms/compare/v1.0.0...v1.0.1) - Fixes bug with non-transform css bindings. Key and value references were inverted.
- 1.0.0 - Bugfixes, ability to bind a few animation friendly non-transform properties as well.

## credits

If you like this, follow [@HenrikJoreteg](http://twitter.com/henrikjoreteg) on twitter. Or if you want to learn more about how we build client side applications at [&yet](http://andyet.com) check out my book: [Human JavaScript](http://humanjavascript.com).

## license

MIT
