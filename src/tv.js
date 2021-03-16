import express from 'express';

export const router = express.Router();

router.get('/', async (req, res) => {
    const data = await db.selectAll('shows');
    res.json({ data });
});
