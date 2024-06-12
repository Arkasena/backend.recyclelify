const joi = require("joi");
const {
  UserRole,
  AcceptanceRuleStatus,
  TransactionStatus,
  TransactionHandover,
} = require("@prisma/client");

const user = joi.object({
  id: joi.number(),
  username: joi.string().alphanum().min(3).max(32).required(),
  name: joi.string().min(3).max(64).required(),
  description: joi.string().max(256),
  phoneNumber: joi.string().min(12).max(16).required(),
  email: joi
    .string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
  password: joi.string().min(8).max(32).required(),
  address: joi.string().max(128).required(),
  photo: joi.string().max(256),
  website: joi.string().max(32),
  role: joi
    .string()
    .alphanum()
    .valid(...Object.values(UserRole))
    .default(UserRole.COLLABORATOR)
    .required(),
  createdAt: joi.date().iso(),
  updatedAt: joi.date().iso(),
});

const product = joi.object({
  id: joi.number(),
  partnerId: joi.number().required(),
  name: joi.string().min(3).max(32).required(),
  description: joi.string().max(256).required(),
  price: joi.number().required(),
  photo: joi.string().max(256).required(),
  link: joi.string().max(256).required(),
  createdAt: joi.date().iso(),
  updatedAt: joi.date().iso(),
});

const productCategory = joi.object({
  productId: joi.number().required(),
  categoryId: joi.number().required(),
});

const categoryForProduct = joi.object({
  id: joi.number(),
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
  createdAt: joi.date().iso(),
  updatedAt: joi.date().iso(),
});

const transaction = joi.object({
  id: joi.number(),
  partnerId: joi.number().required(),
  collaboratorId: joi.number().required(),
  status: joi
    .string()
    .alphanum()
    .valid(...Object.values(TransactionStatus))
    .default(TransactionStatus.SUBMITTED)
    .required(),
  note: joi.string().max(256),
  photo: joi.string().max(256).required(),
  weight: joi.number().precision(30).required(),
  pricePerKilogram: joi.number().required(),
  plasticId: joi.number().required(),
  handover: joi
    .string()
    .alphanum()
    .valid(...Object.values(TransactionHandover))
    .default(TransactionHandover.SELFDELIVERY)
    .required(),
  handoverFee: joi.number().required(),
  transactionTime: joi.date().iso(),
  createdAt: joi.date().iso(),
  updatedAt: joi.date().iso(),
});

const plastic = joi.object({
  id: joi.number(),
  name: joi.string().min(3).max(16).required(),
});

module.exports = {
  user,
  product,
  productCategory,
  categoryForProduct,
  acceptanceRule,
  transaction,
  plastic,
};
