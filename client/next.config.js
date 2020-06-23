// Fixes issue witn Next file change detection failing. Sets a manual configuration on startup to watch for changes event 300 milliseconds

module.exports = {
  webpackDevMiddleware: config => {
    config.watchOptions.poll = 300;
    return config;
  }
};
