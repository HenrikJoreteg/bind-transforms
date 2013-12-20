var HumanView = require('human-view');
var HumanModel = require('human-model');
var bindTransforms = require('../bind-transforms');
var _ = require('underscore');


var View = HumanView.extend(bindTransforms).extend({
    template: '<div id="hello"></div>',
    render: function () {
        this.renderAndBind();
        this.bindTransforms({
            translateY: 'translateY',
            translateX: 'translateX',
            scale: 'scale',
            opacity: 'opacity'
        }, this.el);
    }
});


var Model = HumanModel.define({
    props: {
        translateX: ['number', true, 0],
        translateY: ['number', true, 0],
        scale: ['number', true, 1.0],
        opacity: ['number', true, 1]
    }
});

$(function () {
    var model = window.model = new Model();
    var view = new View({
        model: model
    });
    view.render();

    document.body.appendChild(view.el);

    function randomize() {
        model.set({
            scale: _.random(1, 2),
            translateY: _.random(40, 400),
            translateX: _.random(40, 400),
            opacity: Math.random()
        });
    }

    setInterval(randomize, 1500);

    randomize();

    /*
    document.onmousemove = function (e) {
        model.set({
            translateX: e.x,
            translateY: e.y
        });
    };
    */
});

