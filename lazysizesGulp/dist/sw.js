importScripts('workbox-sw.prod.v2.1.2.js');

/**
 * DO NOT EDIT THE FILE MANIFEST ENTRY
 *
 * The method precache() does the following:
 * 1. Cache URLs in the manifest to a local cache.
 * 2. When a network request is made for any of these URLs the response
 *    will ALWAYS comes from the cache, NEVER the network.
 * 3. When the service worker changes ONLY assets with a revision change are
 *    updated, old cache entries are left as is.
 *
 * By changing the file manifest manually, your users may end up not receiving
 * new versions of files because the revision hasn't changed.
 *
 * Please use workbox-build or some other tool / approach to generate the file
 * manifest which accounts for changes to local files and update the revision
 * accordingly.
 */
const fileManifest = [
  {
    "url": "bg.css",
    "revision": "3dfa8f0f6dfedbe415747d1888098b01"
  },
  {
    "url": "images/coutureportrait_heikedelmore_copyright-320x.jpg",
    "revision": "b5a38dedd038fa8422a45a7c98c4b82d"
  },
  {
    "url": "images/coutureportrait_heikedelmore_copyright-320x@1x.jpg",
    "revision": "b5a38dedd038fa8422a45a7c98c4b82d"
  },
  {
    "url": "images/coutureportrait_heikedelmore_copyright-320x@2x.jpg",
    "revision": "3293840a8243de4ed5561e3381f6fff0"
  },
  {
    "url": "images/coutureportrait_heikedelmore_copyright-320x@3x.jpg",
    "revision": "c8c979c11e9fc3eba4d04362e58b5604"
  },
  {
    "url": "images/coutureportrait_heikedelmore_copyright-320x@4x.jpg",
    "revision": "b1ca0d7c66abe0d2eb8a0e502f6b5eea"
  },
  {
    "url": "images/Morgan-Freeman-ipad-320x.jpg",
    "revision": "32dd3343cc6075e55816c0f553f828ba"
  },
  {
    "url": "images/Morgan-Freeman-ipad-320x@1x.jpg",
    "revision": "32dd3343cc6075e55816c0f553f828ba"
  },
  {
    "url": "images/Morgan-Freeman-ipad-320x@2x.jpg",
    "revision": "7ae485e1db16835747d0da3f04c21eab"
  },
  {
    "url": "images/Morgan-Freeman-ipad-320x@3x.jpg",
    "revision": "eed95ff9b1b5f5130c13194f9b9b995d"
  },
  {
    "url": "images/Morgan-Freeman-ipad-320x@4x.jpg",
    "revision": "fcd8c481a2e1c47cd27e8378c5bbb557"
  },
  {
    "url": "index.html",
    "revision": "ebaffd9a57b92dd3bb0010b8f5dce940"
  }
];

const workboxSW = new self.WorkboxSW({
  "skipWaiting": true,
  "clientsClaim": true
});
workboxSW.precache(fileManifest);
