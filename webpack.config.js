const path = require('path');

module.exports = {
    entry: './src/index.ts',
    output: {
        filename: 'vkfix.user.js',
        path: path.resolve(__dirname, 'dist'),
    },
};
