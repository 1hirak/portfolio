const { factories } = require('@strapi/strapi');

module.exports = factories.createCoreService('api::health.health');
