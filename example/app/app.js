var _ = require('underscore');
var Model = require('./model');
var View = require('./view');


$(function () {
    // This handler just takes touch/mouse position
    // and set it as x/y on the model.

    // Nothing else is being directly manipulated
    function setPosition(e) {
        model.set({
            x: e.pageX || e.x,
            y: e.pageY || e.y
        });
        // still allow link clicks
        if (e.target.tagName === 'A' && e.type !== 'mousemove') {
            window.location = e.target.href;
        } else {
            e.preventDefault();
        }
    };

    // we use this handler for all the stuff
    document.onmousemove = setPosition;
    document.ontouchmove = setPosition;
    document.ontouchstart = setPosition;

    // create an instance of our model and set our window width/height
    var model = window.model = new Model({
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight
    });

    // create/render our view
    var view = new View({
        model: model
    });
    view.render();

    // append view to the dom
    document.body.appendChild(view.el);
});

