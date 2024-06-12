const { TransactionStatus } = require("@prisma/client");
const prismaClient = require("../utilities/prismaClient.utility");
const schemaValidator = require("../utilities/schemaValidator.utility");

class TransactionsController {
  static async index(req, res) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const index = (page - 1) * limit;
    const partnerId = parseInt(req.query.partnerId) || undefined;
    const collaboratorId = parseInt(req.query.collaboratorId) || undefined;
    const status = TransactionStatus[req.query.status?.toUpperCase()];

    try {
      const total = await prismaClient.transaction.count({
        where: {
          partnerId: partnerId,
          collaboratorId: collaboratorId,
          status: status,
        },
      });

      const products = await prismaClient.transaction.findMany({
        skip: index,
        take: limit,
        where: {
          partnerId: partnerId,
          collaboratorId: collaboratorId,
          status: status,
        },
      });

      return res.json({
        status: "success",
        data: products,
        metadata: {
          total,
          limit,
          page: {
            first: 1,
            prev: page - 1 === 0 ? 1 : page - 1,
            current: page,
            next: page + 1 > Math.ceil(total / limit) ? Math.ceil(total / limit) : page + 1,
            last: Math.ceil(total / limit),
          },
        },
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
      const transaction = await prismaClient.transaction.findUnique({
        where: {
          id: Number(id),
        },
      });

      return res.json({
        status: "success",
        data: transaction,
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
      const validationResult = await schemaValidator.transaction.validateAsync(req.body);

      const transaction = await prismaClient.transaction.create({
        data: validationResult,
      });

      return res.status(201).json({
        status: "success",
        data: transaction,
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
      const validationResult = await schemaValidator.transaction.validateAsync(req.body);

      const transaction = await prismaClient.transaction.update({
        where: {
          id: Number(id),
        },
        data: validationResult,
      });

      return res.json({
        status: "success",
        data: transaction,
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
      const transaction = await prismaClient.transaction.delete({
        where: {
          id: Number(id),
        },
      });

      return res.json({
        status: "success",
        data: transaction,
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

module.exports = TransactionsController;
