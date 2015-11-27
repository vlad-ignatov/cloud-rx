/* global __dirname */
var path = require('path');

module.exports = {
    entry: {
        'client/www/index.js': './client/src/components/index.jsx'
    },
    output: {
        // path         : path.join(__dirname, 'dst'),
        filename     : '[name]'//,
        // libraryTarget: 'commonjs2'
    },
    // devtool: 'cheap-module-eval-source-map',
    // ignore: [
    // //     'app',
    //     "**/node_modules/**/*.*"
    // ],
    module: {
        loaders: [
            {
                test   : /\.jsx?$/,
                exclude: /node_modules/,
                // loaders: ["babel?presets[]=es2015&presets[]=react&presets[]=stage-0"]
                loaders: ["babel?stage=0"]
            },
            {
                test   : /\.less$/,
                exclude: /node_modules/,
                loaders: [
                    'style-loader',
                    'css-loader',
                    'less-loader'
                ]
            },
            // {
            //     test: /\.woff$/,
            //     loader: 'url?limit=100000'
            // }
            {
                test : /\.css$/,
                // exclude: /node_modules/,
                loaders: [
                    'style-loader',
                    'css-loader'
                ]
            }
        ]
    },
    externals : {
        'react'     : 'React',
        'react-dom' : 'ReactDOM',
        'jquery'    : 'jQuery'
    },
    resolve : {
        extensions : [ '', '.js', '.jsx' ]//,
        // packageMains: ['webpack', 'browser', 'web', 'browserify', ['jam', 'main'], 'main']
    }//,
    // plugins: [ 'syntax-jsx' ]
};
