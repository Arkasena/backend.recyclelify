const jwt = require("jsonwebtoken");
const permissions = require("../constants/permissions.constant");
const { UserRole } = require("@prisma/client");

async function auth(req, res, next) {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return res.status(401).json({
      error: {
        token: "require token for access resources",
      },
    });
  }

  if (authorization.split(" ")[0] !== "Bearer") {
    return res.status(401).send({
      error: {
        token: "incorrect token format",
      },
    });
  }

  const token = authorization.split(" ")[1];

  if (!token) {
    return res.status(401).send({
      error: {
        token: "no token provided",
      },
    });
  }

  try {
    const decodeToken = jwt.verify(token, process.env.SECRET_KEY);
    const path = req.path.split("/")[1];

    if (decodeToken.role === UserRole.ADMIN) {
      return next();
    }

    const allowed = permissions[decodeToken.role][path].includes(req.method);

    if (!allowed) {
      return res.status(403).json({
        error: {
          token: "access not allowed",
        },
      });
    }

    next();
  } catch (error) {
    console.error(error);

    return res.status(401).json({
      error: {
        token: "invalid token",
      },
    });
  }
}

module.exports = auth;
