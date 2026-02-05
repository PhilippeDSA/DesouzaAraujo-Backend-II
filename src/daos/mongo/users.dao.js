import { UserModel } from "../../models/user.model.js";

export default class UsersDAO {
  getByEmail = (email) => UserModel.findOne({ email });
  getById = (id) => UserModel.findById(id);
  create = (user) => UserModel.create(user);
}
