// const {} = require("@prisma/client");
const prismaClient = require("../utilities/prismaClient.utility");
const schemaValidator = require("../utilities/schemaValidator.utility");
const validationError = require("../utilities/validationError.utility");

class CategoriesForProductsController {
  static async index(req, res) {
    try {
      const categoriesForProducts = await prismaClient.categoryForProduct.findMany();

      return res.json({
        data: categoriesForProducts,
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
      const categoryForProduct = await prismaClient.categoryForProduct.findUnique({
        where: {
          id: Number(id),
        },
      });

      return res.json({
        data: categoryForProduct,
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
      const validationResult = await schemaValidator.categoryForProduct.validateAsync(req.body, {
        stripUnknown: true,
        abortEarly: false,
        errors: {
          wrap: {
            label: false,
          },
        },
      });

      const categoryForProduct = await prismaClient.categoryForProduct.create({
        data: validationResult,
      });

      return res.status(201).json({
        data: categoryForProduct,
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
      const validationResult = await schemaValidator.categoryForProduct.validateAsync(req.body, {
        stripUnknown: true,
        abortEarly: false,
        errors: {
          wrap: {
            label: false,
          },
        },
      });

      const categoryForProduct = await prismaClient.categoryForProduct.update({
        where: {
          id: Number(id),
        },
        data: validationResult,
      });

      return res.json({
        data: categoryForProduct,
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
      const categoryForProduct = await prismaClient.categoryForProduct.delete({
        where: {
          id: Number(id),
        },
      });

      return res.json({
        data: categoryForProduct,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        error,
      });
    }
  }
}

module.exports = CategoriesForProductsController;
