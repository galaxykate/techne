var path = require('path');
var webpack = require('webpack');
module.exports = {
    entry: {
      app: "./app.js",
      test: ['./test/spec/all/artist.spec.js',
             './test/spec/all/artstore.spec.js',
             './test/spec/all/commonlib.spec.js',
             './test/spec/all/visualartist.spec.js',
             './test/spec/web/webArtStore.spec.js',
             './test/spec/web/webArtist.spec.js']
    },
    output: {
        path: path.join(__dirname, "dist"),
        filename: "[NAME].bundle.js"
    },
    devtool: 'source-map',
    plugins: [
      new webpack.DefinePlugin({
        "process.env": {
            BROWSER: JSON.stringify(true) //easy way to correctly string out true
        }
      })
    ]
};
