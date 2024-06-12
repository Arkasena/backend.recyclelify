const express = require("express");

function resource(controller) {
  const router = express.Router();

  router.get(`/`, controller.index);
  router.get(`/:id`, controller.show);
  router.post(`/`, controller.save);
  router.put(`/:id`, controller.update);
  router.delete(`/:id`, controller.delete);

  return router;
}

module.exports = resource;
