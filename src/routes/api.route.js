const express = require("express");
const resource = require("../utilities/resource.utility");
const UsersController = require("../controllers/users.controller");
const ProductsController = require("../controllers/products.controller");
const ProductsCategoriesController = require("../controllers/productsCategories.controller");
const CategoriesForProductsController = require("../controllers/categoriesForProducts.controller");
const AcceptanceRulesController = require("../controllers/acceptanceRules.controller");
const TransactionsController = require("../controllers/transactions.controller");
const PlasticsController = require("../controllers/plastics.controller");

const api = express.Router();

api.use("/users", resource(UsersController));
api.use("/products", resource(ProductsController));
api.use("/products-categories", resource(ProductsCategoriesController));
api.use("/categories-for-products", resource(CategoriesForProductsController));
api.use("/acceptance-rules", resource(AcceptanceRulesController));
api.use("/transactions", resource(TransactionsController));
api.use("/plastics", resource(PlasticsController));

module.exports = api;
