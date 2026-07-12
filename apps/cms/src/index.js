function wrapAttributes(obj, depth = 0) {
  if (depth > 5) return obj;
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) return obj.map((v) => wrapAttributes(v, depth));
  if (typeof obj !== 'object') return obj;
  if (obj.attributes) return obj;
  if (obj.pagination || obj.page || obj.pageSize) return obj;
  if (depth > 0) return obj;

  const { id, documentId, ...rest } = obj;
  const wrapped = { id, attributes: {} };
  for (const [key, value] of Object.entries(rest)) {
    if (['createdBy', 'updatedBy', 'localizations', 'count'].includes(key)) continue;
    wrapped.attributes[key] =
      typeof value === 'object' && value !== null && !Array.isArray(value) && value.id !== undefined
        ? wrapAttributes(value, depth + 1)
        : value;
  }
  return wrapped;
}

function transformResponse(body) {
  if (typeof body !== 'object' || body === null) return body;
  if (body.data && Array.isArray(body.data)) return { ...body, data: body.data.map((v) => wrapAttributes(v)) };
  if (body.data && typeof body.data === 'object') return { ...body, data: wrapAttributes(body.data) };
  if (body.results && Array.isArray(body.results)) return { ...body, data: body.results.map((v) => wrapAttributes(v)) };
  return body;
}

module.exports = {
  async register({ strapi }) {
    strapi.server.use(async (ctx, next) => {
      await next();
      if (ctx.body && typeof ctx.body === 'object') {
        ctx.body = transformResponse(ctx.body);
      }
    });
    console.log('Response transformation middleware registered');
  },

  async bootstrap({ strapi }) {
    console.log('Bootstrap: running seed...');
    try {
      const seedStrapi = require('../database/seed');
      const count = await seedStrapi(strapi);
      console.log('Bootstrap: seed complete, ' + count + ' new items created');
    } catch (err) {
      console.error('Bootstrap: seed failed', err?.message || err, err?.stack);
    }

    console.log('Bootstrap complete');
  },
};
