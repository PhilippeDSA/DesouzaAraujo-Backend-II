import { Router } from "express";
import passport from "passport";
import { purchaseCart } from "../../controllers/carts.controller";

const router = Router();

router.post(
    "/:cid/purchase",
    passport.authenticate("jwt", { sesison: false }),
    purchaseCart
);

export default router;