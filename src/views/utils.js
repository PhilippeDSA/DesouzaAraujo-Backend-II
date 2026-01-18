import bcyrpt from "bcrypt";

export const createHash=password=>bcyrpt.hashSync(password,bcyrpt.genSaltSync(10))

export const isValidPassword=(user,password)=>bcyrpt.compareSync(password,user.password)

