const passportJWT = require('passport-jwt')
const { ExtractJwt, Strategy: JwtStrategy } = passportJWT;
const { fromExtractors } = ExtractJwt;
const db = require("../models");
const User = db.users;

function cookieExtractor(req) {
    let token = null;
    if (req && req.cookies)
    {
        token = req.signedCookies[jwtOptions.jwtCookieName];
    }
    return token;
}

const jwtOptions = {
    jwtFromRequest: fromExtractors([cookieExtractor]),
    secretOrKey: process.env.JWT_SECRET,
    jwtCookieName: 'jwt'
}

const strategy = new JwtStrategy(jwtOptions,
    async (jwt_payload, next) => {
        const user = await User.findOne({
            where: {
                email: jwt_payload.sub
            }
        });
        if (user) {
            next(null, user);
        } else {
            next(null, false);
        }
    }
)

exports.jwtOptions = jwtOptions;
exports.strategy = strategy;
