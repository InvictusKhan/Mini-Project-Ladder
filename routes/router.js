import express from 'express';
const router = express.Router();
import {getAllGames, addGame, deleteGame, updateGame} from '../controllers/game_controller.js';
import {getAllPersons, addPerson, updateperson, deletePerson} from '../controllers/person_controller.js'
import { addUser, getUsers, login } from '../controllers/users.js';
import verifyToken from '../middleware/auth.js'

router.post('/api/login', login);
router.post('/api/addUser', addUser);


router.use('/', verifyToken);

router.get('/api/games', getAllGames);

router.get('/api/persons', getAllPersons);

router.post('/api/newperson', addPerson);

router.post('/api/addGame', addGame);

router.patch('/api/updateperson/:id', updateperson);
router.delete('/api/deleteperson/:id',deletePerson);
router.patch('/api/updateGame/:id', updateGame)

router.delete('/api/deletegame/:id', deleteGame);

router.get('/api/getUsers', getUsers);





export default router;