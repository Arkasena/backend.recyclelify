const prismaClient = require("../utilities/prismaClient.utility");
const requestValidators = require("../utilities/requestValidators.utility");
const validationError = require("../utilities/validationError.utility");

class PlasticsController {
  static async index(req, res) {
    try {
      const plastics = await prismaClient.plastic.findMany();

      return res.json({
        data: plastics,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
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
        data: plastic,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        error,
      });
    }
  }

  static async save(req, res) {
    try {
      const validationResult = await requestValidators.plastic.validateAsync(req.body, {
        stripUnknown: true,
        abortEarly: false,
        errors: {
          wrap: {
            label: false,
          },
        },
      });

      const plastic = await prismaClient.plastic.create({
        data: validationResult,
      });

      return res.status(201).json({
        data: plastic,
      });
    } catch (error) {
      console.error(error);

      if (error?.details) {
        return res.status(400).json({
          error: validationError(error.details),
        });
      }

      return res.status(500).json({
        error,
      });
    }
  }

  static async update(req, res) {
    const { id } = req.params;

    try {
      const validationResult = await requestValidators.plastic.validateAsync(req.body, {
        stripUnknown: true,
        abortEarly: false,
        errors: {
          wrap: {
            label: false,
          },
        },
      });

      const plastic = await prismaClient.plastic.update({
        where: {
          id: Number(id),
        },
        data: validationResult,
      });

      return res.json({
        data: plastic,
      });
    } catch (error) {
      console.error(error);

      if (error?.details) {
        return res.status(400).json({
          error: validationError(error.details),
        });
      }

      return res.status(500).json({
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
        data: plastic,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        error,
      });
    }
  }
}

module.exports = PlasticsController;
