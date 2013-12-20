var bundle = require('browserify')();
var fs = require('fs');
//var uglify = require('uglify-js');


bundle.add('./test/app.js');
bundle.bundle(function (err, source) {
    if (err) console.error(err);
    fs.writeFile('./test/demo.js', source, function (err) {
        if (err) {
            throw err;
        } else {
            console.log('Built test/demo.js file');
        }
    });
});
