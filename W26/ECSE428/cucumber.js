module.exports = {
  default: {
    require: ['tests/acceptance/steps/**/*.ts'],
    requireModule: ['ts-node/register'],
    format: ['progress', 'html:cucumber-report.html'],
    paths: ['tests/acceptance/features/**/*.feature'],
    publishQuiet: true,
  },
};
