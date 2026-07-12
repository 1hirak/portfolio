export default {
  routes: [
    {
      method: 'GET',
      path: '/navigation',
      handler: 'navigation.find',
      config: { auth: false },
    },
    {
      method: 'PUT',
      path: '/navigation',
      handler: 'navigation.update',
      config: { auth: { scope: ['api::navigation.navigation.update'] } },
    },
    {
      method: 'DELETE',
      path: '/navigation',
      handler: 'navigation.delete',
      config: { auth: { scope: ['api::navigation.navigation.delete'] } },
    },
  ],
};
