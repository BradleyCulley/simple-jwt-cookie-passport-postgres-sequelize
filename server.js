require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const passport = require('passport')

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const {strategy, jwtOptions} = require("./config/passport.config");

const port = process.env.PORT || 8080
const app = express()

passport.use(strategy);

app.use(passport.initialize())

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cookieParser(jwtOptions.secretOrKey));

app.use('/auth', authRoutes);
app.use('/user', userRoutes);

app.listen(port);
console.log(`Running on port ${port}`);
