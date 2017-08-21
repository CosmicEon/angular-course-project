const { Router } = require('express');
const attach = (app, data, passport) => {
  const controller = require('./user.controller')(data);
  const router = new Router();

  router.get('/', controller.ownProfile);
  router.post('/', controller.registerUser);
  router.put('/', controller.updateUser);
  router.get('/:username', controller.userProfile);
  router.put('/auth', passport.authenticate('local'), controller.loginUser);
  router.put('/logout', controller.logoutUser);

  app.use('/users', router);
  console.log('Attached routes for /users...');
};

module.exports = attach;
