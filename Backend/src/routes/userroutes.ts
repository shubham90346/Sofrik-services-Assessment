// import { Router } from 'express';
const express = require('express');
const router = express.Router();
import { me } from '../controllers/usercontroller';
// import auth from '../middlewares/auth';


// const router = Router();

router.get('/me', me);

module.exports = router;
