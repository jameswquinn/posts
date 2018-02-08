/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */


(function (self) {
  'use strict';

  // On install, cache resources and skip waiting so the worker won't
  // wait for clients to be closed before becoming active.
  self.addEventListener('install', event =>
    event.waitUntil(
      oghliner.cacheResources()
      .then(() => self.skipWaiting())
    )
  );

  // On activation, delete old caches and start controlling the clients
  // without waiting for them to reload.
  self.addEventListener('activate', event =>
    event.waitUntil(
      oghliner.clearOtherCaches()
      .then(() => self.clients.claim())
    )
  );

  // Retrieves the request following oghliner strategy.
  self.addEventListener('fetch', event => {
    if (event.request.method === 'GET') {
      event.respondWith(oghliner.get(event.request));
    } else {
      event.respondWith(self.fetch(event.request));
    }
  });

  var oghliner = self.oghliner = {

    // This is the unique prefix for all the caches controlled by this worker.
    CACHE_PREFIX: 'offline-cache:lazysizesGulp:' + (self.registration ? self.registration.scope : '') + ':',

    // This is the unique name for the cache controlled by this version of the worker.
    get CACHE_NAME() {
      return this.CACHE_PREFIX + '2b01d8218af961379a5ef788e5627dc5beca1905';
    },

    // This is a list of resources that will be cached.
    RESOURCES: [
      'dist/bg.css', // 27c73eb23aa1e9c6b03d1f6bcb1024fa3435bc14
      'dist/index.html', // 75b826c3462d5d6fea3019a287cafbfe617f1336
      'dist/images/Morgan-Freeman-ipad-320x@1x.jpg', // 364be38425ad3b864964d6cc9ce96235998e31d7
      'dist/images/Morgan-Freeman-ipad-320x@2x.jpg', // e4d2bcedfd616d2e1f9f46bfb9dc871df0f84c4f
      'dist/images/Morgan-Freeman-ipad-320x@3x.jpg', // f179111ccd429a4df808633426039d776219d631
      'dist/images/Morgan-Freeman-ipad-320x@4x.jpg', // c06232961bcc0cf168dabc4660e942c1abf57c30
      'dist/images/Morgan-Freeman-ipad.jpg', // 4f229813591b69b6dd0071f44bb3cfd9f6a9f5c7
      'dist/images/coutureportrait_heikedelmore_copyright-320x.jpg', // e9808e1f8105938145a33d069e010e91db3eeb31
      'dist/images/coutureportrait_heikedelmore_copyright-320x@1x.jpg', // e9808e1f8105938145a33d069e010e91db3eeb31
      'dist/images/coutureportrait_heikedelmore_copyright-320x@2x.jpg', // be1a0e7d5febe302c7192f75711ef28b97bce255
      'dist/images/coutureportrait_heikedelmore_copyright-320x@3x.jpg', // 69563add608f5134099659c741817ca85d13b889
      'dist/images/coutureportrait_heikedelmore_copyright-320x@4x.jpg', // 4f612da8a6f4f5b2e0dc74d573cea52e54ede7de
      'dist/images/coutureportrait_heikedelmore_copyright.jpg', // debe951d51e7c2d7200d40553ee524e59f5f3433

    ],

    // Adds the resources to the cache controlled by this worker.
    cacheResources: function () {
      var now = Date.now();
      var baseUrl = self.location;
      return this.prepareCache()
      .then(cache => Promise.all(this.RESOURCES.map(resource => {
        // Bust the request to get a fresh response
        var url = new URL(resource, baseUrl);
        var bustParameter = (url.search ? '&' : '') + '__bust=' + now;
        var bustedUrl = new URL(url.toString());
        bustedUrl.search += bustParameter;

        // But cache the response for the original request
        var requestConfig = { credentials: 'same-origin' };
        var originalRequest = new Request(url.toString(), requestConfig);
        var bustedRequest = new Request(bustedUrl.toString(), requestConfig);
        return fetch(bustedRequest)
        .then(response => {
          if (response.ok) {
            return cache.put(originalRequest, response);
          }
          console.error('Error fetching ' + url + ', status was ' + response.status);
        });
      })));
    },

    // Remove the offline caches not controlled by this worker.
    clearOtherCaches: function () {
      var outOfDate = cacheName => cacheName.startsWith(this.CACHE_PREFIX) && cacheName !== this.CACHE_NAME;

      return self.caches.keys()
      .then(cacheNames => Promise.all(
        cacheNames
        .filter(outOfDate)
        .map(cacheName => self.caches.delete(cacheName))
      ));
    },

    // Get a response from the current offline cache or from the network.
    get: function (request) {
      return this.openCache()
      .then(cache => cache.match(() => this.extendToIndex(request)))
      .then(response => {
        if (response) {
          return response;
        }
        return self.fetch(request);
      });
    },

    // Make requests to directories become requests to index.html
    extendToIndex: function (request) {
      var url = new URL(request.url, self.location);
      var path = url.pathname;
      if (path[path.length - 1] !== '/') {
        return request;
      }
      url.pathname += 'index.html';
      return new Request(url.toString(), request);
    },

    // Prepare the cache for installation, deleting it before if it already exists.
    prepareCache: function () {
      return self.caches.delete(this.CACHE_NAME)
      .then(() => this.openCache());
    },

    // Open and cache the offline cache promise to improve the performance when
    // serving from the offline-cache.
    openCache: function () {
      if (!this._cache) {
        this._cache = self.caches.open(this.CACHE_NAME);
      }
      return this._cache;
    }

  };
}(self));
