import { Router } from "express";
import passport from "passport";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";

import { UserModel } from "../../models/user.model.js";
import UserDTO from "../../dto/user.dto.js";

const router = Router();


router.post("/register", async (req, res) => {
    const { first_name, last_name, email, password } = req.body;

    const exists = await UserModel.findOne({ email });
    if (exists) {
        return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const user = await UserModel.create({
        first_name,
        last_name,
        email,
        password: hashedPassword
    });

    res.status(201).json({
        status: "success",
        message: "User created",
        payload: new UserDTO(user)
    });
});
/* =======================
   LOGIN
======================= */
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
    }

    const isValid = bcrypt.compareSync(password, user.password);
    if (!isValid) {
        return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
        {
            id: user._id,
            email: user.email,
            role: user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

    res.status(200).json({
        status: "success",
        token
    });
});
router.post("/reset-password/:token", async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;

        // Validar que venga el password
        if (!newPassword) {
            return res.status(400).json({ error: "newPassword is required" });
        }

        const user = await UserModel.findOne({
            passwordResetToken: token,
            passwordResetExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ error: "Invalid or expired token" });
        }

        // Guardar el nuevo password
        user.password = bcrypt.hashSync(newPassword, 10);
        user.passwordResetToken = null;
        user.passwordResetExpires = null;

        await user.save();

        res.status(200).json({
            status: "success",
            message: "Password updated successfully"
        });

    } catch (error) {
        console.error("Error resetting password:", error);
        res.status(500).json({
            status: "error",
            message: "Internal server error"
        });
    }
});
/* =======================
   CURRENT (DTO)
======================= */
router.get(
    "/current",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        const userDTO = new UserDTO(req.user);

        res.status(200).json({
            status: "success",
            payload: userDTO
        });
    }
);

/* =======================
   FORGOT PASSWORD
======================= */
router.post("/forgot-password", async (req, res) => {
    const { email } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
        return res.status(200).json({
            status: "success",
            message: "If the email exists, a recovery link was sent"
        });
    }

    const token = crypto.randomBytes(32).toString("hex");

    user.passwordResetToken = token;
    user.passwordResetExpires = Date.now() + 60 * 60 * 1000;
    await user.save();

    const transport = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        }
    });

    const recoveryLink = `http://localhost:8080/reset-password/${token}`;

    await transport.sendMail({
        from: process.env.MAIL_USER,
        to: user.email,
        subject: "Password recovery",
        html: `
            <p>Click the link to reset your password:</p>
            <a href="${recoveryLink}">${recoveryLink}</a>
            <p>This link expires in 1 hour.</p>
        `
    });

    res.status(200).json({
        status: "success",
        message: "Recovery email sent"
    });
});

/* =======================
   RESET PASSWORD
======================= */
router.post("/reset-password/:token", async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    const user = await UserModel.findOne({
        passwordResetToken: token,
        passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
        return res.status(400).json({ error: "Invalid or expired token" });
    }

    user.password = bcrypt.hashSync(newPassword, 10);
    user.passwordResetToken = null;
    user.passwordResetExpires = null;

    await user.save();

    res.status(200).json({
        status: "success",
        message: "Password updated successfully"
    });
});

export default router;
