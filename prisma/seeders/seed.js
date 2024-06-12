const { PrismaClient } = require("@prisma/client");
const users = require("./data/users.seeder.js");
const products = require("./data/products.seeder.js");
const productsCategories = require("./data/productsCategories.seeder.js");
const categoriesForProducts = require("./data/categoriesForProducts.seeder.js");
const transactions = require("./data/transactions.seeder.js");
const acceptanceRules = require("./data/acceptanceRules.seeder.js");
const plastics = require("./data/plastics.seeder.js");

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
  await prisma.acceptanceRule.createMany({
    data: acceptanceRules,
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
