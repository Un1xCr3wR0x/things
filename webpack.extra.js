const webpack = require('webpack');
const MomentTimezoneDataPlugin = require('moment-timezone-data-webpack-plugin');
module.exports = {
  plugins: [
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new MomentTimezoneDataPlugin({
      matchZones: 'Asia/Riyadh'
    })
  ]
};
