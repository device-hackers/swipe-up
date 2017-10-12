const path = require('path')
/*const HtmlWebpackPlugin = require('html-webpack-plugin')*/
const CopyWebpackPlugin = require('copy-webpack-plugin')
//const webpack = require('webpack')

module.exports = {
    entry: {
        demo: './src/demo/index.js'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' }
        ]
    },
    plugins: [
        //TBD:
        /*new HtmlWebpackPlugin({
            template: 'index.html'
        })*/
        new CopyWebpackPlugin([
            { from: 'index.html' },
            { from: 'src/demo' }
        ], { ignore: ['*.js'] })
        //new webpack.optimize.ModuleConcatenationPlugin()
    ]
}
