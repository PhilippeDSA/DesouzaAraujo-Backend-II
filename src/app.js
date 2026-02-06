import "dotenv/config"; // 👈 esto VA PRIMERO

import express from "express";
import passport from "passport";
import { connectDB } from "./config/database.js";
import "./config/passport.config.js";
import routes from "./routes/index.js";
const app = express();

// Middlewares base
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// Routes
app.use("/api", routes);

// DB + Server
const PORT = 8080;

connectDB();

app.listen(PORT, () => {
  console.log(`Servidor arriba en puerto ${PORT}`);
});
