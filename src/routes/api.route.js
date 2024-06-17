const express = require("express");
const resource = require("../utilities/resource.utility");
const { authentication } = require("../middlewares/auth.middleware");
const UsersController = require("../controllers/users.controller");
const ProductsController = require("../controllers/products.controller");
const ProductsCategoriesController = require("../controllers/productsCategories.controller");
const CategoriesForProductsController = require("../controllers/categoriesForProducts.controller");
const AcceptanceRulesController = require("../controllers/acceptanceRules.controller");
const TransactionsController = require("../controllers/transactions.controller");
const PlasticsController = require("../controllers/plastics.controller");

const api = express.Router();

api.get("/users", UsersController.index);
api.get("/users/:id", UsersController.show);
api.post("/register", UsersController.register);
api.post("/login", UsersController.login);
api.post("/reset-password", [authentication], UsersController.resetPassword);
api.put("/users/:id", [authentication], UsersController.update);
api.delete("/delete-account", [authentication], UsersController.delete);

api.use("/products", resource(ProductsController, [authentication]));
api.use("/products-categories", resource(ProductsCategoriesController, [authentication]));
api.use("/categories-for-products", resource(CategoriesForProductsController, [authentication]));
api.use("/acceptance-rules", resource(AcceptanceRulesController, [authentication]));
api.use("/transactions", resource(TransactionsController, [authentication], true));
api.use("/plastics", resource(PlasticsController, [authentication]));

module.exports = api;
