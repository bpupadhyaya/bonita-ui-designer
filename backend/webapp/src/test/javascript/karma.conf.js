// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html
var argv = require('optimist').argv;
var logger = require('log4js').getLogger();

// changing timezone if set in arguments
if (argv.timezone) {
  process.env.TZ = argv.timezone;
  logger.warn('Running tests using timezone [' + argv.timezone + ']');
}

module.exports = function (config) {
  config.set({
    // base path, that will be used to resolve files and exclude
    basePath: '../../..',

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['jasmine'],

    files: [
      'node_modules/jquery/dist/jquery.js',
      'bower_components/angular/angular.min.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'bower_components/angular-sanitize/angular-sanitize.min.js',
      'bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
      'bower_components/angular-gettext/dist/angular-gettext.min.js',

      'src/main/runtime/js/**/*.module.js',
      'src/main/runtime/js/**/*.js',
      'target/widget-directives/**/*.js',
      argv.specs || 'src/test/javascript/**/!(karma.conf).js'
    ],

    // list of files / patterns to exclude
    exclude: [],

    reporters: ['progress', 'junit', 'coverage'],

    junitReporter: {
      outputFile: 'target/reports/unit-tests/test-results.xml',
      suite: 'JavaScript unit tests'
    },

    preprocessors: {
      // source files, that you wanna generate coverage for
      // do not include tests or libraries
      // (these files will be instrumented by Istanbul)
      'src/main/runtime/js/**/*.js': ['babel', 'coverage'],
      'src/test/javascript/**/*.js': ['babel']
    },

    coverageReporter: {
      type: 'lcov',
      dir: 'target/reports/coverage/'
    },

    // web server port
    port: 9876,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['PhantomJS'],

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: true
  });
};
