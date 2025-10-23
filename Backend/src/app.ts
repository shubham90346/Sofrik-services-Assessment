import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import config from './config/index';
const bodyParser = require("body-parser")
const authRoutes = require("./routes/authroutes")
const userRoutes = require("./routes/userroutes")
const projectRoutes = require("./routes/projectroutes")
const taskRoutes = require("./routes/taskroutes")

 export const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.send('welcome to the backend');
});


app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api', projectRoutes);
app.use('/api', taskRoutes);



// Connect MongoDB
mongoose.set('strictQuery', false);
mongoose.connect(config.MONGO_URI)
  .then(() => console.log('Mongo connected'))
  .catch((err) => {
    console.error('Mongo connection error', err);
    process.exit(1);
  });


