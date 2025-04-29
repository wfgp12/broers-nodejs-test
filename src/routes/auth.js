/*
    Rutas de autenticación
    host + /api/auth 
 */

const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const authControllers = require("../controllers/auth");
const userControllers = require("../controllers/user");

const { fieldValidations } = require("../middlewares/field-validations");
const { validateToken } = require("../middlewares/validate-token");

router.post("/", [
    check("email", "Email is required").isEmail(),
    check("password", "Password is more than 6 characters").isLength({ min: 8 }),
    fieldValidations
], authControllers.login);
router.post("/register", [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Email is required").isEmail(),
    check("password", "Password is more than 8 characters").isLength({ min: 8 }),
    check("confirmPassword", "Confirm password is required").not().isEmpty(),
    check("confirmPassword", "Passwords do not match").custom((value, { req }) => value === req.body.password),
    fieldValidations
], userControllers.createUser);
router.post("/recovery", [
    check("email", "Email is required").isEmail(),
    fieldValidations
], authControllers.passwordRecovery);
router.get('/reset-password/:token', authControllers.showResetPasswordForm);
//TODO: ajustar proceso de restablecimiento de contraseña cuando se disparan los middlewares
router.post('/reset-password/:token',[
    check("newPassword", "Password must be at least 8 characters long").isLength({ min: 8 }),
    fieldValidations
], authControllers.resetPassword);
router.get("/renew", [validateToken], authControllers.renewToken);

module.exports = router;