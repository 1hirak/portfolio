module.exports = function({ strapi }) {
  return {
    type: 'content-api',
    routes: [
      { method: 'GET', path: '/experiences', handler: 'experience.find', config: { auth: false } },
      { method: 'GET', path: '/experiences/:id', handler: 'experience.findOne', config: { auth: false } },
      { method: 'POST', path: '/experiences', handler: 'experience.create', config: { auth: { scope: ['api::experience.experience.create'] } } },
      { method: 'PUT', path: '/experiences/:id', handler: 'experience.update', config: { auth: { scope: ['api::experience.experience.update'] } } },
      { method: 'DELETE', path: '/experiences/:id', handler: 'experience.delete', config: { auth: { scope: ['api::experience.experience.delete'] } } },
    ],
  };
};
