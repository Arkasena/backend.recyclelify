const { UserRole } = require("@prisma/client");
const prismaClient = require("../utilities/prismaClient.utility");
const schemaValidator = require("../utilities/schemaValidator.utility");

class UsersController {
  static async index(req, res) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const index = (page - 1) * limit;
    const role = UserRole[req.query.role?.toUpperCase()];
    const relations = req.query.relations || [];

    try {
      const total = await prismaClient.user.count({
        where: {
          role,
        },
      });

      const users = await prismaClient.user.findMany({
        skip: index,
        take: limit,
        where: {
          role,
        },
        include: {
          products: relations.includes("products"),
          acceptanceRules: relations.includes("acceptanceRules")
            ? {
                include: {
                  plastic: true,
                },
              }
            : false,
          sellerTransactions: relations.includes("sellerTransactions"),
          buyerTransactions: relations.includes("buyerTransactions"),
        },
      });

      return res.json({
        status: "success",
        data: users,
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
      const user = await prismaClient.user.findUnique({
        where: {
          id: Number(id),
        },
      });

      return res.json({
        status: "success",
        data: user,
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
      const validationResult = await schemaValidator.user.validateAsync(req.body);

      const user = await prismaClient.user.create({
        data: validationResult,
      });

      return res.status(201).json({
        status: "success",
        data: user,
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
      const validationResult = await schemaValidator.user.validateAsync(req.body);

      const user = await prismaClient.user.update({
        where: {
          id: Number(id),
        },
        data: validationResult,
      });

      return res.json({
        status: "success",
        data: user,
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
      const user = await prismaClient.user.delete({
        where: {
          id: Number(id),
        },
      });

      return res.json({
        status: "success",
        data: user,
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

module.exports = UsersController;
