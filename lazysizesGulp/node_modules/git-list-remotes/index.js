'use strict';

var gitconfiglocal = require('gitconfiglocal');

module.exports = function(dir) {
  return new Promise(function(resolve, reject) {
    gitconfiglocal(dir, function(error, config) {
      if (error) {
        reject(error);
        return;
      }

      if ('remote' in config) {
        resolve(Object.keys(config.remote));
      } else {
        resolve([]);
      }
    });
  });
};
