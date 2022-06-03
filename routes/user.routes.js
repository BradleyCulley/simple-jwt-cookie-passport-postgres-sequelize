const router = require('express').Router();
const passport = require("passport");
const users = require("../controllers/users.controller");

router.get('/secret', passport.authenticate('jwt', { session: false }), users.findAll);

module.exports = router;
