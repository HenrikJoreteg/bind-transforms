var HumanModel = require('human-model');


module.exports = HumanModel.define({
    props: {
        x: ['number', true, 75],
        y: ['number', true, 75],
        windowWidth: 'number',
        windowHeight: 'number'
    },
    derived: {
        xTotal: {
            deps: ['x'],
            fn: function () {
                return this.x - 75;
            }
        },
        yTotal: {
            deps: ['y', 'windowHeight'],
            fn: function () {
                var y = this.y - 75;
                var maxHeight = this.windowHeight - 200;
                return Math.min(y, maxHeight);
            }
        },
        opacity: {
            deps: ['y'],
            fn: function () {
                var calculated = 1 - this.y / this.windowHeight;
                return Math.max(calculated, 0.2);
            }
        }
    }
});
