const webpack = require("webpack");
const path = require("path");

const outputDir = path.join(__dirname, "build-output");
const baseConfig = {
  entry: {
    background: "./background.js",
    content: "./content.js"
  },
  mode: "none",
  output: {
    filename: '[name].js',
  }
};

const outputPaths = [
  path.join(outputDir, "chrome"),
  path.join(outputDir, "firefox"),
  // path.join(outputDir, "safari.safariextension"),
];

outputPaths.forEach(outputPath => {
  const conf = Object.assign({}, baseConfig);
  conf.output = Object.assign({}, conf.output, {
    path: outputPath,
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

