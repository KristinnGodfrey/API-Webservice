import express from 'express'
import { router as tvRouter }  from './tv.js';
import { router as seasonRouter }  from './season.js';
import { router as episodeRouter }  from './episode.js';
import dotenv from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url'; 

import session from 'express-session';

import { router as authenticateRouter} from './authenticate.js';
import passport from './login.js';

dotenv.config();

const {
    PORT: port = 3000,
    SESSION_SECRET: sessionSecret,
} = process.env; //eslint-disable-line no-undef

if (!sessionSecret) {
    console.error('Vantar gögn í env');
    process.exit(1); //eslint-disable-line no-undef
  }

const app = express();
app.use(express.json());

const path = dirname(fileURLToPath(import.meta.url));

app.use(express.static(join(path, '../public')));

app.get('/', (req, res) => {
    res.json('Hello World!')
})

app.use(session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    maxAge: 20 * 1000, // 20 sek
  }));

app.use(passport.initialize());
app.use(passport.session());

app.use('/users', authenticateRouter);
app.use('/tv', tvRouter);
app.use('/tv/:id/season', seasonRouter);
app.use('/tv/:id/season/:seasonId/episode', episodeRouter)

app.listen(port, () => {
    console.info(`Server running at http://localhost:${port}/`);
});