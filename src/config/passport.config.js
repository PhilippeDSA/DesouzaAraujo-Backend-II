import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { UserModel } from "../models/user.model.js";


const cookieExtractor = (req) => {
    let token = null;
    if (req && req.headers.authorization) {
        token = req.headers.authorization.split(" ")[1];
    }
    return token;
};

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
};

passport.use(
    "jwt",
    new JwtStrategy(opts, async (jwt_payload, done) => {
        try {
            const user = await UserModel.findById(jwt_payload.id);
            if (!user) return done(null, false);

            return done(null, user);
        } catch (error) {
            return done(error, false);
        }
    })
);
