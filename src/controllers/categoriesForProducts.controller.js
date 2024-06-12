// const {} = require("@prisma/client");
const prismaClient = require("../utilities/prismaClient.utility");
const schemaValidator = require("../utilities/schemaValidator.utility");

class CategoriesForProductsController {
  static async index(req, res) {
    try {
      const categoriesForProducts = await prismaClient.categoryForProduct.findMany();

      return res.json({
        status: "success",
        data: categoriesForProducts,
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
      const categoryForProduct = await prismaClient.categoryForProduct.findUnique({
        where: {
          id: Number(id),
        },
      });

      return res.json({
        status: "success",
        data: categoryForProduct,
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
      const validationResult = await schemaValidator.categoryForProduct.validateAsync(req.body);

      const categoryForProduct = await prismaClient.categoryForProduct.create({
        data: validationResult,
      });

      return res.status(201).json({
        status: "success",
        data: categoryForProduct,
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
      const validationResult = await schemaValidator.categoryForProduct.validateAsync(req.body);

      const categoryForProduct = await prismaClient.categoryForProduct.update({
        where: {
          id: Number(id),
        },
        data: validationResult,
      });

      return res.json({
        status: "success",
        data: categoryForProduct,
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
      const categoryForProduct = await prismaClient.categoryForProduct.delete({
        where: {
          id: Number(id),
        },
      });

      return res.json({
        status: "success",
        data: categoryForProduct,
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

module.exports = CategoriesForProductsController;
