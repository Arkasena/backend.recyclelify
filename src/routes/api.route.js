const express = require("express");
const resource = require("../utilities/resource.utility");
const { authentication } = require("../middlewares/auth.middleware");
const AuthController = require("../controllers/auth.controller");
const UsersController = require("../controllers/users.controller");
const ProductsController = require("../controllers/products.controller");
const ProductsCategoriesController = require("../controllers/productsCategories.controller");
const CategoriesForProductsController = require("../controllers/categoriesForProducts.controller");
const AcceptanceRulesController = require("../controllers/acceptanceRules.controller");
const TransactionsController = require("../controllers/transactions.controller");
const PlasticsController = require("../controllers/plastics.controller");

const api = express.Router();

api.post("/login", AuthController.login);
api.post("/register", AuthController.register);
api.use("/users", authentication, resource(UsersController));
api.use("/products", authentication, resource(ProductsController));
api.use("/products-categories", authentication, resource(ProductsCategoriesController));
api.use("/categories-for-products", authentication, resource(CategoriesForProductsController));
api.use("/acceptance-rules", authentication, resource(AcceptanceRulesController));
api.use("/transactions", authentication, resource(TransactionsController));
api.use("/plastics", authentication, resource(PlasticsController));

module.exports = api;
