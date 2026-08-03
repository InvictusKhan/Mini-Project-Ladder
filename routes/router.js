import express from 'express';
const router = express.Router();
import {getAllGames, addGame, deleteGame, updateGame} from '../controllers/game_controller.js';
import {getAllPersons, addPerson, updateperson, deletePerson} from '../controllers/person_controller.js'

router.get('/api/games', getAllGames);

router.get('/api/persons', getAllPersons);

router.post('/api/newperson', addPerson);

router.post('/api/addGame', addGame);

router.patch('/api/updateperson/:id', updateperson);
router.delete('/api/deleteperson/:id',deletePerson);
router.patch('/api/updateGame/:id', updateGame)

router.delete('/api/deletegame/:id', deleteGame)


export default router;