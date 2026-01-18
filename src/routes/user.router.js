import { Router } from "express";
import userModel from "../models/user.model.js";

const router=Router() 


router.get("/",async(req,res)=>{
    try{let users=await userModel.find()
        res.send({status:"success",payload:users})
    }catch(error){
        console.log(error)
    }
})

router.put("/:uid",async(req,res)=>{
    let {uid}=req.params
    let userToReplace=req.body
    if(!userToReplace.first_name||!userToReplace.second_name||!userToReplace.email
    ){res.send({status:"error",payload:"Undefinided Params"})
}
let result=await userModel.updateOne({_id:uid},userToReplace)
res.send({result:"success",payload:result})
})

router.post("/",async(req,res)=>{
    let {first_name,second_name,email}=req.body
    if(!userToReplace.first_name||!userToReplace.second_name||!userToReplace.email
    ){res.send({
        status:"error",payload:"Params are missing"
    })}let result=await userModel.create({first_name,second_name,email})
    res.send({result:"success",payload:result})
})

router.delete("/:uid",async(req,res)=>{
    let {uid}=req.params
   let result=await userModel.deleteOne({_id:uid})
   res.send({status:"success",payload:result})
})

export default router