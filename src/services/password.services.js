import crypto from "crypto";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import UsersRepository from "../repositories/users.repository.js";
import CustomError from "../errors/custom.error.js";
import { Errors } from "../errors/errors.enum.js";

export default class PasswordService {
    constructor() {
        this.usersRepository = new UsersRepository();
    }

    async forgotPassword(email) {
        const user = await this.usersRepository.findByEmail(email);
        if (!user) return; // seguridad: no revelar existencia

        const token = crypto.randomBytes(32).toString("hex");

        user.passwordResetToken = token;
        user.passwordResetExpires = Date.now() + 60 * 60 * 1000;

        await this.usersRepository.update(user);

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
    }

    async resetPassword(token, newPassword) {
        const user = await this.usersRepository.findByResetToken(token);
        if (!user) {
            throw new CustomError(Errors.INVALID_TOKEN, 400);
        }

        user.password = bcrypt.hashSync(newPassword, 10);
        user.passwordResetToken = null;
        user.passwordResetExpires = null;

        await this.usersRepository.update(user);
    }
}
