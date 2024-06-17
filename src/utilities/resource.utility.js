const express = require("express");

function resource(controller, middlewares = [], strict = false) {
  const router = express.Router();

  router.get(`/`, strict ? middlewares : [], controller.index);
  router.get(`/:id`, strict ? middlewares : [], controller.show);
  router.post(`/`, middlewares, controller.save);
  router.put(`/:id`, middlewares, controller.update);
  router.delete(`/:id`, middlewares, controller.delete);

  return router;
}

module.exports = resource;
