const bodyParser = require("body-parser");
const express = require('express');
const handlebars     = require('handlebars');
const handlebars3 = require('express3-handlebars')
const OAuth2Strategy = require('passport-oauth').OAuth2Strategy;
const passport = require('passport');
const path = require('path');
const request        = require('request');
const session        = require('express-session');

const TWITCH_CLIENT_ID = '';
const TWITCH_SECRET    = '';
const SESSION_SECRET   = 'test12345';
const CALLBACK_URL     = 'http://localhost:3000/auth/twitch/callback';  // You can run locally with - http://localhost:3000/auth/twitch/callback

const app = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({secret: SESSION_SECRET, resave: false, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());
app.set('views', path.join(__dirname, '/public/views'));
app.engine('handlebars', handlebars3());
app.set('view engine', 'handlebars');
require('./routes')(app);



///////////////CHAT TEST ///////
var tmi = require("tmi.js");



////// TWITCH ///////////

// Override passport profile function to get user profile from Twitch API
OAuth2Strategy.prototype.userProfile = function(accessToken, done) {
  var options = {
    url: 'https://api.twitch.tv/kraken/user',
    method: 'GET',
    headers: {
      'Client-ID': TWITCH_CLIENT_ID,
      'Accept': 'application/vnd.twitchtv.v5+json',
      'Authorization': 'OAuth ' + accessToken
    }
  };

  request(options, function (error, response, body) {
    if (response && response.statusCode == 200) {
      done(null, JSON.parse(body));
    } else {
      done(JSON.parse(body));
    }
  });
}

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

passport.use('twitch', new OAuth2Strategy({
    authorizationURL: 'https://api.twitch.tv/kraken/oauth2/authorize',
    tokenURL: 'https://api.twitch.tv/kraken/oauth2/token',
    clientID: TWITCH_CLIENT_ID,
    clientSecret: TWITCH_SECRET,
    callbackURL: CALLBACK_URL,
    state: true
  },
  function(accessToken, refreshToken, profile, done) {
    profile.accessToken = accessToken;
    profile.refreshToken = refreshToken;

    // Securely store user profile in your DB
    //User.findOrCreate(..., function(err, user) {
    //  done(err, user);
    //});

    done(null, profile);
  }
));

/////////////////////////


app.get('/', function(req,res) {
	if(req.session && req.session.passport && req.session.passport.user) {
		res.render('auth', req.session.passport.user);
	} else {
		res.render('index');
	}
});

const server = app.listen(port, function() {
	console.log("Listening on port %s...", server.address().port);
});

module.exports = app;