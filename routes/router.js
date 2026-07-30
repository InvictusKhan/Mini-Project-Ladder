import express from 'express';
const router = express.Router();
import {getAllGames} from '../controllers/game_controller.js';
import {getAllPersons, addPerson} from '../controllers/person_controller.js'

router.get('/api/games', getAllGames);

router.get('/api/persons', getAllPersons);

router.post('/api/newPerson', addPerson);



export default router;