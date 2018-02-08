'use strict';

var promptly = require('promptly');

module.exports = {
  prompt: function(message, opts) {
    return new Promise(function(resolve, reject) {
      promptly.prompt(message, opts, function(err, val) {
        if (err) {
          reject(err);
        } else {
          resolve(val);
        }
      })
    });
  },

  password: function(message, opts) {
    return new Promise(function(resolve, reject) {
      promptly.password(message, opts, function(err, val) {
        if (err) {
          reject(err);
        } else {
          resolve(val);
        }
      })
    });
  },

  confirm: function(message, opts) {
    return new Promise(function(resolve, reject) {
      promptly.confirm(message, opts, function(err, val) {
        if (err) {
          reject(err);
        } else {
          resolve(val);
        }
      })
    });
  },
};
