var transformStyle = require('transform-style');


function isModel(model) {
    return typeof model.initialize === 'function';
}

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
        var el = args[2];
        var disableTranslateZ = args[3];

        // other vars
        var re = /\D/;
        var keys = [];
        var opacityKey;

        for (var item in bindings) {
            if (bindings[item] === 'opacity') {
                opacityKey = item;
            } else {
                keys.push(item);
            }
        }
        var changeString = keys.map(function (key) {
            return 'change:' + bindings[key];
        }).join(' ');

        // builds CSS string for transforms
        function getValueString() {
            return keys.map(function (key) {
                var val = model.get(bindings[key]);
                // assume px if no non-digits and we're doing transforms
                if (!re.test(val) && key.indexOf('translate') !== -1) val += 'px';
                return key + '(' + val + ')';
            }).join(' ');
        }

        // apply styles
        function setStyle() {
            transformStyle(el, getValueString() + (disableTranslateZ ? '' : ' translateZ(0)'));
            if (opacityKey) el.style.opacity = model.get(opacityKey);
        }

        // register handler
        this.listenTo(this.model, changeString, setStyle);

        // run it once immediately
        setStyle();
    }
};
