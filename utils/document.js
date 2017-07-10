const docs = require('simple-rest-docs');

docs({
  files: [
    'index.js',
    'router.js',
    'routes/**/*.js',
    'models/**/*.js',
    'config/**/*.js',
    'controllers/**/*.js'
  ],
  output: './README.md'
});