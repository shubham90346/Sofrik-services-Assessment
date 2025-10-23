const express = require('express');
const router = express.Router();

import {
  createTask,
  listTasks,
  updateTask,
  deleteTask,
  GetTaskbyId,
} from '../controllers/taskcontoller';



router.post('/create-task/:projectId', createTask);
router.get('/get-projects-task/:projectId', listTasks);
router.put('/update-task/:id', updateTask);
router.delete('/delete-task/:id', deleteTask);
router.get('/get-taskbyid/:id', GetTaskbyId);  

module.exports = router;