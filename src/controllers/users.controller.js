const jwt = require("jsonwebtoken");
const argon2 = require("argon2");
const { UserRole } = require("@prisma/client");
const prismaClient = require("../utilities/prismaClient.utility");
const schemaValidator = require("../utilities/schemaValidator.utility");
const validationError = require("../utilities/validationError.utility");
const { exclude } = require("../utilities/common.utility");

class UsersController {
  static async index(req, res) {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 9;
    const index = (page - 1) * limit;
    const role = UserRole[req.query.role?.toUpperCase()];
    const relations = req.query.relations || [];

    try {
      const total = await prismaClient.user.count({
        where: {
          role,
        },
      });

      let users = await prismaClient.user.findMany({
        skip: index,
        take: limit,
        where: {
          role,
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

  static async register(req, res) {
    try {
      const validationResult = await schemaValidator.user.validateAsync(req.body, {
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

  static async login(req, res) {
    const { email, password } = req.body;

    try {
      await schemaValidator.credentials.validateAsync(
        {
          email,
          password,
        },
        {
          abortEarly: false,
          error: {
            wrap: {
              label: false,
            },
          },
        }
      );

      const user = await prismaClient.user.findUnique({
        where: {
          email,
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

      const verify = await argon2.verify(user.password, password);

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
    return res.status(500).json({
      error: "under development",
    });
  }

  static async update(req, res) {
    const { id } = req.params;

    try {
      const validationResult = await schemaValidator.user.validateAsync(req.body, {
        stripUnknown: true,
        abortEarly: false,
        errors: {
          wrap: {
            label: false,
          },
        },
      });

      let user = await prismaClient.user.update({
        where: {
          id: Number(id),
        },
        data: { ...validationResult, password: await argon2.hash(validationResult.password) },
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
}

module.exports = UsersController;
