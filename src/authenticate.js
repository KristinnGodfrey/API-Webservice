import express from 'express';
import bcrypt from 'bcrypt';
import passport, { ensureLoggedIn, ensureAdmin } from './login.js';
import { selectAllByUsername, registerDB, changeDB } from './db.js'
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

async function register(req, res) {
  // ljótt en fæ undefined ef þetta er gert inní data array
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  const created = new Date();

  const data = [
    username,
    password,
    email,
    created
  ];
  
  console.log(data);

  try {
    await registerDB(data);
    res.json({username, email});

  } catch(e) {
    console.log(e.message);
  }
}

// uppfærir netfang, lykilorð eða bæði ef gögn rétt, aðeins ef notandi innskráður
async function change(req, res) {
  const username = req.body.username;
  let email = null;
  let data = {};
  let hashedPassword = null;

  if (await req.body.email) {
      email = await req.body.email;
  }

  if (req.body.password && req.body.password.length > 9 ) {
    hashedPassword = await bcrypt.hash(req.body.password, 11);
  }

  if (email && hashedPassword) {
    data = {
    username,
    email,
    hashedPassword,
  }
  console.log('email & password');
  } else if (email) {
    data = {
      username,
      email
    }
    console.log('email');
  } else {
    data = {
      username,
      hashedPassword
    }
    console.log('password')
  }

  if (changeDB(data)) {
      res.json('success');
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

// staðfestir og býr til notanda. Skilar auðkenni og netfangi. Notandi sem búinn er til skal aldrei vera stjórnandi
router.post('/register', (req, res) => {
  register(req, res);
})

router.patch('/me', ensureLoggedIn, (req, res) => {
  change(req, res);
})

//router.get('/', ensureAdmin);
//router.get('/:id', ensureAdmin); //get skilar notanda - patch breytir admin boolean
//router.get('/register', register); //post validatear og býr til noanda, skilar auðkenni og netfangi
