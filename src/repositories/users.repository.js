import { UserModel } from "../models/user.model.js";

export default class UsersRepository {
    async findByEmail(email) {
        return UserModel.findOne({ email });
    }

    async findById(id) {
        return UserModel.findById(id);
    }

    async findByResetToken(token) {
        return UserModel.findOne({
            passwordResetToken: token,
            passwordResetExpires: { $gt: Date.now() }
        });
    }

    async create(userData) {
        return UserModel.create(userData);
    }

    async update(user) {
        return user.save();
    }
}
