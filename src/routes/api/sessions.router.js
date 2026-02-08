import { Router } from "express";
import passport from "passport";
import UserDTO from "../../dto/user.dto.js";
import { checkRole } from "../../middlewares/role.middleware.js";
import AuthService from "../../services/auth.service.js";
import PasswordService from "../../services/password.service.js";

const router = Router();
const authService = new AuthService();
const passwordService = new PasswordService();

/* REGISTER */
router.post("/register", async (req, res) => {
    try {
        const user = await authService.register(req.body);
        res.status(201).json({
            status: "success",
            payload: new UserDTO(user)
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            status: "error",
            message: error.message
        });
    }
});

/* LOGIN */
router.post("/login", async (req, res) => {
    try {
        const token = await authService.login(req.body);
        res.status(200).json({ status: "success", token });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            status: "error",
            message: error.message
        });
    }
});

/* CURRENT */
router.get(
    "/current",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        res.status(200).json({
            status: "success",
            payload: new UserDTO(req.user)
        });
    }
);

/* FORGOT PASSWORD */
router.post("/forgot-password", async (req, res) => {
    await passwordService.forgotPassword(req.body.email);
    res.status(200).json({
        status: "success",
        message: "If the email exists, a recovery link was sent"
    });
});

/* RESET PASSWORD */
router.post("/reset-password/:token", async (req, res) => {
    try {
        await passwordService.resetPassword(
            req.params.token,
            req.body.newPassword
        );

        res.status(200).json({
            status: "success",
            message: "Password updated successfully"
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            status: "error",
            message: error.message
        });
    }
});

export default router;
