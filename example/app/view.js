var HumanView = require('human-view');
var bindTransforms = require('../../bind-transforms');


module.exports = HumanView.extend(bindTransforms).extend({
    template: '<div id="colorsquare"></div>',
    render: function () {
        this.renderAndBind();
        this.bindTransforms({
            translateY: 'yTotal',
            translateX: 'xTotal',
            opacity: 'opacity'
        }, this.el);
    }
});
