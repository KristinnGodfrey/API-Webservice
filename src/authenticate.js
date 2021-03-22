import express from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import { ensureLoggedIn, ensureAdmin, getAccess } from './login.js';
import { selectAllByUsername, registerDB, changeDB, selectAll } from './db.js';
import { findById, changeStatus } from './users.js';

export const router = express.Router();
router.use(express.json());

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

  if (await registerDB(data)) {
      res.json({username, email});
  } else {
    res.json('invalid user info, try again with new values');
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

async function selectUsers(res) {
  const data = await selectAll('users');
  console.log('auth');
  await res.json({ data });
}

async function loginCheck(req, res, next) {
  const data = validationResult(await req);
  if (data.errors = []) { 
    return next()
  } else {
    console.log(data);
    res.json('loginCheck failure')
    return null;
  }
}


router.get('/me', ensureLoggedIn, (req, res) => {
  me(req, res);
}); //get skilar uppl um notenda sem á token - patch uppfærir uppl

// todo tékka á input áður en loginCheck keyrir
router.post('/login', loginCheck, login);

// staðfestir og býr til notanda. Skilar auðkenni og netfangi. Notandi sem búinn er til skal aldrei vera stjórnandi
router.post('/register', (req, res) => {
  register(req, res);
})

router.patch('/me', ensureLoggedIn, (req, res) => {
  change(req, res);
})

//tékkar hvort notandi sé innskráður og admin, birtir síðan notendur
router.get('/', ensureAdmin, (res) => {
  selectUsers(res);
});

// tékkar hvort notandi sé innskráður og admin, birtir síðan user með id úr slóð
router.get('/:id', ensureAdmin, (req, res) => {
  const data = findById(req.params.id);
  res.json(data);
})

// breytir hvort notandi sé stjórnandi eða ekki, aðeins ef notandi sem framkvæmir er stjórnandi og er ekki að breyta sér sjálfum
router.patch('/:id', ensureAdmin, (req, res) => {
  const target = findById(req.params.id);
  const targetId = target.id;
  if (req.body.username != target.username) { // er ekki að breyta sér sjálfum
    if (target.admin == true) {
      if (changeStatus(false, targetId)) {
        res.json('set to false');
      } else {
        res.json('unsuccessful')
      }
    } else {
      if (changeStatus(true, targetId)) {
        res.json('set to true');
      } else {
        res.json('unsuccessful');
      }
    }
  }
})