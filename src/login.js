import passport from 'passport';
//import { Strategy } from 'passport-local';
import { Strategy, ExtractJwt } from 'passport-jwt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import { comparePasswords, findByUsername, findById, checkAdminById, checkAdminByUsername } from './users.js';

dotenv.config();

const {
  JWT_SECRET: jwtSecret,
  TOKEN_LIFETIE: tokenLifetime = 3600,
} = process.env;

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtSecret,
};

function stratToken(data, next) {
  try {
    const user = findById(data.id);

    if(user) {
      return next(null, user);
    } else {
      return next(null, false);
    }
  } catch(e) {
    console.info(e.message);
  }
};

passport.use(
  new Strategy(jwtOptions, stratToken),
);

//helper til að fá token
export function getAccess(req, res){
  const username = {name: req.body.username};

  const accessToken = jwt.sign(username, process.env.JWT_SECRET);
  return accessToken;
}

// Hjálpar middleware sem athugar hvort notandi sé innskráður og hleypir okkur
// þá áfram, annars sendir á /
export function ensureLoggedIn(req, res, next) {
  //if (req.isAuthenticated()) { //breyta í validate by token
  if (getAccess(req, res) != false) {
  return next();
  }
  res.json('unsuccesfull login');
}

export function ensureAdmin(req, res, next) {
  if ((getAccess(req, res) != false) && req.checkAdminById) {
    return next();
  } else if ((getAccess(req, res) != false) && checkAdminByUsername(req.username)) {
    return next();
  }

  return res.redirect('/users/login');
}

export default passport;
