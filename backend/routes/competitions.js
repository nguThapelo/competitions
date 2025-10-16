import express from 'express';
import {
  getCompetitions,
  getCompetitionById,
  addCompetition,
  updateCompetition,
  deleteCompetition
} from '../controllers/competitionsController.js';

const router = express.Router();

router.get('/', getCompetitions);
router.get('/:id', getCompetitionById);
router.post('/', addCompetition);
router.put('/:id', updateCompetition);
router.delete('/:id', deleteCompetition);

export default router;
