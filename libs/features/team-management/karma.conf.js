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
      dir: join(__dirname, '../../../coverage/libs/features/team-management')
    },
    sonarQubeUnitReporter: {
      ...baseConfig.sonarQubeUnitReporter,
      outputFile: '../../../reports/libs/features/team-management/ut-report.xml',
      testPath: join(__dirname, './src')
    }
  });
};
