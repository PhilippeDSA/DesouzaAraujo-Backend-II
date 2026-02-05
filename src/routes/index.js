import { Router } from "express";
import sessionsRouter from "./api/sessions.router.js";

const router = Router();

router.use("/sessions", sessionsRouter);

export default router;
