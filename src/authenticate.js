import express from 'express';
import passport, { ensureLoggedIn, ensureAdmin } from './login.js';

export const router = express.Router();

function login(req, res) {
    if (req.isAuthenticated()) {
      return res.redirect('/users/me');
    }
  
    let message = '';
  
    // Athugum hvort einhver skilaboð séu til í session, ef svo er birtum þau
    // og hreinsum skilaboð
    if (req.session.messages && req.session.messages.length > 0) {
      message = req.session.messages.join(', ');
      req.session.messages = [];
    }
  
    return res.render('login', { message, title: 'Innskráning' });
  }

router.get('/login', login);
router.get('/', ensureAdmin);
router.get('/:id', ensureAdmin); //get skilar notanda - patch breytir admin boolean
//router.get('/register', register); //post validatear og býr til noanda, skilar auðkenni og netfangi
//router.get('/me', ensureLoggedIn, me); //get skilar uppl um notenda sem á token - patch uppfærir uppl
//router.get á hvern möguleika. Fall sem sér um að rendera hvert tilfelli og tékka á gerð notenda

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
  );