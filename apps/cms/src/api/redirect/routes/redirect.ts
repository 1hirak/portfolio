export default {
  routes: [
    {
      method: 'GET',
      path: '/redirects',
      handler: 'redirect.find',
      config: { auth: { scope: ['api::redirect.redirect.find'] } },
    },
    {
      method: 'GET',
      path: '/redirects/:id',
      handler: 'redirect.findOne',
      config: { auth: { scope: ['api::redirect.redirect.findOne'] } },
    },
    {
      method: 'POST',
      path: '/redirects',
      handler: 'redirect.create',
      config: { auth: { scope: ['api::redirect.redirect.create'] } },
    },
    {
      method: 'PUT',
      path: '/redirects/:id',
      handler: 'redirect.update',
      config: { auth: { scope: ['api::redirect.redirect.update'] } },
    },
    {
      method: 'DELETE',
      path: '/redirects/:id',
      handler: 'redirect.delete',
      config: { auth: { scope: ['api::redirect.redirect.delete'] } },
    },
  ],
};
