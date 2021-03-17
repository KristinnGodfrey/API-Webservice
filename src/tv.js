import express from 'express';
import { selectAll, selectAllWhereId } from '../src/db.js'

export const router = express.Router();

// tv
router.get('/', async (req, res) => {
    const data = await selectAll('series');
    res.json({data});
});

// tv/:id
router.get('/:id', async (req, res) => {
    let seriesId = req.params.id;
    console.log(seriesId);
    const data = await selectAllWhereId('series', seriesId);
    res.json({data});
});
