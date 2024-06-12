// const {} = require("@prisma/client");
const prismaClient = require("../utilities/prismaClient.utility");
const schemaValidator = require("../utilities/schemaValidator.utility");

class ProductsController {
  static async index(req, res) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const index = (page - 1) * limit;
    const partnerId = parseInt(req.query.partnerId) || undefined;

    try {
      const total = await prismaClient.product.count({
        where: {
          partnerId: partnerId,
        },
      });

      const products = await prismaClient.product.findMany({
        skip: index,
        take: limit,
        where: {
          partnerId: partnerId,
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
      const product = await prismaClient.product.findUnique({
        where: {
          id: Number(id),
        },
      });

      return res.json({
        status: "success",
        data: product,
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
      const validationResult = await schemaValidator.product.validateAsync(req.body);

      const product = await prismaClient.product.create({
        data: validationResult,
      });

      return res.status(201).json({
        status: "success",
        data: product,
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
      const validationResult = await schemaValidator.product.validateAsync(req.body);

      const product = await prismaClient.product.update({
        where: {
          id: Number(id),
        },
        data: validationResult,
      });

      return res.json({
        status: "success",
        data: product,
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
      const product = await prismaClient.product.delete({
        where: {
          id: Number(id),
        },
      });

      return res.json({
        status: "success",
        data: product,
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

module.exports = ProductsController;
