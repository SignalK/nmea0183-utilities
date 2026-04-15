/**
 * Stryker mutation-testing config.
 *
 * Run with `npm run mutate`. A mutation test mutates the source (index.js)
 * and runs the test suite against each mutant; any mutant that still lets
 * all tests pass is a "survived" mutant and flags a test gap.
 *
 * See https://stryker-mutator.io/docs/stryker-js/configuration/ for all
 * available options.
 */
export default {
  packageManager: 'npm',
  testRunner: 'mocha',
  reporters: ['html', 'clear-text', 'progress'],
  coverageAnalysis: 'perTest',
  mutate: ['index.js'],
  mochaOptions: {
    spec: ['test/*.js']
  },
  // Fail the run (non-zero exit) if the mutation score drops below
  // `break`.
  thresholds: {
    high: 100,
    low: 98,
    break: 95
  }
}
