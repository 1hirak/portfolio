import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::article.article', {
  config: {
    find: { auth: false },
    findOne: { auth: false },
    create: { auth: { scope: ['api::article.article.create'] } },
    update: { auth: { scope: ['api::article.article.update'] } },
    delete: { auth: { scope: ['api::article.article.delete'] } },
  },
  only: ['find', 'findOne', 'create', 'update', 'delete'],
});

export const customRoutes = {
  routes: [
    {
      method: 'GET',
      path: '/articles/search',
      handler: 'article.search',
      config: { auth: false },
    },
    {
      method: 'GET',
      path: '/articles/count',
      handler: 'article.count',
      config: { auth: false },
    },
  ],
};
