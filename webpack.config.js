var path = require('path');

/*
    to bundle up public/ts, uncomment first module.export
    and comment out second one.
    then run the following command: % npm run build2

    to bundle up public/ts_compact, comment first module.export
    and uncomment out second one.
    then run the following command: % npm run build
*/

module.exports = {
    entry: './public/ts/ts_js/demo.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'public/ts/ts_js')
    }
};


//module.exports = {
//    entry: './public/ts_compact/ts_js/demo.js',
//    output: {
//        filename: 'bundle.js',
//        path: path.resolve(__dirname, 'public/ts_compact/ts_js')
//    }
//};