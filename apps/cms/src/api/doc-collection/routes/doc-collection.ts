export default {
  routes: [
    {
      method: 'GET',
      path: '/doc-collections',
      handler: 'doc-collection.find',
      config: { auth: false },
    },
    {
      method: 'GET',
      path: '/doc-collections/:id',
      handler: 'doc-collection.findOne',
      config: { auth: false },
    },
    {
      method: 'POST',
      path: '/doc-collections',
      handler: 'doc-collection.create',
      config: { auth: { scope: ['api::doc-collection.doc-collection.create'] } },
    },
    {
      method: 'PUT',
      path: '/doc-collections/:id',
      handler: 'doc-collection.update',
      config: { auth: { scope: ['api::doc-collection.doc-collection.update'] } },
    },
    {
      method: 'DELETE',
      path: '/doc-collections/:id',
      handler: 'doc-collection.delete',
      config: { auth: { scope: ['api::doc-collection.doc-collection.delete'] } },
    },
  ],
};
