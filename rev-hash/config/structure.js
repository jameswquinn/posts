// Folder Structure Defaults
const build  = 'dest'
const pages  = 'pages'

// Where to look for source files
exports.src = {
  index:   `${pages}/index.html`,
  pages:   `${pages}/**/!(index).html`,
}

// Where to build your site
exports.dest = {
  dir:   `${build}/`,
}
