module.exports = function({ strapi }) {
  return {
    type: 'content-api',
    routes: [
      { method: 'GET', path: '/site-setting', handler: 'site-setting.find', config: { auth: false } },
      { method: 'PUT', path: '/site-setting', handler: 'site-setting.update', config: { auth: { scope: ['api::site-setting.site-setting.update'] } } },
      { method: 'DELETE', path: '/site-setting', handler: 'site-setting.delete', config: { auth: { scope: ['api::site-setting.site-setting.delete'] } } },
    ],
  };
};
