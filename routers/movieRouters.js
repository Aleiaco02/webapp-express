import express from 'express';
import { index, show, store } from '../controllers/movieController.js';


const router = express.Router();

// index
router.get('/', index);

// show
router.get('/:id', show);

// store
router.post('/:id/reviews', store);

// update
// router.put('/:id', update);

// destroy
// router.delete('/:id', destroy);

export default router;