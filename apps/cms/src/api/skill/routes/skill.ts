export default {
  routes: [
    {
      method: 'GET',
      path: '/skills',
      handler: 'skill.find',
      config: { auth: false },
    },
    {
      method: 'GET',
      path: '/skills/:id',
      handler: 'skill.findOne',
      config: { auth: false },
    },
    {
      method: 'POST',
      path: '/skills',
      handler: 'skill.create',
      config: { auth: { scope: ['api::skill.skill.create'] } },
    },
    {
      method: 'PUT',
      path: '/skills/:id',
      handler: 'skill.update',
      config: { auth: { scope: ['api::skill.skill.update'] } },
    },
    {
      method: 'DELETE',
      path: '/skills/:id',
      handler: 'skill.delete',
      config: { auth: { scope: ['api::skill.skill.delete'] } },
    },
  ],
};
