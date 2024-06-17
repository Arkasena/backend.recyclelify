const express = require("express");
const auth = require("../middlewares/auth.middleware");
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
api.post("/reset-password/:id", auth, UsersController.resetPassword);
api.put("/users/:id", auth, UsersController.update);
api.delete("/delete-account/:id", auth, UsersController.delete);

api.get("/products", ProductsController.index);
api.get("/products/:id", ProductsController.show);
api.post("/products", auth, ProductsController.save);
api.put("/products/:id", auth, ProductsController.update);
api.delete("/products/:id", auth, ProductsController.delete);

api.get("/products-categories", ProductsCategoriesController.index);
api.get("/products-categories/:id", ProductsCategoriesController.show);
api.post("/products-categories", auth, ProductsCategoriesController.save);
api.put("/products-categories/:id", auth, ProductsCategoriesController.update);
api.delete("/products-categories/:id", auth, ProductsCategoriesController.delete);

api.get("/categories-for-products", CategoriesForProductsController.index);
api.get("/categories-for-products/:id", CategoriesForProductsController.show);
api.post("/categories-for-products", auth, CategoriesForProductsController.save);
api.put("/categories-for-products/:id", auth, CategoriesForProductsController.update);
api.delete("/categories-for-products/:id", auth, CategoriesForProductsController.delete);

api.get("/acceptance-rules", AcceptanceRulesController.index);
api.get("/acceptance-rules/:id", AcceptanceRulesController.show);
api.post("/acceptance-rules", auth, AcceptanceRulesController.save);
api.put("/acceptance-rules/:id", auth, AcceptanceRulesController.update);
api.delete("/acceptance-rules/:id", auth, AcceptanceRulesController.delete);

api.get("/transactions", auth, TransactionsController.index);
api.get("/transactions/:id", auth, TransactionsController.show);
api.post("/transactions", auth, TransactionsController.save);
api.put("/transactions/:id", auth, TransactionsController.update);
api.delete("/transactions/:id", auth, TransactionsController.delete);

api.get("/plastics", PlasticsController.index);
api.get("/plastics/:id", PlasticsController.show);
api.post("/plastics", auth, PlasticsController.save);
api.put("/plastics/:id", auth, PlasticsController.update);
api.delete("/plastics/:id", auth, PlasticsController.delete);

module.exports = api;
