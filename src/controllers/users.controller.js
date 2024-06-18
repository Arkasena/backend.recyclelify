const jwt = require("jsonwebtoken");
const argon2 = require("argon2");
const { UserRole } = require("@prisma/client");
const { uploadDirect } = require("@uploadcare/upload-client");
const prismaClient = require("../utilities/prismaClient.utility");
const requestValidators = require("../utilities/requestValidators.utility");
const validationError = require("../utilities/validationError.utility");
const { exclude } = require("../utilities/common.utility");

class UsersController {
  static async index(req, res) {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 9;
    const index = (page - 1) * limit;
    const role = UserRole[req.query.role?.toUpperCase()];
    const name = req.query.name || undefined;
    const nameOrder = req.query.nameOrder || undefined;
    const plastic = req.query.plastic || undefined;
    const relations = req.query.relations || [];

    try {
      const total = await prismaClient.user.count({
        where: {
          role,
          name: {
            contains: name,
            mode: "insensitive",
          },
          acceptanceRules: {
            some: {
              plastic: {
                name: plastic,
              },
            },
          },
        },
      });

      let users = await prismaClient.user.findMany({
        skip: index,
        take: limit,
        where: {
          role,
          name: {
            contains: name,
            mode: "insensitive",
          },
          acceptanceRules: {
            some: {
              plastic: {
                name: plastic,
              },
            },
          },
        },
        orderBy: {
          name: nameOrder,
        },
        include: {
          products: relations.includes("products")
            ? {
                include: {
                  categories: {
                    include: {
                      category: true,
                    },
                  },
                },
              }
            : false,
          acceptanceRules: relations.includes("acceptanceRules")
            ? {
                include: {
                  plastic: true,
                },
              }
            : false,
          sellerTransactions: relations.includes("sellerTransactions")
            ? {
                include: {
                  plastic: true,
                },
              }
            : false,
          buyerTransactions: relations.includes("buyerTransactions")
            ? {
                include: {
                  plastic: true,
                },
              }
            : false,
        },
      });

      users = users.map((user) => {
        return exclude(user, ["password"]);
      });

      return res.json({
        data: users,
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
      let user = await prismaClient.user.findUnique({
        where: {
          id: Number(id),
        },
        include: {
          products: relations.includes("products")
            ? {
                include: {
                  categories: {
                    include: {
                      category: true,
                    },
                  },
                },
              }
            : false,
          acceptanceRules: relations.includes("acceptanceRules")
            ? {
                include: {
                  plastic: true,
                },
              }
            : false,
          sellerTransactions: relations.includes("sellerTransactions")
            ? {
                include: {
                  plastic: true,
                },
              }
            : false,
          buyerTransactions: relations.includes("buyerTransactions")
            ? {
                include: {
                  plastic: true,
                },
              }
            : false,
        },
      });

      user = exclude(user, ["password"]);

      return res.json({
        data: user,
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
      const validationResult = await requestValidators.saveUser.validateAsync(req.body, {
        stripUnknown: true,
        abortEarly: false,
        errors: {
          wrap: {
            label: false,
          },
        },
      });

      const isRegistered = await prismaClient.user.findFirst({
        where: {
          OR: [
            {
              username: validationResult.username,
            },
            {
              email: validationResult.email,
            },
          ],
        },
      });

      if (isRegistered) {
        let error = {};
        if (isRegistered.username === validationResult.username) {
          error.username = "username already registered";
        }
        if (isRegistered.email === validationResult.email) {
          error.email = "email already registered";
        }

        return res.status(400).json({
          error,
        });
      }

      let user = await prismaClient.user.create({
        data: { ...validationResult, password: await argon2.hash(validationResult.password) },
      });

      const token = jwt.sign(
        {
          id: user.id,
          role: user.role,
        },
        process.env.SECRET_KEY,
        { expiresIn: 60 * 60 }
      );

      return res.status(201).json({
        data: {
          token,
          user: {
            id: user.id,
            role: user.role,
          },
        },
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
    const photo = req.files?.photo;

    try {
      const validationResult = await requestValidators.updateUser.validateAsync(req.body, {
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
          const uploadPhotoResult = await uploadDirect(photo.data, {
            publicKey: process.env.UPLOADCARE_PUBLIC_KEY,
            store: "auto",
            fileName: validationResult.username,
          });

          photoLink = `https://ucarecdn.com/${uploadPhotoResult.uuid}/-/preview/512x512/`;
        } else {
          throw {
            photo: "photo must be jpg, jpeg, or png",
          };
        }
      }

      let user = await prismaClient.user.update({
        where: {
          id: Number(id),
        },
        data: { ...validationResult, photo: photoLink },
      });

      user = exclude(user, ["password"]);

      return res.json({
        data: user,
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
      let user = await prismaClient.user.delete({
        where: {
          id: Number(id),
        },
      });

      user = exclude(user, ["password"]);

      return res.json({
        data: user,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        error,
      });
    }
  }

  static async login(req, res) {
    try {
      const validationResult = await requestValidators.login.validateAsync(req.body, {
        stripUnknown: true,
        abortEarly: false,
        errors: {
          wrap: {
            label: false,
          },
        },
      });

      const user = await prismaClient.user.findUnique({
        where: {
          email: validationResult.email,
        },
        select: {
          id: true,
          password: true,
          role: true,
        },
      });

      if (!user) {
        return res.status(404).json({
          error: {
            email: "email not registered",
          },
        });
      }

      const verify = await argon2.verify(user.password, validationResult.password);

      if (!verify) {
        return res.status(401).json({
          error: {
            password: "incorrect password",
          },
        });
      }

      const token = jwt.sign(
        {
          id: user.id,
          role: user.role,
        },
        process.env.SECRET_KEY,
        { expiresIn: 60 * 60 }
      );

      return res.json({
        data: {
          token,
          user: {
            id: user.id,
            role: user.role,
          },
        },
      });
    } catch (error) {
      console.error(error);

      if (error?.details) {
        return res.status(400).json({
          error: validationError(error.details),
        });
      }

      return res.status(500).json({ error });
    }
  }

  static async resetPassword(req, res) {
    const { id } = req.params;

    try {
      const validationResult = await requestValidators.resetPassword.validateAsync(req.body, {
        stripUnknown: true,
        abortEarly: false,
        errors: {
          wrap: {
            label: false,
          },
        },
      });

      const user = await prismaClient.user.findUnique({
        where: {
          id: Number(id),
        },
        select: {
          password: true,
        },
      });

      if (!user) {
        return res.status(404).json({
          error: {
            email: "user not found",
          },
        });
      }

      const verify = await argon2.verify(user.password, validationResult.oldPassword);

      if (!verify) {
        return res.status(401).json({
          error: {
            password: "incorrect old password",
          },
        });
      }

      const updatePassword = await prismaClient.user.update({
        where: {
          id: Number(id),
        },
        data: { password: await argon2.hash(validationResult.newPassword) },
      });

      if (!updatePassword) {
        return res.status(500).json({
          data: {
            password: "password failed to updated",
          },
        });
      }

      return res.json({
        data: {
          password: "password updated successfully",
        },
      });
    } catch (error) {
      console.error(error);

      if (error?.details) {
        return res.status(400).json({
          error: validationError(error.details),
        });
      }

      return res.status(500).json({ error });
    }
  }
}

module.exports = UsersController;
