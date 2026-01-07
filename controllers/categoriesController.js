const { getCategories, getPhonesByCategoryId, createCategory, updateCategory, deleteCategory } = require("../db/queries");
const { body, validationResult, matchedData } = require("express-validator");

const validateAdminPassword = require("../validations/categoriesValidation");

const validateCategory = [
    body("name")
        .trim()
        .notEmpty().withMessage("name is required")
        .isLength({ min: 1, max: 20 })
        .withMessage("name must be within 1 and 10 characters")
    
];

async function listCategories (req, res, next ) {
    try {
        const categories =  await getCategories();
        res.render("categories/categoriesList", { categories });
    } catch (error) {
        next(error);
    }
}
    
async function listCategory (req, res, next) {
    const { id } = req.params;
    try {
        const category = await getCategories(id);
        const { rows: phones } = await getPhonesByCategoryId(id);
        console.log(category);
        if (!category) {
            return res.status(404).send("Category not found");
        }
        res.render("categories/categoryDetails", { category, phones });
    } catch (error) {
        next(error);
    }
}

async function createCategoryGet(req, res, next) {
    try {
        res.render("categories/createCategoryForm")
    } catch (error) {
        next(error);
    }
    
}

const createCategoryPost = [
    validateCategory,
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).render("categories/createCategoryForm", {errors: errors.array()})
            }

            const {name} = matchedData(req);
            await createCategory(name)
            return res.redirect("/categories");
        } catch (error) {
            next(error)
        }
    }
]

const updateCategoryGet = [
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const category = await getCategories(id);

      res.render("categories/updateCategoryForm", { category });
    } catch (error) {
      next(error);
    }
  }
];


const updateCategoryPost = [
  validateAdminPassword,
  validateCategory, 
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const errors = validationResult(req);
      const category = await getCategories(id);
      const {adminPassword} = matchedData(req)

      if (!errors.isEmpty()) {
        return res.status(400).render(
          "categories/updateCategoryForm",
          { errors: errors.array(), category }
        );
      }

      if (adminPassword !== process.env.ADMIN_PASSWORD) {
        return res.status(400).render("categories/updateCategoryForm", {error: "invalid admin password", category})
      }



      const { name } = matchedData(req);

      await updateCategory(name, id);
      res.redirect("/categories");
    } catch (error) {
      next(error);
    }
  }
];


const deleteCategories = [
    validateAdminPassword,
    async (req, res, next) => {
        try {
            const {id} = req.params;
            const {rows: phones} = await getPhonesByCategoryId(id);
            const {adminPassword} = req.body;

            if (adminPassword !== process.env.ADMIN_PASSWORD) {
                const categories = await getCategories();
                return res.status(400).render("categories/categoriesList", { error: "Invalid admin password.", categories });
            }

            if (phones.length > 0) {
                const categories = await getCategories();
                return res.status(400).render("categories/categoriesList", { error: "Cannot delete category with associated phones.", categories });
            }

            await deleteCategory(id);
            res.redirect("/categories")
        } catch (error) {
            next(error)
        }

    }
]


module.exports = {
    listCategories,
    listCategory,
    createCategoryGet,
    createCategoryPost,
    updateCategoryGet,
    updateCategoryPost,
    deleteCategories
}