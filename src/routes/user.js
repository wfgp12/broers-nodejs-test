/*
    Rutas de usuarios
    host + /api/users 
 */

const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const userControllers = require("../controllers/user");
const { fieldValidations } = require("../middlewares/field-validations");
const { validateToken } = require("../middlewares/validate-token");

router.get("/", [validateToken], userControllers.getUsers);
router.get("/:id", [validateToken], userControllers.getUserById);
router.put("/:id", [
    validateToken,
    check("name", "Name is required").optional().not().isEmpty(),
    check("email", "Valid email is required").optional().isEmail(),
    fieldValidations
], userControllers.updateUser);
router.delete("/:id", [validateToken], userControllers.deleteUser);


module.exports = router;