const path = require('path');

const config = {
  entry: path.resolve(__dirname, 'src', 'detect-autofill.js'),
  output: {
    filename: 'detect-autofill.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [{
      test: /\.scss$/,
      use: [
        'style-loader', // creates style nodes from JS strings
        'css-loader', // translates CSS into CommonJS
        'sass-loader', // compiles Sass to CSS, using Node Sass by default
      ],
    }],
  },
  plugins: [],
};

module.exports = (env, argv) => {
  if (argv.mode === 'development') {
    config.devtool = 'source-map';
  }

  config.mode = argv.mode;

  return config;
};
