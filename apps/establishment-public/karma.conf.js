// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

const { join } = require('path');
const getBaseKarmaConfig = require('../../karma.conf');

module.exports = function (config) {
  const baseConfig = getBaseKarmaConfig();
  config.set({
    ...baseConfig,
    coverageReporter: {
      ...baseConfig.coverageReporter,
      dir: join(__dirname, '../../coverage/apps/establishment-public')
    },
    sonarQubeUnitReporter: {
      ...baseConfig.sonarQubeUnitReporter,
      outputFile: '../../reports/establishment-public/ut-report.xml',
      testPaths: [join(__dirname, './src'), join(__dirname, '../../libs')]
    }
  });
};
