const joi = require("joi");
const {
  UserRole,
  AcceptanceRuleStatus,
  TransactionStatus,
  TransactionHandover,
} = require("@prisma/client");

const updateUser = joi.object({
  username: joi.string().alphanum().min(3).max(32).required(),
  name: joi.string().min(3).max(64).required(),
  description: joi.string().max(256).optional(),
  phoneNumber: joi.string().min(12).max(16).required(),
  email: joi
    .string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
  address: joi.string().max(128).required(),
  website: joi.string().max(32).optional(),
});

const saveUser = updateUser.append({
  password: joi.string().min(8).max(128).required(),
  role: joi
    .string()
    .alphanum()
    .valid(...Object.values(UserRole).filter((role) => role !== UserRole.ADMIN))
    .default(UserRole.COLLABORATOR)
    .required(),
});

const deleteUser = joi.object({
  password: joi.string().min(8).max(128).required(),
});

const login = joi.object({
  email: joi
    .string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
  password: joi.string().min(8).max(128).required(),
});

const resetPassword = joi.object({
  oldPassword: joi.string().min(8).max(128).required(),
  newPassword: joi.string().min(8).max(128).required(),
});

const product = joi.object({
  partnerId: joi.number().required(),
  name: joi.string().min(3).max(32).required(),
  description: joi.string().max(256).required(),
  price: joi.number().required(),
  link: joi.string().max(256).required(),
});

const productCategory = joi.object({
  productId: joi.number().required(),
  categoryId: joi.number().required(),
});

const categoryForProduct = joi.object({
  name: joi.string().min(3).max(32).required(),
});

const acceptanceRule = joi.object({
  partnerId: joi.number().required(),
  plasticId: joi.number().required(),
  pricePerKilogram: joi.number().required(),
  status: joi
    .string()
    .alphanum()
    .valid(...Object.values(AcceptanceRuleStatus))
    .default(AcceptanceRuleStatus.INACTIVE)
    .required(),
  minimumTransactionWeight: joi.number().precision(30).required(),
});

const transaction = joi.object({
  sellerId: joi.number().required(),
  buyerId: joi.number().required(),
  status: joi
    .string()
    .alphanum()
    .valid(...Object.values(TransactionStatus))
    .default(TransactionStatus.SUBMITTED)
    .required(),
  note: joi.string().max(256).optional(),
  weight: joi.number().required(),
  pricePerKilogram: joi.number().required(),
  plasticId: joi.number().required(),
  handover: joi
    .string()
    .alphanum()
    .valid(...Object.values(TransactionHandover))
    .default(TransactionHandover.SELFDELIVERY)
    .required(),
  handoverFee: joi.number().required(),
  transactionTime: joi.date().iso().optional(),
});

const plastic = joi.object({
  name: joi.string().min(3).max(16).required(),
});

module.exports = {
  updateUser,
  saveUser,
  deleteUser,
  login,
  resetPassword,
  product,
  productCategory,
  categoryForProduct,
  acceptanceRule,
  transaction,
  plastic,
};
