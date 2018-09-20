const webpack = require("webpack");
const path = require("path");

const config = {
  entry: {
    background: "./background.js",
    content: "./content.js"
  },
  mode: "none",
  output: {
    filename: '[name].js',
    // path: path.resolve(__dirname, "chrome")
  }
};


const configPathes = [
  path.resolve(__dirname, "chrome"),
  path.resolve(__dirname, "firefox"),
  path.resolve(__dirname, "safari.safariextension"),
];

configPathes.forEach(function (itemPath) {
  const conf = Object.assign({}, config);
  conf.output = Object.assign({}, conf.output, {
    path: itemPath
  });

  var lastHash = null;
  const compiller = webpack(conf);
  compiller.run(function (err, stats) {
    if (err) {
      console.error(err);
    }

    if (stats.hash !== lastHash) {
      lastHash = stats.hash;
      console.log(
        stats.toString({
          colors: true,

          json: false,
          cached: false,
          cachedAssets: false,

          modules: true,
          chunkModules: false,
          chunks: false
        }) + "\n"
      );
    }
  });
});

