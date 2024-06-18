const { uploadDirect } = require("@uploadcare/upload-client");
const prismaClient = require("../utilities/prismaClient.utility");
const requestValidators = require("../utilities/requestValidators.utility");
const validationError = require("../utilities/validationError.utility");

class ProductsController {
  static async index(req, res) {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 9;
    const index = (page - 1) * limit;
    const partnerId = Number(req.query.partnerId) || undefined;
    const name = req.query.name || undefined;
    const nameOrder = req.query.nameOrder || undefined;
    const category = req.query.category || undefined;
    const relations = req.query.relations || [];

    try {
      const total = await prismaClient.product.count({
        where: {
          partnerId: partnerId,
          name: {
            contains: name,
            mode: "insensitive",
          },
          categories: {
            some: {
              category: {
                name: category,
              },
            },
          },
        },
      });

      const products = await prismaClient.product.findMany({
        skip: index,
        take: limit,
        where: {
          partnerId: partnerId,
          name: {
            contains: name,
            mode: "insensitive",
          },
          categories: {
            some: {
              category: {
                name: category,
              },
            },
          },
        },
        orderBy: {
          name: nameOrder,
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
    const photo = req.files?.photo;

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

      let photoLink;

      if (photo) {
        const allowedMimetypes = ["image/jpeg", "image/png"];

        if (allowedMimetypes.includes(photo?.mimetype)) {
          const date = new Date();
          const fileName = `${
            validationResult.partnerId
          }_${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`;

          const uploadPhotoResult = await uploadDirect(photo.data, {
            publicKey: process.env.UPLOADCARE_PUBLIC_KEY,
            store: "auto",
            fileName,
          });

          photoLink = `https://ucarecdn.com/${uploadPhotoResult.uuid}/-/preview/512x512/`;
        } else {
          throw {
            photo: "photo must be jpg, jpeg, or png",
          };
        }
      }

      const product = await prismaClient.product.create({
        data: { ...validationResult, photo: photoLink },
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
