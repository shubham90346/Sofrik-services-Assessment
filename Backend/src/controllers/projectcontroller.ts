import { Request, Response } from 'express';
const Project = require('../models/projectmodel');
const  Task = require('../models/taskmodel');

export const createProject = async (req: Request, res: Response) => {
  try {
    const { title, description, status, owner  } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });

    const project = await Project.create({ title, description, status, owner });
    return res.status(201).json(project);
  } catch (err: any) {
    console.error('Create Project error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const listProjects = async (req: Request, res: Response) => {
  try {
    const owner = (req as any).user?.id;
    if (!owner) return res.status(401).json({ message: 'Unauthorized' });

    const page = parseInt((req.query.page as string) || '1', 10);
    const limit = Math.min(parseInt((req.query.limit as string) || '20', 10), 100);
    const search = (req.query.search as string) || '';

    const query: any = { owner };
    if (search) query.title = { $regex: search, $options: 'i' };

    const total = await Project.countDocuments(query);
    const projects = await Project.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    return res.json({ total, page, limit, data: projects });
  } catch (err: any) {
    console.error('List Projects error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getProject = async (req: Request, res: Response) => {
 try {
    const  ownerId  = req.params.id;

    if (!ownerId) {
      return res.status(400).json({ message: "Owner ID is required" });
    }

    const projects = await Project.find({ owner: ownerId }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: projects.length,
      projects,
    });
  } catch (error: any) {
    console.error("Error fetching projects:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching projects",
    });
  }
};

export const updateProject = async (req: Request, res: Response) => {
  try {

    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    project.title = req.body.title ?? project.title;
    project.description = req.body.description ?? project.description;
    project.status = req.body.status ?? project.status;
    await project.save();
    return res.json(project);
  } catch (err: any) {
    console.error('Update Project error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });


    // delete tasks under project
    await Task.deleteMany({ project: project._id });
    await project.deleteOne();

    return res.json({ message: 'Deleted' });
  } catch (err: any) {
    console.error('Delete Project error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getProjectbyid = async (req: Request, res: Response) => {
 try {
    const  Id  = req.params.id;

    if (!Id) {
      return res.status(400).json({ message: "Owner ID is required" });
    }

    const projects = await Project.findById(Id).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: projects.length,
      projects:[projects],
    });
  } catch (error: any) {
    console.error("Error fetching projects:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching projects",
    });
  }
};
