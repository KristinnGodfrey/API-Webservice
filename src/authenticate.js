import express from 'express';
import passport, { ensureLoggedIn, ensureAdmin } from './login.js';
import { selectAllByUsername, registerDB } from './db.js'
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
    console.log("eftir reg")
    //login
    res.redirect('/users/me');
  } catch(e) {
    console.log(e.message);
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

//router.get('/', ensureAdmin);
//router.get('/:id', ensureAdmin); //get skilar notanda - patch breytir admin boolean
//router.get('/register', register); //post validatear og býr til noanda, skilar auðkenni og netfangi
