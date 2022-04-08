const webpack = require("webpack");

module.exports = function override(config) {
  const fallback = config.resolve.fallback || {};
  Object.assign(fallback, {
    os: require.resolve("os-browserify/browser"),
    https: require.resolve("https-browserify"),
    http: require.resolve("stream-http"),
    url: require.resolve("url"),
    crypto: require.resolve("crypto-browserify"),
    assert: require.resolve("assert"),
    stream: require.resolve("stream-browserify"),
    buffer: require.resolve("buffer"),
  });
  config.resolve.fallback = fallback;
  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: "process/browser",
      Buffer: ["buffer", "Buffer"],
    }),
  ]);
  /*config.module.rules = [
    ...config.module.rules,
    {
      test: /\.m?js/,
      resolve: {
        fullySpecified: false,
      },
    },
  ];*/
  return config;
};
