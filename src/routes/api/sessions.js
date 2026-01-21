import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

const router = Router();

// REGISTER
router.post(
  "/register",
  passport.authenticate("register", { session: false }),
  (req, res) => {
    res.send({ status: "success", message: "User registered" });
  }
);

// LOGIN
router.post(
  "/login",
  passport.authenticate("login", { session: false }),
  (req, res) => {
    const user = req.user;

    const token = jwt.sign(
      { user },
      "coderSecret",
      { expiresIn: "24h" }
    );

    res.send({
      status: "success",
      token
    });
  }
);

// CURRENT
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.send({
      status: "success",
      user: req.user
    });
  }
);

export default router;
