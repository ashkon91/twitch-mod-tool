var OAuth2Strategy = require('passport-oauth').OAuth2Strategy;
var passport       = require('passport');
var session        = require('express-session');

const router = require('express').Router();

// Set route to start OAuth link, this is where you define scopes to request
router.get('/twitch', passport.authenticate('twitch', { scope: 'user_read' }));

// Set route for OAuth redirect
router.get('/twitch/callback', passport.authenticate('twitch', { successRedirect: '/', failureRedirect: '/' }));

module.exports = router;