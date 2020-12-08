'use strict';
var qwest = require('qwest');
var cache = require('./cache.js');

var cacheAPI = {

  get: function(id) {

    var key = 'data-' + id;

    return new Promise(function(resolve, reject) {

      var cachedData = cache.get(key);
      if (cachedData) {
        resolve(cachedData);
        return;
      }

      qwest.get('/data/' + id)
       .then(function(xhr, response) {
         cache.set(key, response, 300);
         resolve(response);
       }).catch(function(e, xhr, response) {
         reject({e: e, xhr: xhr, response: response});
       });
    });
  },

  update: function(id, data) {

    var key = 'data-' + id;
    cache.clear(key);

    return qwest.post('/data/' + id, data)
     .then(function(xhr, response) {
       cache.clear(key);
       return response;
     });
  },

};

module.exports = cacheAPI;
