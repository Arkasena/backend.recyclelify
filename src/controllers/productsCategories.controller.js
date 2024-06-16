// const {} = require("@prisma/client");
const prismaClient = require("../utilities/prismaClient.utility");
const schemaValidator = require("../utilities/schemaValidator.utility");
const validationError = require("../utilities/validationError.utility");

class ProductsCategoriesController {
  static async index(req, res) {
    const productId = Number(req.query.productId) || undefined;
    const categoryId = Number(req.query.categoryId) || undefined;

    try {
      const productCategories = await prismaClient.productCategory.findMany({
        where: {
          productId: productId,
          categoryId: categoryId,
        },
      });

      return res.json({
        data: productCategories,
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
      const productCategory = await prismaClient.productCategory.findUnique({
        where: {
          id: Number(id),
        },
      });

      return res.json({
        data: productCategory,
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
      const validationResult = await schemaValidator.productCategory.validateAsync(req.body, {
        stripUnknown: true,
        abortEarly: false,
        errors: {
          wrap: {
            label: false,
          },
        },
      });

      const productCategory = await prismaClient.productCategory.create({
        data: validationResult,
      });

      return res.status(201).json({
        data: productCategory,
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
      const validationResult = await schemaValidator.productCategory.validateAsync(req.body, {
        stripUnknown: true,
        abortEarly: false,
        errors: {
          wrap: {
            label: false,
          },
        },
      });

      const productCategory = await prismaClient.productCategory.update({
        where: {
          id: Number(id),
        },
        data: validationResult,
      });

      return res.json({
        data: productCategory,
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
      const productCategory = await prismaClient.productCategory.delete({
        where: {
          id: Number(id),
        },
      });

      return res.json({
        data: productCategory,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        error,
      });
    }
  }
}

module.exports = ProductsCategoriesController;
