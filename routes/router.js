import express from 'express';
const router = express.Router();
import {getAllGames, addGame, deleteGame, updateGame} from '../controllers/game_controller.js';
import {getAllPersons, addPerson, updateperson, deletePerson} from '../controllers/person_controller.js'
import { addUser, getUsers, login, verifyRefreshToken, logOut, verify_token_click } from '../controllers/users.js';
import { newLead, getLeads, getOneLead, updateLead, deleteLead } from '../controllers/leads.js';
import verifyToken from '../middleware/auth.js'

router.post('/api/login', login);
router.post('/api/addUser', addUser);
router.get('/api/verify-email', verify_token_click)
router.post('/api/refresh', verifyRefreshToken);

router.post('/api/logOut', logOut);
router.use('/', verifyToken);

router.post('/api/leads', newLead);
router.get('/api/leads', getLeads);
router.get('/api/leads/:id', getOneLead);
router.patch('/api/leads/:id', updateLead);
router.delete('/api/leads/:id', deleteLead);

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