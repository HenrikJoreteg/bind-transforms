var transformStyle = require('transform-style');


function isModel(model) {
    return typeof model.initialize === 'function';
}

// Other bindings we want to support similarly even though
// they're not transforms.
var nonTransformKeys = [
    'zIndex',
    'opacity',
    'top',
    'bottom',
    'left',
    'right',
    'width',
    'backgroundColor'
];

module.exports = {
    /*
        takes arguments in either of the following arguments:

        `function (model, bindings, el, disableTranslateZ) {`
        or
        `function (bindings, el, disableTranslateZ) {`

        In which case `this.model` is inferred.
    */
    bindTransforms: function () {
        // convert to array
        var args = Array.prototype.slice.call(arguments);

        // if we don't have a model as first arg, add it in
        if (!isModel(args[0])) {
            args.unshift(this.model);
        }

        // name our arguments
        var model = args[0];
        var bindings = args[1];
        var el = args[2] || this.el;
        var disableTranslateZ = args[3];

        // other vars
        var re = /^[\d\-]+$/;
        var cssKeys = [];
        var keys = [];
        var opacityKey, zIndexKey;

        // handle special cases
        for (var item in bindings) {
            if (nonTransformKeys.indexOf(item) !== -1) {
                cssKeys.push(item);
            } else {
                keys.push(item);
            }
        }

        var changeString = cssKeys.concat(keys).map(function (key) {
            return 'change:' + bindings[key];
        }).join(' ');

        // builds CSS string for transforms
        function getTransformString() {
            return keys.map(function (key) {
                var val = model.get(bindings[key]);
                // assume px if no non-digits and we're doing transforms
                if (re.test(val) && key.indexOf('translate') !== -1) val += 'px';
                return key + '(' + val + ')';
            }).join(' ');
        }

        // apply styles
        function setStyle() {
            transformStyle(el, getTransformString() + (disableTranslateZ ? '' : ' translateZ(0)'));
            cssKeys.forEach(function (key) {
                el.style[key] = model.get(bindings[key]);
            });
        }

        // register handler
        this.listenTo(this.model, changeString, setStyle);

        // run it once immediately
        setStyle();
    }
};
