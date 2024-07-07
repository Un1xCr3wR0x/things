// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

const { join } = require('path');
const getBaseKarmaConfig = require('../../../karma.conf');

module.exports = function (config) {
  const baseConfig = getBaseKarmaConfig();
  config.set({
    ...baseConfig,
    coverageReporter: {
      ...baseConfig.coverageReporter,
      dir: join(__dirname, '../../../coverage/libs/features/violations')
    },
    sonarQubeUnitReporter: {
      ...baseConfig.sonarQubeUnitReporter,
      outputFile: '../../../reports/libs/features/violations/ut-report.xml',
      testPath: join(__dirname, './src')
    }
  });
};
