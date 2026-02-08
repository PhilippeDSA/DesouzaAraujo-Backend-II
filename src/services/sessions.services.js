import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";
import UserDTO from "../dto/user.dto.js";
import UsersRepository from "../repositories/users.repository.js";
import CustomError from "../errors/custom.errors.js";
import { Errors } from "../errors/errors.enum.js";


export default class SessionsService {
    constructor() {
        this.usersRepository = new UsersRepository();
    }

    async register({ first_name, last_name, email, password }) {
        const exists = await this.usersRepository.findByEmail(email);
        if (exists) throw new CustomError(Error.USER_EXISTS, 400);

        const hashedPassword = bcrypt.hashSync(password, 10);

        const user = await this.usersRepository.create({
            first_name,
            last_name,
            email,
            password: hashedPassword,
            role: "user"
        });

        return new UserDTO(user);
    }

    async login({ email, password }) {
        const user = await this.usersRepository.findByEmail(email);
        if (!user) throw new Error("INVALID_CREDENTIALS");

        const valid = bcrypt.compareSync(password, user.password);
        if (!valid) throw new Error("INVALID_CREDENTIALS");

        return jwt.sign(
            {
                id: user._id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );
    }

    async forgotPassword(email) {
        const user = await this.usersRepository.findByEmail(email);
        if (!user) return;

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

        const link = `http://localhost:8080/api/sessions/reset-password/${token}`;

        await transport.sendMail({
            from: process.env.MAIL_USER,
            to: user.email,
            subject: "Password recovery",
            html: `
                <p>Click the link to reset your password:</p>
                <a href="${link}">${link}</a>
                <p>This link expires in 1 hour.</p>
            `
        });
    }

    async resetPassword(token, newPassword) {
        const user = await this.usersRepository.findByResetToken(token);
        if (!user) throw new Error("INVALID_TOKEN");

        user.password = bcrypt.hashSync(newPassword, 10);
        user.passwordResetToken = null;
        user.passwordResetExpires = null;

        await this.usersRepository.update(user);
    }
}
