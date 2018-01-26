

module.exports = {



      // Resize all JPG images to three different sizes: 200, 500, and 630 pixels
      '*.jpg': [{
          width: 200,
          rename: {
              suffix: '-200px'
          },
      }, {
          width: 500,
          rename: {
              suffix: '-500px'
          },
      }, {
          width: 630,
          rename: {
              suffix: '-630px'
          },
      }, {
          width: 630,
          format: 'webp',
          rename: {
              suffix: '-630px',
              extname: '.webp',
          }
      }, {
          width: 630,
          format: 'png',
          rename: {
              suffix: '-630px',
              extname: '.png',
          }
      }, {
          width: 100,
          height: 100,
          // Compress, strip metadata, and rename thumbnail image
          rename: {
              suffix: '-thumbnail'
          },
      }]


}
