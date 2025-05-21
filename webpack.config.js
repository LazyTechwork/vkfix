const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const VueLoaderPlugin = require('vue-loader').VueLoaderPlugin;

module.exports = {
    entry: './src/index.ts',
    mode: "development",
    optimization: {
        minimize: false,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    output: {
                        comments: /(\s@|UserScript==)/i,
                    },
                }
            })
        ]
    },
    output: {
        filename: 'vkfix.user.js',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: {
                    loader: "ts-loader",
                    options: {
                        transpileOnly: true,
                        appendTsSuffixTo: [/\.vue$/]
                    }
                }
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    "style-loader",
                    "css-loader",
                    "sass-loader",
                ],
            },
        ]
    },
    resolve: {
        extensions: [".vue", ".tsx", ".ts", ".js"]
    },
    plugins: [
        new VueLoaderPlugin(),
        new webpack.BannerPlugin({
            banner: fs.readFileSync(path.resolve(__dirname, "src/index.ts"), "utf-8").replace(/(==\/UserScript==)[\s\S]+$/, "$1"),
            entryOnly: true,
            raw: true
        })
    ]
};
