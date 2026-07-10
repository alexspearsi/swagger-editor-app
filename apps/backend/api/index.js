const { createNestApp } = require('../dist/create-app');

let cachedAppPromise;

function getApp() {
  if (!cachedAppPromise) {
    cachedAppPromise = createNestApp().then(async (app) => {
      await app.init();
      return app;
    });
  }
  return cachedAppPromise;
}

module.exports = async function handler(req, res) {
  const app = await getApp();
  const expressInstance = app.getHttpAdapter().getInstance();
  expressInstance(req, res);
};
