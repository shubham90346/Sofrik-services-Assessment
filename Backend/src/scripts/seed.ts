// scripts/seed.ts
import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
const User = require('../models/usermodel');
const Project = require('../models/projectmodel');
const Task = require('../models/taskmodel');
import config from '../config/index';

async function main() {
  const MONGO = config.MONGO_URI;
  await mongoose.connect(MONGO);
  console.log('Connected to', MONGO);

  // cleanup
  await Task.deleteMany({});
  await Project.deleteMany({});
  await User.deleteMany({});

  const password = await bcrypt.hash('Test@123', 10);
  const user = await User.create({ email: 'test@example.com', password, name: 'Demo User' });
  console.log('Created user: test@example.com');

  const projects = [];
  for (let i = 1; i <= 2; i++) {
    const p = await Project.create({
      title: `Demo Project ${i}`,
      description: `This is Demo project ${i}`,
      status: i === 1 ? 'active' : 'completed',
      owner: user._id,
    });
    projects.push(p);
    console.log('Created project:', p.title);
  }

  for (const p of projects) {
    for (let t = 1; t <= 3; t++) {
      const task = await Task.create({
        title: `Task ${t} for ${p.title}`,
        description: `Demo task ${t}`,
        status: t === 1 ? 'todo' : t === 2 ? 'in-progress' : 'done',
        dueDate: new Date(Date.now() + t * 24 * 3600 * 1000),
        project: p._id,
      });
      console.log('Created task:', task.title);
    }
  }

  await mongoose.disconnect();
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
