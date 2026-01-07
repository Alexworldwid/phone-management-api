const {getPhones, getCategories, createPhone, updatePhone, deletePhone} = require("../db/queries");
const { body, validationResult, matchedData } = require("express-validator");
const validateAdminPassword = require("../validations/categoriesValidation");

const validatePhone = [
    body("category_id")
        .notEmpty().withMessage("category_id is required"),
    body("model_name")
        .trim()
        .notEmpty().withMessage("model_name is required")
        .isLength({ min: 1, max: 50 })
        .withMessage("model_name must be within 1 and 50 characters"),
    body("release_year")
        .notEmpty().withMessage("release_year is required")
        .isInt({ min: 1970, max: new Date().getFullYear() })
        .withMessage(`release_year must be an integer between 1970 and ${new Date().getFullYear()}`),   
    body("price")
        .notEmpty().withMessage("price is required")
        .isFloat({ min: 0 })
        .withMessage("price must be a positive number")
]


async function listPhonesGet(req, res, next) {
    try {
        const phones = await getPhones();
        console.log(phones)
        res.render("phones/phonesList", { phones });
    } catch (error) {
        next(error);
    }
}

async function phoneDetailsGet(req, res, next) {
    try {
        const {id} = req.params;
        const phone = await getPhones(id);
        if (!phone) {
            const error = new Error("Phone not found");
            error.status = 404;
            throw error;
        }
        res.render("phones/phoneDetails", { phone });
    } catch (error) {
        next(error)
    }
}

async function createPhoneGet(req, res, next) {
    try {
        const categories = await getCategories();
        res.render("phones/createPhoneForm", {categories});
    } catch (error) {
        next(error)
    }
}

const createPhonePost = [
    validateAdminPassword,
    validatePhone,
    async function (req, res, next) {
        try {
            const errors = validationResult(req);
            const {adminPassword} = matchedData(req);
            const {category_id, model_name, release_year, price} = matchedData(req);

            if (adminPassword !== process.env.ADMIN_PASSWORD) {
                errors.errors.push({ msg: "Invalid admin password", param: "adminPassword" });
            }

            if (!errors.isEmpty()) {
                const categories = await getCategories();
                return res.status(400).render("phones/createPhoneForm", {categories, errors: errors.array()})
            }

            await createPhone(category_id, model_name, release_year, price);
            res.redirect("/phones");
        } catch (error) {
            next(error)
        }
    }
]

async function updatePhoneGet(req, res, next) {
    try {
        const {id} = req.params;
        const phone = await getPhones(id);
        const categories = await getCategories();
        console.log(phone)
        if (!phone) {
            const error = new Error("Phone not found");
            error.status = 404;
            next(error);
        }

        res.render("phones/updatePhoneForm", {phone, categories});
    } catch (error) {
        next(error)
    }
}

const updatePhonePost = [
    validateAdminPassword,
    validatePhone,
    async (req, res, next) => {
        try {
            const {id} = req.params;
            const errors = validationResult(req);
            const {adminPassword} = matchedData(req);
            const {category_id, model_name, release_year, price} = matchedData(req);
            
            if (adminPassword !== process.env.ADMIN_PASSWORD) {
                errors.errors.push({ msg: "Invalid admin password", param: "adminPassword" });
            }

            if (!errors.isEmpty()) {
                const phone = await getPhones(id);
                const categories = await getCategories();
                return res.status(400).render("phones/updatePhoneForm", {phone, categories, errors: errors.array()})
            }

            await updatePhone(category_id, model_name, release_year, price, id);
            res.redirect("/phones");
        } catch (error) {
            next(error)
        }
    }
];

const deletePhonePost = [
  validateAdminPassword,
  async (req, res, next) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        const phones = await getPhones()
        return res.status(400).render("phones/phonesList", {
          errors: errors.array(),
          phones
        });
      }

      const { adminPassword } = matchedData(req);
      const {id} = req.params;

      if (adminPassword !== process.env.ADMIN_PASSWORD) {
        const phones = await getPhones()
        return res.status(403).render("phones/phonesList", {
          errors: [{ msg: "Invalid admin password" }],
          phones
        });
      }

      await deletePhone(id);
      res.redirect("/phones");
    } catch (error) {
      next(error);
    }
  }
];


module.exports = {
    listPhonesGet,
    phoneDetailsGet,
    createPhoneGet,
    createPhonePost,
    updatePhoneGet,
    updatePhonePost,
    deletePhonePost
}