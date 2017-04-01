var path = require('path');
module.exports = {
    entry: './public/ts_js/demo.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'public/ts_js')
    }
};