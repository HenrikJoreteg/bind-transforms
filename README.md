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
            yPos: 'translateY',
            xPos: 'translateX',
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

I wanted to be able to do something like `model.scale = 2` and have it properly applied to a view without also squashing the `translateY` that I may already have set. Since, in CSS each of those (scale and translate) are both set as transforms on the same line, that was challenging. It also requires properly prefixing and then building and setting the full style string an element. By having a model that holds those values in simple formats that I can control (usually just a number). We don't have to worry about re-building that string each time, we can simply make the minimal adjustment to the model's values and the rest of the transforms will still be maintained.


## more details

**arguments: (bindingObject, element, disableZTransform)**
**or
**arguments: (model, bindingObject, element, disableZTransform)**

You can optionally pass a specific model as the first argument. If you don't then `this.model` is used.

The `bindingObject` is a simple object containing the model properties (as keys) and the corresponding transforms as values. Each key in the object will be included in the built CSS transform string each time, thereby maintaining previous transform values even for properties that were not changed.

The last argument is for disabling automatically applying `translateZ(0)` at the end of the CSS string. We do this by default because it invokes the GPU (you can read more on this here: http://aerotwist.com/blog/on-translate3d-and-layer-creation-hacks/). The assumption being that if you're using transforms you're probably doing so looking for better performance.


## a note on binding opacity

Your binding object *can include bindings to opacity*. Opacity is one of the known properties that is known to be computationally inexpensive to animate, it's not a CSS `transform` property, but this lib handles that as well, allowing you to bind opacity as well, without any extra code.


## credits

If you like this, follow [@HenrikJoreteg](http://twitter.com/henrikjoreteg) on twitter. Or if you want to learn more about how we build client side applications at [&yet](http://andyet.com) check out my book: [Human JavaScript](http://humanjavascript.com).

## license

MIT
