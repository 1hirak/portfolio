module.exports = ({ env }) => [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  {
    name: 'strapi::cors',
    config: {
      origin: env('FRONTEND_URL', 'http://localhost:3000').split(',').map(s => s.trim()),
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
      headers: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
      keepHeaderOnError: true,
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  {
    name: 'strapi::body',
    config: {
      patchKoa: true,
      multipart: true,
      includeUnparsed: true,
      formidable: {
        maxFileSize: 10 * 1024 * 1024,
      },
    },
  },
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
