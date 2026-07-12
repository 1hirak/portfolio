import { Strapi } from '@strapi/strapi';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const seedStrapi = require('../database/seed');

function wrapAttributes(obj: any, depth = 0): any {
  if (depth > 5) return obj;
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) return obj.map((v) => wrapAttributes(v, depth));
  if (typeof obj !== 'object') return obj;
  if (obj.attributes) return obj;
  if (obj.pagination || obj.page || obj.pageSize) return obj;
  if (depth > 0) return obj;

  const { id, documentId, ...rest } = obj;
  const wrapped: any = { id, attributes: {} };
  for (const [key, value] of Object.entries(rest)) {
    if (['createdBy', 'updatedBy', 'localizations', 'count'].includes(key)) continue;
    wrapped.attributes[key] =
      typeof value === 'object' && value !== null && !Array.isArray(value) && value.id !== undefined
        ? wrapAttributes(value, depth + 1)
        : value;
  }
  return wrapped;
}

function transformResponse(body: any) {
  if (typeof body !== 'object' || body === null) return body;
  if (body.data && Array.isArray(body.data)) return { ...body, data: body.data.map((v) => wrapAttributes(v)) };
  if (body.data && typeof body.data === 'object') return { ...body, data: wrapAttributes(body.data) };
  if (body.results && Array.isArray(body.results)) return { ...body, data: body.results.map((v) => wrapAttributes(v)) };
  return body;
}

export default {
  async register({ strapi }: { strapi: Strapi }) {
    strapi.server.use(async (ctx, next) => {
      await next();
      if (ctx.body && typeof ctx.body === 'object') {
        ctx.body = transformResponse(ctx.body);
      }
    });
    console.log('Response transformation middleware registered');
  },

  async bootstrap({ strapi }: { strapi: Strapi }) {
    const env = process.env;

    const adminEmail = env.ADMIN_EMAIL || 'admin@portfolio.hirak.tech';
    const adminPassword = env.ADMIN_PASSWORD || 'Admin123!';
    const adminFirstname = env.ADMIN_FIRSTNAME || 'Admin';
    const adminLastname = env.ADMIN_LASTNAME || 'User';

    const existingAdmin = await strapi.db.query('admin::user').findOne({
      where: { email: adminEmail },
    });

    if (!existingAdmin) {
      await strapi.admin.services.user.create({
        email: adminEmail,
        password: adminPassword,
        firstname: adminFirstname,
        lastname: adminLastname,
        isActive: true,
        roles: [1],
      });
      console.log('Admin user created:', adminEmail);
    }

    const readOnlyToken = env.READ_ONLY_API_TOKEN;
    const previewToken = env.PREVIEW_API_TOKEN;

    if (readOnlyToken) {
      const existingReadToken = await strapi.db.query('admin::api-token').findOne({
        where: { name: 'Public Read-Only' },
      });
      if (!existingReadToken) {
        await strapi.admin.services['api-tokens'].create({
          name: 'Public Read-Only',
          description: 'Read-only access for public content',
          type: 'read-only',
          accessKey: readOnlyToken,
        });
        console.log('Read-only API token created');
      }
    }

    if (previewToken) {
      const existingPreviewToken = await strapi.db.query('admin::api-token').findOne({
        where: { name: 'Preview' },
      });
      if (!existingPreviewToken) {
        await strapi.admin.services['api-tokens'].create({
          name: 'Preview',
          description: 'Access to draft/preview content',
          type: 'custom',
          permissions: [
            { action: 'api::article.article.find' },
            { action: 'api::article.article.findOne' },
            { action: 'api::project.project.find' },
            { action: 'api::project.project.findOne' },
          ],
          accessKey: previewToken,
        });
        console.log('Preview API token created');
      }
    }

    console.log('Bootstrap: running seed...');
    try {
      const count = await seedStrapi(strapi);
      console.log(`Bootstrap: seed complete, ${count} new items created`);
    } catch (err) {
      console.error('Bootstrap: seed failed', err);
    }

    console.log('Bootstrap complete');
  },
};
