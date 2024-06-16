// const {} = require("@prisma/client");
const prismaClient = require("../utilities/prismaClient.utility");
const schemaValidator = require("../utilities/schemaValidator.utility");
const validationError = require("../utilities/validationError.utility");

class AcceptanceRulesController {
  static async index(req, res) {
    const partnerId = Number(req.query.partnerId) || undefined;

    try {
      const acceptanceRules = await prismaClient.acceptanceRule.findMany({
        where: {
          partnerId: partnerId,
        },
      });

      return res.json({
        data: acceptanceRules,
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
      const acceptanceRule = await prismaClient.acceptanceRule.findUnique({
        where: {
          id: Number(id),
        },
      });

      return res.json({
        data: acceptanceRule,
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
      const validationResult = await schemaValidator.acceptanceRule.validateAsync(req.body, {
        stripUnknown: true,
        abortEarly: false,
        errors: {
          wrap: {
            label: false,
          },
        },
      });

      const acceptanceRule = await prismaClient.acceptanceRule.create({
        data: validationResult,
      });

      return res.status(201).json({
        data: acceptanceRule,
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
      const validationResult = await schemaValidator.acceptanceRule.validateAsync(req.body, {
        stripUnknown: true,
        abortEarly: false,
        errors: {
          wrap: {
            label: false,
          },
        },
      });

      const acceptanceRule = await prismaClient.acceptanceRule.update({
        where: {
          id: Number(id),
        },
        data: validationResult,
      });

      return res.json({
        data: acceptanceRule,
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
      const acceptanceRule = await prismaClient.acceptanceRule.delete({
        where: {
          id: Number(id),
        },
      });

      return res.json({
        data: acceptanceRule,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        error,
      });
    }
  }
}

module.exports = AcceptanceRulesController;
