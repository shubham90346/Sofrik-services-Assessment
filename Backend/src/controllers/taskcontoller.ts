import { Request, Response } from 'express';
const Task = require('../models/taskmodel');
const Project = require('../models/projectmodel');

export const createTask = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const { title, description, status, dueDate } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });

    const task = await Task.create({ title, description, status, dueDate, project: project._id });
    return res.status(201).json(task);
  } catch (err: any) {
    console.error('Create Task error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const listTasks = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const status = req.query.status as string | undefined;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });


    const query: any = { project: project._id };
    if (status) query.status = status;

    const tasks = await Task.find(query).sort({ createdAt: -1 });
    return res.json(tasks);
  } catch (err: any) {
    console.error('List Tasks error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const task = await Task.findById(req.params.id);
    console.log(req.params.id)
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const project = await Project.findById(task.project);
    if (!project) return res.status(404).json({ message: 'Project not found' });


    task.title = req.body.title ?? task.title;
    task.description = req.body.description ?? task.description;
    task.status = req.body.status ?? task.status;
    task.dueDate = req.body.dueDate ?? task.dueDate;
    await task.save();

    return res.json(task);
  } catch (err: any) {
    console.error('Update Task error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {


    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const project = await Project.findById(task.project);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    await task.deleteOne();
    return res.json({ message: 'Deleted' });
  } catch (err: any) {
    console.error('Delete Task error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const GetTaskbyId = async (req: Request, res: Response) => {
 try {
    const { id } = req.params;
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res.json(task);
  } catch (err: any) {
    console.error("Get Task error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
