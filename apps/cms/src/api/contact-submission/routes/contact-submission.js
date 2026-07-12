module.exports = function({ strapi }) {
  return {
    type: 'content-api',
    routes: [
      { method: 'GET', path: '/contact-submissions', handler: 'contact-submission.find', config: { auth: false } },
      { method: 'GET', path: '/contact-submissions/:id', handler: 'contact-submission.findOne', config: { auth: false } },
      { method: 'POST', path: '/contact-submissions', handler: 'contact-submission.create', config: { auth: { scope: ['api::contact-submission.contact-submission.create'] } } },
      { method: 'PUT', path: '/contact-submissions/:id', handler: 'contact-submission.update', config: { auth: { scope: ['api::contact-submission.contact-submission.update'] } } },
      { method: 'DELETE', path: '/contact-submissions/:id', handler: 'contact-submission.delete', config: { auth: { scope: ['api::contact-submission.contact-submission.delete'] } } },
    ],
  };
};
