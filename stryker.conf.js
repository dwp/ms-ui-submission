module.exports = (config) => {
  config.set({
    mutator: 'javascript',
    packageManager: 'npm',
    reporters: ['clear-text', 'progress-append-only', 'html'],
    files: [
      '**/*',
      '!.coverage/**/*',
      '!.nyc_output/**/*',
      '!node_modules/**/*',
      '!.stryker-tmp/**/*',
      '!stryker.log',
    ],
    testFramework: 'mocha',
    mutate: [
      'app/middleware/**/*.js',
      'app/lib/**/*.js',
      'app/routes/*.js',
      'app/utils/*.js',
      'app/view-filters/*.js',
      'app/start-pages-sub-app/routes/*.js',
    ],
    thresholds: {
      high: 80,
      low: 65,
      break: 50,
    },
  });
};
