const { UserRole } = require("@prisma/client");

const generalPermissions = {
  "reset-password": ["POST"],
  users: ["PUT", "DELETE"],
  statistic: ["GET"]
};

const permissions = {
  [UserRole.PARTNER]: {
    ...generalPermissions,
    products: ["POST", "PUT", "DELETE"],
    "products-categories": ["POST", "PUT", "DELETE"],
    "categories-for-products": [],
    "acceptance-rules": ["POST", "PUT", "DELETE"],
    transactions: ["GET", "POST", "PUT"],
    plastics: [],
  },
  [UserRole.COLLABORATOR]: {
    ...generalPermissions,
    products: [],
    "products-categories": [],
    "categories-for-products": [],
    "acceptance-rules": [],
    transactions: ["GET", "POST", "PUT"],
    plastics: [],
  },
};

module.exports = permissions;
