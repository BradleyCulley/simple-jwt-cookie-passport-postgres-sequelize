const bcrypt = require("bcrypt");
const {jwtOptions} = require("../config/passport.config");
const jwt = require("jsonwebtoken");
const db = require("../models");
const User = db.users;

exports.register = async (req, res) => {
    const { email, password, administrativePassword } = req.body;

    if(!administrativePassword) {
        return res.status(400).json({error: 'You must provide an administrative password.'});
    }

    if(administrativePassword !== process.env.ADMINISTRATIVE_PASSWORD) {
        return res.status(400).json({error: 'The administrative password you provided is incorrect.'});
    }

    if (!email) {
        return res.status(400).json({error: 'You must enter an email address.'});
    }

    if (!password) {
        return res.status(400).json({error: 'You must enter a password.'});
    }

    const existingUser = await User.findOne({
        where: {
            email
        }
    });

    if (existingUser) {
        return res
            .status(400)
            .json({error: 'That email address is already in use.'});
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
        email,
        password: hashedPassword
    });

    await user.save();

    res.status(200).json({
        success: true,
        message: 'User successfully registered.'
    });
};

exports.login = async (req, res) => {
    const {email, password} = req.body;

    if (!email) {
        return res.status(400).json({error: 'You must enter an email address.'});
    }

    if (!password) {
        return res.status(400).json({error: 'You must enter a password.'});
    }

    const user = await User.findOne({
        where: {
            email
        }
    });

    if (!user) {
        return res
            .status(400)
            .send({error: 'No user found for this email address.'});
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({
            success: false,
            error: 'Incorrect password.'
        });
    } else {
        const payload = {
            sub: user.email,
            aud: jwtOptions.audience,
            iss: jwtOptions.issuer
        }
        const token = jwt.sign(payload, jwtOptions.secretOrKey)
        res
            .cookie(jwtOptions.jwtCookieName, token, {httpOnly: true, secure: true, signed: true})
            .json({ message: 'ok', token: token })
    }
};
