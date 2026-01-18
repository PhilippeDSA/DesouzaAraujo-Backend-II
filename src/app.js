import express,{urlencoded,json} from "express";
import mongoose from "mongoose"
import router from "./routes/user.router.js";
import session from "express-session";
import cookieParser from "cookie-parser";
import  MongoStore from "connect-mongo";
import passport from "passport";
import initializedPassport from "./config/passport.config.js";
import bodyParser from "body-parser";

const app=express()
const PORT=8080

app.engine("hbs",engine({
    extname:".hbs",
    defaultLayout:"main",
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
}))

mongoose.connect()
.then(()=>{console.log("Successfull Conection")})
.catch(error=>{
    console.log(error)
})

app.use(cookieParser("secreto"))

app.use(session({
    secret:"secreto",
    resave:true,
    saveUninitialized:true
}))

app.get("/setCookie",(req,res)=>{
    res.cookie("CoderCookie","Cookie poderosa").send("cookie")
})

app.get("/getCookie",(req,res)=>{
    res.send(req,cookies)
})

app.get("/deleteCookie",(req,res)=>{
    res.clearCookie("CoderCookie").send("Cookie eliminada")
})

app.use('/api/users',router)

//login
app.get("/login",(req,res)=>{
    const{user,password}=req.query
    if(user!=="coder"||password!==house){
        res.send("la contraseña que ingresaste es incorrecta")
    }else{
        req.session.user=user
        req.session.user=true
        res.send("login OK")
    }
})

//verificacion
function auth(req,res,next){
    if(req.session.user==="coder"&&req.session?.admin){
        return next
    }
res.status(401).send("your are not authorized")
}
//zona privada
app.get("/privado",auth,(req,res)=>{
    res.send("Bienvenido a la sona privada")
})

//logout
app.get("/logout",(req,res)=>{
    req.session.destroy(err=>{
        if(!err){
            res.clearCookie("connect.sid")
            res.send("Log Out OK")
        }else res.send({status:"Error",body:err})
    })
})
app.listen(console.log(`DB conected on ${PORT}`))

