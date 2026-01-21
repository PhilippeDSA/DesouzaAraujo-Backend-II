import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import { engine } from "express-handlebars";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import sessionsRouter from "./routes/api/sessions.js";
import viewsRouter from "./routes/views.js";
import passport, { authorize } from "passport";
import initializedPassport from "./config/passport.config.js";
import cookieParser from "cookie-parser";

const app=express();

const PORT=8080

app.engine("hbs",engine({
    extname:"hbs",
    defaultLayout:"main"
}));

app.set("view engine","hbs");
app.set("views","./src/views");
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(session({
    secret:"secretkey",
    resave:false,
    saveUninitialized:true,
    store:MongoStore.create({mongoUrl:"mongodb+srv://philippe:frapicio1234@entregafinalfullstackde.bx9ent0.mongodb.net/"})
}));

app.use(express.static("public"))
app.use(express.json())
app.use(cookieParser())
initializedPassport()
app.use(passport.initialize)
app.use(passport.session())

app.use("/api/sessions",sessionsRouter)
app.use("/",viewsRouter)

app.post("/login",(req,res)=>{
    const{email,password}=req.body
    if(email=="coder@coder.com"&&password=="coderpass"){
        let token=jwt.sign({email,password,role:"user"},"coderSecret"{expiresIn:"24h"})
        res.send({message:"Successfull login",token})
    }
})

app.get("/current",passportCall("jwt"),authorization("user"),(req,res)=>{
    res.send(req.user)
})

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})