import express from 'npm:express';
import db from '../config/db.ts';

export const router = express.Router();

router.post('/create', (req, res) => {
    res.sendStatus(200);
});