import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::article.article', ({ strapi }) => ({
  async find(ctx) {
    return await super.find(ctx);
  },

  async findOne(ctx) {
    return await super.findOne(ctx);
  },

  async create(ctx) {
    return await super.create(ctx);
  },

  async update(ctx) {
    return await super.update(ctx);
  },

  async delete(ctx) {
    return await super.delete(ctx);
  },

  async search(ctx) {
    const { q } = ctx.query;

    if (!q) {
      return [];
    }

    const results = await strapi.db.connection.raw(
      `SELECT * FROM articles WHERE searchable_text ILIKE ? OR title ILIKE ? OR description ILIKE ?`,
      [`%${q}%`, `%${q}%`, `%${q}%`]
    );

    return results.rows;
  },

  async count(ctx) {
    const count = await strapi.db.query('api::article.article').count();
    return { count };
  },
}));
