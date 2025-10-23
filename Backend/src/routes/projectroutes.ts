const express = require('express');
const router = express.Router();

import {
  createProject,
  listProjects,
  getProject,
  updateProject,
  deleteProject,
  getProjectbyid,
} from '../controllers/projectcontroller';
// import { projectCreateValidator } from '../validators/projectvalidator';




router.post('/create-project', createProject);
router.get('/projectlist', listProjects);
router.get('/getproject/:id', getProject);
router.put('/update-project/:id', updateProject);
router.delete('/delete/:id', deleteProject);
router.get('/get-project-id/:id', getProjectbyid);  

module.exports = router;

