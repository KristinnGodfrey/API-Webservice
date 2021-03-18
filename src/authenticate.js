import express from 'express';
import passport, { ensureLoggedIn, ensureAdmin } from './login.js';
import { selectAllByUsername } from './db.js'
import jwt from 'jsonwebtoken';

export const router = express.Router();
router.use(express.json());

//helper til að fá token
function getAccess(req, res){
  const username = {name: req.body.username};

  const accessToken = jwt.sign(username, process.env.ACCESS_TOKEN_SECRET);
  return accessToken;
}

function login(req,res){
  const access = {token: getAccess(req, res)};
  res.json(access);
}


async function me(req, res){
  if (getAccess(req, res) != false){
    const username = req.body.username;
    const contact = await selectAllByUsername(username);

    const email = contact[0].email;

    res.json({username, email});
  }

  else {
      res.redirect('/');
  }
}

router.get('/me', ensureLoggedIn, (req, res) => {
  me(req, res);
}); //get skilar uppl um notenda sem á token - patch uppfærir uppl

router.post('/login',

    // Þetta notar strat að ofan til að skrá notanda inn
    passport.authenticate('local', {
    failureRedirect: '/',
  }),

  (req, res) => {
    login(req, res);
  });


//router.get('/', ensureAdmin);
//router.get('/:id', ensureAdmin); //get skilar notanda - patch breytir admin boolean
//router.get('/register', register); //post validatear og býr til noanda, skilar auðkenni og netfangi
//router.get á hvern möguleika. Fall sem sér um að rendera hvert tilfelli og tékka á gerð notenda
/*
router.post(
    '/login',
  
    // Þetta notar strat að ofan til að skrá notanda inn
    passport.authenticate('local', {
      failureMessage: 'Notandanafn eða lykilorð vitlaust.',
      failureRedirect: '/users/login',
    }),
  
    // Ef við komumst hingað var notandi skráður inn, senda á /admin
    (req, res) => {
      res.redirect('/users/me');
    },
  );*/