const {
  PrismaClient,
  UserRole,
  TransactionStatus,
  TransactionHandover,
} = require("@prisma/client");

const prisma = new PrismaClient();

module.exports = {
  prisma,
  UserRole,
  TransactionStatus,
  TransactionHandover,
};
