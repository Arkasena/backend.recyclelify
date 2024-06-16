const jwt = require("jsonwebtoken");

async function authentication(req, res, next) {
  const fullToken = req.headers.authorization;

  if (!fullToken) {
    return res.status(401).json({
      error: {
        token: "require token for access resources",
      },
    });
  }

  if (fullToken.split(" ")[0] !== "Bearer") {
    return res.status(401).send({
      error: {
        token: "incorrect token format",
      },
    });
  }

  const token = fullToken.split(" ")[1];

  if (!token) {
    return res.status(401).send({
      error: {
        token: "no token provided",
      },
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    req.token = decoded;

    next();
  } catch (error) {
    console.log(error);

    return res.status(401).json({
      error: {
        token: "invalid token",
      },
    });
  }
}

module.exports = { authentication };
