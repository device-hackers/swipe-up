const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
//const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')

module.exports = {
    entry: {
        demo: './src/demo/index.js',
        'swipe-up': './src/swipe-up/index.js'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
        library: 'SwipeUp',
        libraryTarget: 'umd'
    },
    module: {
        rules: [
            { test: /\.js$/, exclude: /node_modules/, use: {
                loader: 'babel-loader',
                options: {
                    babelrc: false,
                    //presets: ['env'],
                    //below is everything from preset 'env' except module-transformations,
                    //so that ModuleConcatenationPlugin do its job
                    //and so Cucumber still has Babel transformations via .babelrc
                    plugins: [
                        'check-es2015-constants',
                        'syntax-trailing-function-commas',
                        'transform-async-to-generator',
                        'transform-es2015-arrow-functions',
                        'transform-es2015-block-scoped-functions',
                        'transform-es2015-block-scoping',
                        'transform-es2015-classes',
                        'transform-es2015-computed-properties',
                        'transform-es2015-destructuring',
                        'transform-es2015-duplicate-keys',
                        'transform-es2015-for-of',
                        'transform-es2015-function-name',
                        'transform-es2015-literals',
                        'transform-es2015-object-super',
                        'transform-es2015-parameters',
                        'transform-es2015-shorthand-properties',
                        'transform-es2015-spread',
                        'transform-es2015-sticky-regex',
                        'transform-es2015-template-literals',
                        'transform-es2015-typeof-symbol',
                        'transform-es2015-unicode-regex',
                        'transform-exponentiation-operator',
                        'transform-regenerator',
                    ],
                }
            } }
        ]
    },
    plugins: [
        new CopyWebpackPlugin([
            { from: 'index.html' },
            { from: 'src/demo' }
        ])
        //TBD:
        /*, new HtmlWebpackPlugin({
            template: 'index.html'
        })*/
        //https://stackoverflow.com/questions/45384170/how-to-fix-modules-with-moduleconcatenation-bailout-module-is-not-an-ecmascrip
        , new webpack.optimize.ModuleConcatenationPlugin()
    ],
    stats: {
        maxModules: Infinity,
        optimizationBailout: true
    }
}