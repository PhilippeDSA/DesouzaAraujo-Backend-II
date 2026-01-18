import mongoose from "mongoose";


const userCollection="users"

const userSchema=new mongoose.Schema(
    {first_name:{type:String,required:true,max:100},
      second_name:{type:String,required:true,max:100},
      email:{type:String,required:true,max:100},
      age:{type:Number,required:true,max :3},
     password:{type:String,required:true,max :3},
     cart:{type:Number,required:true,max :3},
     role:{type:String,default:'user',required:true,max :3}})



const userModel= mongoose.model(userCollection,userSchema)

export default userModel    