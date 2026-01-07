const {Router} = require("express");
const phoneRouter = Router();
const phoneController = require("../controllers/phoneController");

phoneRouter.get("/", phoneController.listPhonesGet);
phoneRouter.get("/createPhone", phoneController.createPhoneGet);
phoneRouter.post("/createPhone", phoneController.createPhonePost);
phoneRouter.get("/updatePhone/:id", phoneController.updatePhoneGet);
phoneRouter.post("/updatePhone/:id", phoneController.updatePhonePost);
phoneRouter.get("/:id", phoneController.phoneDetailsGet);
phoneRouter.post("/delete/:id", phoneController.deletePhonePost);

 
module.exports = phoneRouter;