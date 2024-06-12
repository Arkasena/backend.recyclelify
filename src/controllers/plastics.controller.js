// const {} = require("@prisma/client");
const prismaClient = require("../utilities/prismaClient.utility");
const schemaValidator = require("../utilities/schemaValidator.utility");

class PlasticsController {
  static async index(req, res) {
    try {
      const plastics = await prismaClient.plastic.findMany();

      return res.json({
        status: "success",
        data: plastics,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: "error",
        data: null,
        error,
      });
    }
  }

  static async show(req, res) {
    const { id } = req.params;

    try {
      const plastic = await prismaClient.plastic.findUnique({
        where: {
          id: Number(id),
        },
      });

      return res.json({
        status: "success",
        data: plastic,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: "error",
        data: null,
        error,
      });
    }
  }

  static async save(req, res) {
    try {
      const validationResult = await schemaValidator.plastic.validateAsync(req.body);

      const plastic = await prismaClient.plastic.create({
        data: validationResult,
      });

      return res.status(201).json({
        status: "success",
        data: plastic,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: "error",
        data: null,
        error,
      });
    }
  }

  static async update(req, res) {
    const { id } = req.params;

    try {
      const validationResult = await schemaValidator.plastic.validateAsync(req.body);

      const plastic = await prismaClient.plastic.update({
        where: {
          id: Number(id),
        },
        data: validationResult,
      });

      return res.json({
        status: "success",
        data: plastic,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: "error",
        data: null,
        error,
      });
    }
  }

  static async delete(req, res) {
    const { id } = req.params;

    try {
      const plastic = await prismaClient.plastic.delete({
        where: {
          id: Number(id),
        },
      });

      return res.json({
        status: "success",
        data: plastic,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: "error",
        data: null,
        error,
      });
    }
  }
}

module.exports = PlasticsController;
