const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

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
        rules: [{
            test: /\.ts$/,
            exclude: /node_modules/,
            use: {
                loader: "ts-loader",
                options: {
                    transpileOnly: true
                }
            }
        }]
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    },
    plugins: [
        new webpack.BannerPlugin({
            banner: fs.readFileSync(path.resolve(__dirname, "src/index.ts"), "utf-8").replace(/(==\/UserScript==)[\s\S]+$/, "$1"),
            entryOnly: true,
            raw: true
        })
    ]
};
