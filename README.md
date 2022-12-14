# **Gulp start**

## This folder is useful for creating a new project using _GULP_

```
// Commands for gulp
exports.styles = styles
exports.scripts = scripts
exports.browsersync = browsersync
exports.watching = watching
exports.images = images
// remove commands
exports.clean = cleanDist // Remove '~/dist'
// building commands
exports.build = series(cleanDist, build, images) // project rebuild
// default command
exports.default = parallel(browsersync, styles, scripts, watching)
```
