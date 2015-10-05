// console logs are useful in error handlers
/* eslint-disable no-console */
require('babel/register')({
  optional: ['runtime']
});

process.on('unhandledRejection', function (error) {
  console.error('Unhandled Promise Rejection:');
  console.error(error && error.stack || error);
});
