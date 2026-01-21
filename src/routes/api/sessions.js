import { Router } from "express";
import user from "../../models/user.model.js"
import { createHash,isValidPassword } from "../../views/utils";
import passport from "passport";

const router=Router();

router.post("/register",passport.authenticate("register",{failureRedirect:"/failregister"}),async(req,res)=>{
    res.send({status:"success",message:"User registered"})
});
router.get("failregister",async(req,res)=>{
    console.log("Strategy Failed")
    res.send({error:"Failed"})
});

router.post("/login",passport.authenticate("login",{failureRedirect:"/faillogin"}),
async(req,res)=>{
    if(!req.user)return res.status(400).send({status:"error",error:"Invalid Credentials"})

        req.session.user={
first_name:req.user.first_name,
second_name:req.user.second_name,
            age:req.user.age,
           email:req.user.email,
        }
        res.send({status:"success",payload:req.user})
    });
    router.get("/faillogin",(req,res)=>{
        res.send("Login Failed")
    })
    router.post("logout",(req,res)=>{
        req.session.destroy((error)=>{
            if(err) return res.status(500).send("Error Loggin Out")
                res.redirect("/login")
        });
    });
    export default router