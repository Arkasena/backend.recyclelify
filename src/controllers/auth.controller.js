const jwt = require("jsonwebtoken");
const argon2 = require("argon2");
const prismaClient = require("../utilities/prismaClient.utility");
const schemaValidator = require("../utilities/schemaValidator.utility");
const validationError = require("../utilities/validationError.utility");

class AuthController {
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

      return res.json({ data: token });
    } catch (error) {
      if (error?.details) {
        return res.status(400).json({
          error: validationError(error.details),
        });
      }

      return res.status(500).json({ error });
    }
  }

  static async register(req, res) {
    const {
      username,
      name,
      description,
      phoneNumber,
      email,
      password,
      address,
      photo,
      website,
      role,
    } = req.body;

    const unregisteredUser = {
      username,
      name,
      description: description ? description : undefined,
      phoneNumber,
      email,
      password: await argon2.hash(password),
      address,
      photo: photo ? photo : undefined,
      website: website ? website : undefined,
      role,
    };

    try {
      await schemaValidator.user.validateAsync(unregisteredUser, {
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
              username: username,
            },
            {
              email: email,
            },
          ],
        },
      });

      if (isRegistered) {
        let error = {};
        if (isRegistered.username === username) {
          error.username = "username already registered";
        }
        if (isRegistered.email === email) {
          error.email = "email already registered";
        }

        return res.status(400).json({
          error,
        });
      }

      const user = await prismaClient.user.create({
        data: unregisteredUser,
      });

      return res.json({
        data: user,
      });
    } catch (error) {
      if (error?.details) {
        return res.status(400).json({
          error: validationError(error.details),
        });
      }

      return res.status(500).json({ error });
    }
  }
}

module.exports = AuthController;
