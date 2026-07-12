module.exports = function({ strapi }) {
  return {
    type: 'content-api',
    routes: [
      { method: 'GET', path: '/skill-categories', handler: 'skill-category.find', config: { auth: false } },
      { method: 'GET', path: '/skill-categories/:id', handler: 'skill-category.findOne', config: { auth: false } },
      { method: 'POST', path: '/skill-categories', handler: 'skill-category.create', config: { auth: { scope: ['api::skill-category.skill-category.create'] } } },
      { method: 'PUT', path: '/skill-categories/:id', handler: 'skill-category.update', config: { auth: { scope: ['api::skill-category.skill-category.update'] } } },
      { method: 'DELETE', path: '/skill-categories/:id', handler: 'skill-category.delete', config: { auth: { scope: ['api::skill-category.skill-category.delete'] } } },
    ],
  };
};
