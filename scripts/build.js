var bundle = require('browserify')();
var fs = require('fs');


bundle.add('./example/app/app.js');
bundle.bundle(function (err, source) {
    if (err) console.error(err);
    fs.writeFile('./example/demo.js', source, function (err) {
        if (err) {
            throw err;
        } else {
            console.log('Built example/demo.js file');
        }
    });
});
