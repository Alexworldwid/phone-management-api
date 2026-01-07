const { body } = require("express-validator");

const validateAdminPassword = [
  body("adminPassword")
    .notEmpty()
    .withMessage("Admin password is required")
];

module.exports = validateAdminPassword;
