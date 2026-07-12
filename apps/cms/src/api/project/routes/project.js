module.exports = function({ strapi }) {
  return {
    type: 'content-api',
    routes: [
      { method: 'GET', path: '/projects', handler: 'project.find', config: { auth: false } },
      { method: 'GET', path: '/projects/:id', handler: 'project.findOne', config: { auth: false } },
      { method: 'POST', path: '/projects', handler: 'project.create', config: { auth: { scope: ['api::project.project.create'] } } },
      { method: 'PUT', path: '/projects/:id', handler: 'project.update', config: { auth: { scope: ['api::project.project.update'] } } },
      { method: 'DELETE', path: '/projects/:id', handler: 'project.delete', config: { auth: { scope: ['api::project.project.delete'] } } },
    ],
  };
};
