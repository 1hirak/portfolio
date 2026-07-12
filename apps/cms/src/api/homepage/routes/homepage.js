module.exports = function({ strapi }) {
  return {
    type: 'content-api',
    routes: [
      { method: 'GET', path: '/homepage', handler: 'homepage.find', config: { auth: false } },
      { method: 'PUT', path: '/homepage', handler: 'homepage.update', config: { auth: { scope: ['api::homepage.homepage.update'] } } },
      { method: 'DELETE', path: '/homepage', handler: 'homepage.delete', config: { auth: { scope: ['api::homepage.homepage.delete'] } } },
    ],
  };
};
