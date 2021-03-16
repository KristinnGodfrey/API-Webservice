import express from 'express';
import { router as tvRouter }  from './tv.js';
import dotenv from 'dotenv';

dotenv.config();

const {
    PORT: port = 3000,
} = process.env;

const app = express();

app.get('/', (req, res) => {
    res.json('Hello World!')
})

app.use('/tv', tvRouter);
// app.use('/tv/:id/season', seasonRouter);
// app.use('/tv/:id/season/:seasonId/episode', episodeRouter)

app.listen(port, () => {
    console.info(`Server running at http://localhost:${port}/`);
});