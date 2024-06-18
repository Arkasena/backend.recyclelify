const prismaClient = require("../utilities/prismaClient.utility");
const requestValidators = require("../utilities/requestValidators.utility");
const validationError = require("../utilities/validationError.utility");

class ProductsController {
  static async index(req, res) {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 9;
    const index = (page - 1) * limit;
    const partnerId = Number(req.query.partnerId) || undefined;
    const relations = req.query.relations || [];

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
        include: {
          partner: relations.includes("partner")
            ? {
                select: {
                  id: true,
                  username: true,
                  name: true,
                  description: true,
                  phoneNumber: true,
                  email: true,
                  address: true,
                  photo: true,
                  website: true,
                },
              }
            : false,
          categories: relations.includes("categories")
            ? {
                include: {
                  category: true,
                },
              }
            : false,
        },
      });

      return res.json({
        data: products,
        meta: {
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
        error,
      });
    }
  }

  static async show(req, res) {
    const { id } = req.params;
    const relations = req.query.relations || [];

    try {
      const product = await prismaClient.product.findUnique({
        where: {
          id: Number(id),
        },
        include: {
          partner: relations.includes("partner")
            ? {
                select: {
                  id: true,
                  username: true,
                  name: true,
                  description: true,
                  phoneNumber: true,
                  email: true,
                  address: true,
                  photo: true,
                  website: true,
                },
              }
            : false,
          categories: relations.includes("categories")
            ? {
                include: {
                  category: true,
                },
              }
            : false,
        },
      });

      return res.json({
        data: product,
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
      const validationResult = await requestValidators.product.validateAsync(req.body, {
        stripUnknown: true,
        abortEarly: false,
        errors: {
          wrap: {
            label: false,
          },
        },
      });

      const product = await prismaClient.product.create({
        data: validationResult,
      });

      return res.status(201).json({
        data: product,
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
      const validationResult = await requestValidators.product.validateAsync(req.body, {
        stripUnknown: true,
        abortEarly: false,
        errors: {
          wrap: {
            label: false,
          },
        },
      });

      const product = await prismaClient.product.update({
        where: {
          id: Number(id),
        },
        data: validationResult,
      });

      return res.json({
        data: product,
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
      const product = await prismaClient.product.delete({
        where: {
          id: Number(id),
        },
      });

      return res.json({
        data: product,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        error,
      });
    }
  }
}

module.exports = ProductsController;
