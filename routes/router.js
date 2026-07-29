import express from 'express';
import logger from '../middleware/logger.js';
const router = express.Router();

router.get('/api', (req, res) => {
    res.send('Home Page');
    
});


export default router;