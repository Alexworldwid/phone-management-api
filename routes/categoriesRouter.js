const {Router} = require("express");

const categoriesController = require("../controllers/categoriesController");
const categoriesRouter = Router();


categoriesRouter.get("/create", categoriesController.createCategoryGet);
categoriesRouter.post("/create", categoriesController.createCategoryPost);
categoriesRouter.get("/", categoriesController.listCategories);
categoriesRouter.get("/:id", categoriesController.listCategory);
categoriesRouter.get("/update/:id", categoriesController.updateCategoryGet);
categoriesRouter.post("/update/:id", categoriesController.updateCategoryPost);
categoriesRouter.post("/delete/:id", categoriesController.deleteCategories)



module.exports = categoriesRouter;