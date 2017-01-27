var path = require('path');
module.exports = {
    entry: {
      app: "./app.js",
      test: ['./test/spec/all/artist.spec.js',
            './test/spec/all/artstore.spec.js',
            './test/spec/web/webArtStore.spec.js']
    },
    output: {
        path: path.join(__dirname, "dist"),
        filename: "[NAME].bundle.js"
    },
    devtool: 'source-map'
};
