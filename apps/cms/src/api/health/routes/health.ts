export default {
  routes: [
    {
      method: 'GET',
      path: '/_health',
      handler: 'health.find',
      config: { auth: false },
    },
  ],
};
