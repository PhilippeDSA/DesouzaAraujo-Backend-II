import express from "express";
import mongoose from "mongoose";
import passport from "passport";
import { initializePassport } from "./config/passport.config.js";
import sessionsRouter from "./routes/api/sessions.js";

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

initializePassport();
app.use(passport.initialize());

app.use("/api/sessions", sessionsRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
