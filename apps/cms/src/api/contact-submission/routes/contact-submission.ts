export default {
  routes: [
    {
      method: 'GET',
      path: '/contact-submissions',
      handler: 'contact-submission.find',
      config: { auth: { scope: ['api::contact-submission.contact-submission.find'] } },
    },
    {
      method: 'GET',
      path: '/contact-submissions/:id',
      handler: 'contact-submission.findOne',
      config: { auth: { scope: ['api::contact-submission.contact-submission.findOne'] } },
    },
    {
      method: 'POST',
      path: '/contact-submissions',
      handler: 'contact-submission.create',
      config: { auth: false },
    },
    {
      method: 'PUT',
      path: '/contact-submissions/:id',
      handler: 'contact-submission.update',
      config: { auth: { scope: ['api::contact-submission.contact-submission.update'] } },
    },
    {
      method: 'DELETE',
      path: '/contact-submissions/:id',
      handler: 'contact-submission.delete',
      config: { auth: { scope: ['api::contact-submission.contact-submission.delete'] } },
    },
  ],
};
