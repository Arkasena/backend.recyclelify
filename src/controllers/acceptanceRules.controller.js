// const {} = require("@prisma/client");
const prismaClient = require("../utilities/prismaClient.utility");
const schemaValidator = require("../utilities/schemaValidator.utility");

class AcceptanceRulesController {
  static async index(req, res) {
    const partnerId = parseInt(req.query.partnerId) || undefined;

    try {
      const acceptanceRules = await prismaClient.acceptanceRule.findMany({
        where: {
          partnerId: partnerId,
        },
      });

      return res.json({
        status: "success",
        data: acceptanceRules,
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
      const acceptanceRule = await prismaClient.acceptanceRule.findUnique({
        where: {
          id: Number(id),
        },
      });

      return res.json({
        status: "success",
        data: acceptanceRule,
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
      const validationResult = await schemaValidator.acceptanceRule.validateAsync(req.body);

      const acceptanceRule = await prismaClient.acceptanceRule.create({
        data: validationResult,
      });

      return res.status(201).json({
        status: "success",
        data: acceptanceRule,
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
      const validationResult = await schemaValidator.acceptanceRule.validateAsync(req.body);

      const acceptanceRule = await prismaClient.acceptanceRule.update({
        where: {
          id: Number(id),
        },
        data: validationResult,
      });

      return res.json({
        status: "success",
        data: acceptanceRule,
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
      const acceptanceRule = await prismaClient.acceptanceRule.delete({
        where: {
          id: Number(id),
        },
      });

      return res.json({
        status: "success",
        data: acceptanceRule,
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

module.exports = AcceptanceRulesController;
