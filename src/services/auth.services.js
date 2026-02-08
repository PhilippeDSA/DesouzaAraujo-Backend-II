import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UsersRepository from "../repositories/users.repository.js";
import CustomError from "../errors/custom.errors.js";
import { Errors } from "../errors/errors.enum.js";

export default class AuthService {
    constructor() {
        this.usersRepository = new UsersRepository();
    }
    async register({ first_name, last_name, email, password }) {
        const exists = await this.usersRepository.findByEmail(email);
        if (exists) {
            throw new CustomError(Errors.USER_EXISTS, 400);
        }
        const hashedPassword = bcrypt.hashSync(password, 10);

        const user = await this.usersRepository.create({
            first_name,
            last_name,
            email,
            password: hashedPassword
        });
        return user;
    }
    async login({ email, password }) {
        const user = await this.usersRepository.findByEmail(email);
        if (!user) {
            throw new CustomError(Errors.INVALID_CREDENTIALS, 401);
        }
        const valid = bcrypt.compareSync(password, user.password);
        if (!valid) {
            throw new CustomError(Errors.INVALID_CREDENTIALS, 401);
        }
        return jwt.sign(
            {
                id: user_id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );
    }
}