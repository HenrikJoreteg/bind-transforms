var transformStyle = require('transform-style');


function isModel(model) {
    return typeof model.initialize === 'function';
}

// Other bindings we want to support similarly even though
// they're not transforms.
var nonTransformKeys = [
    'backgroundColor',
    'bottom',
    'color',
    'height',
    'left',
    'opacity',
    'right',
    'top',
    'width',
    'zIndex'
];

var defaultToPixels = [
    'top',
    'bottom',
    'left',
    'right',
    'width',
    'height',
    'perspective',
    'translateX',
    'translateY',
    'translateZ'
];

var defaultToDegrees = [
    'rotateX',
    'rotateY',
    'rotateZ',
    'skewX',
    'skewY'
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
        var re = /^[\d\-\.]+$/;
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

        function addDefaultUnits(val, property) {
            // if it already has a unit, skip it
            if (!re.test(val)) return val;

            if (defaultToPixels.indexOf(property) !== -1) {
                return val + 'px';
            } else if (defaultToDegrees.indexOf(property) !== -1) {
                return val + 'deg';
            } else {
                return val;
            }
        }

        // builds CSS string for transforms
        function getTransformString() {
            return keys.map(function (key) {
                var val = model.get(bindings[key]);
                // assume px if no non-digits and we're doing transforms
                return key + '(' + addDefaultUnits(val, key) + ')';
            }).join(' ');
        }

        // apply styles
        function setStyle() {
            transformStyle(el, getTransformString() + (disableTranslateZ ? '' : ' translateZ(0)'));
            cssKeys.forEach(function (key) {
                el.style[key] = addDefaultUnits(model.get(bindings[key]), key);
            });
        }

        // register handler
        this.listenTo(model, changeString, setStyle);

        // run it once immediately
        setStyle();
    }
};
