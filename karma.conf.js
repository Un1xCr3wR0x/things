// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

const { constants } = require('karma');

module.exports = () => {
  return {
    basePath: '',
    browserDisconnectTimeout: 210000,
    browserNoActivityTimeout: 210000,
    browserDisconnectTolerance: 6,
    captureTimeout: 210000,
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    reporters: ['progress', 'kjhtml', 'sonarqubeUnit', 'spec', 'coverage'],
    plugins: [
      require('karma-phantomjs-launcher'),
      require('karma-chrome-launcher'),
      require('karma-jasmine'),
      require('karma-parallel'),
      require('karma-sonarqube-unit-reporter'),
      require('karma-spec-reporter'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    proxies: {
      '/assets/': 'assets/'
    },
    client: {
      clearContext: false, // leave Jasmine Spec Runner output visible in browser
      jasmine: {
        randome: false
      }
    },

    sonarQubeUnitReporter: {
      sonarQubeVersion: 'LATEST',
      outputFile: '../../../target/reports/ut-report.xml',
      useBrowserName: false,
      overrideTestDescription: true,
      testFilePattern: '.spec.ts'
    },
    // coverageIstanbulReporter: {
    //   reports: ['html', 'lcovonly'],
    //   fixWebpackSourcePaths: true
    // },
    coverageReporter: {
      dir: 'coverage',
      subdir: '.',
      reporters: [{ type: 'html' }, { type: 'lcovonly' }]
    },
    port: 9888,
    colors: true,
    logLevel: constants.LOG_ERROR,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: true
  };
};
