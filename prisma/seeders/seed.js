const { PrismaClient } = require("@prisma/client");
const users = require("./data/users.js");
const products = require("./data/products.js");
const productsCategories = require("./data/productsCategories.js");
const categoriesForProducts = require("./data/categoriesForProducts.js");
const transactions = require("./data/transactions.js");
const transactionsAcceptanceRules = require("./data/transactionsAcceptanceRules.js");
const plastics = require("./data/plastics.js");

const prisma = new PrismaClient();

async function seed() {
  await prisma.user.createMany({
    data: users,
    skipDuplicates: true,
  });

  await prisma.categoryForProduct.createMany({
    data: categoriesForProducts,
    skipDuplicates: true,
  });
  await prisma.product.createMany({
    data: products,
    skipDuplicates: true,
  });
  await prisma.productCategory.createMany({
    data: productsCategories,
    skipDuplicates: true,
  });

  await prisma.plastic.createMany({
    data: plastics,
    skipDuplicates: true,
  });
  await prisma.transaction.createMany({
    data: transactions,
    skipDuplicates: true,
  });
  await prisma.transactionAcceptanceRule.createMany({
    data: transactionsAcceptanceRules,
    skipDuplicates: true,
  });
}

seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
