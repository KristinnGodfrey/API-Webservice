import express from 'express'
import { router as tvRouter }  from './tv.js';
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
} = process.env;

if (!sessionSecret) {
    console.error('Vantar gögn í env');
    process.exit(1);
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
// app.use('/tv/:id/season', seasonRouter);
// app.use('/tv/:id/season/:seasonId/episode', episodeRouter)

app.listen(port, () => {
    console.info(`Server running at http://localhost:${port}/`);
});