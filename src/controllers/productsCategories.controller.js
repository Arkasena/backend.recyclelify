// const {} = require("@prisma/client");
const prismaClient = require("../utilities/prismaClient.utility");
const schemaValidator = require("../utilities/schemaValidator.utility");

class ProductsCategoriesController {
  static async index(req, res) {
    const productId = parseInt(req.query.productId) || undefined;

    try {
      const productCategories = await prismaClient.productCategory.findMany({
        where: {
          productId: productId,
        },
      });

      return res.json({
        status: "success",
        data: productCategories,
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
      const productCategory = await prismaClient.productCategory.findUnique({
        where: {
          id: Number(id),
        },
      });

      return res.json({
        status: "success",
        data: productCategory,
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
      const validationResult = await schemaValidator.productCategory.validateAsync(req.body);

      const productCategory = await prismaClient.productCategory.create({
        data: validationResult,
      });

      return res.status(201).json({
        status: "success",
        data: productCategory,
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
      const validationResult = await schemaValidator.productCategory.validateAsync(req.body);

      const productCategory = await prismaClient.productCategory.update({
        where: {
          id: Number(id),
        },
        data: validationResult,
      });

      return res.json({
        status: "success",
        data: productCategory,
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
      const productCategory = await prismaClient.productCategory.delete({
        where: {
          id: Number(id),
        },
      });

      return res.json({
        status: "success",
        data: productCategory,
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

module.exports = ProductsCategoriesController;
