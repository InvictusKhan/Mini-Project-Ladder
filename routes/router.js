import express from 'express';
const router = express.Router();
import {getAllGames, addGame} from '../controllers/game_controller.js';
import {getAllPersons, addPerson, updateperson, deletePerson} from '../controllers/person_controller.js'

router.get('/api/games', getAllGames);

router.get('/api/persons', getAllPersons);

router.post('/api/newperson', addPerson);

router.post('/api/addGame', addGame);

router.patch('/api/updateperson/:id', updateperson);
router.delete('/api/deleteperson/:id',deletePerson);


export default router;