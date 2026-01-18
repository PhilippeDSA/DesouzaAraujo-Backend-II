import passport from "passport";
import local from "passport-local";
import userService from "../models/user.model.js";
import {createHash,isValidPassword} from "../views/utils.js"

const localStrategy=local.Strategy

const initializedPassport=()=>{
    passport.use('register',new localStrategy({
        passReqToCallBack:true,usernameField:'email'
    },async(req,userName,password,done)=>{
        const{first_name,second_name,email,ager}=req.body
    try{
        let user= await userService.findOne({email:username})
    if(user){
        console.log("user already exists")
    return done(null,false)}
    const newUser={
        first_name,last_name,age,password:createHash(password),
        cart,role}
        let result=await userService.create(newUser)
    return done(null,result)}
    catch(error){
        return done("Error getting user", error)
    }
    }
))
}
passport.serializeUser((user,done)=>{
    done(null,user._id)
})
passport.deserializeUser(async (user,done)=>{
    let user= await userService.findById(id)
    done(null,user)
})
passport.use('login',new localStrategy({
    usernameField:'email'},async (username,password,done)=>{
        try{
            const user=await userService.findOne({email:username})
            if(!user){
                console.log("user doesnt exists")
                return done(null,false)
            }
            if (!isValidPassword(user,password))
                return done(null,false)
            return done(null,user)
        }catch(error){
            return done(error)
        }
    }))
export default initializedPassport