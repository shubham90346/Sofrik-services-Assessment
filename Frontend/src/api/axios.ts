import axios from "axios";
import { ITask, IUser, } from "../types";
const API_BASE_URL = "http://localhost:3001/api";


export interface Project {
  title: string;
  description: string;
  status: "active" | "completed";
  owner: string; 
}

// Login user
export const loginUser = async (email: string, password: string): Promise<IUser> => {
  try {
    const res = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
    return res.data; 
  } catch (err: any) {
    throw err.response?.data?.message || "Login failed";
  }
};

// Register user
export const registerUser = async (name: string, email: string, password: string): Promise<IUser> => {
  try {
    const res = await axios.post(`${API_BASE_URL}/auth/register`, { name, email, password });
    return res.data.user; 
  } catch (err: any) {
    throw err.response?.data?.message || "Registration failed";
  }
};

// Get all projects for a user
export const getProjectsByUser = async (userId: string): Promise<Project[]> => {
  try {
    const res = await axios.get(`${API_BASE_URL}/getproject/${userId}`);
    return res.data.projects;
  } catch (err) {
    console.error("Error fetching projects:", err);
    throw err;
  }
};

// Create Project API
export const createProject = async (data: Project) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/create-project`, data); 
    return res.data; 
  } catch (err: any) {
    throw err.response?.data || err.message || "Something went wrong";
  }
};

// Delete Project API
export const deleteProject = async (projectId: string) => {
  try {
    const res = await axios.delete(`${API_BASE_URL}/delete/${projectId}`);
    return res.data; 
  } catch (err: any) {

    throw err.response?.data || err.message || "Something went wrong";
  }
};

// get projects by Id
export const getProjectsById = async (projectId: string): Promise<Project> => {
  try {
    const res = await axios.get(`${API_BASE_URL}/get-project-id/${projectId}`);
    return res.data.projects;
  } catch (err) {
    console.error("Error fetching projects:", err);
    throw err;
  }
};

// update project
export const updateProject = async (id: string, data: Project) => {
  try {
    const res = await axios.put(`${API_BASE_URL}/update-project/${id}`, data); 
    return res.data; 
  } catch (err: any) {
    throw err.response?.data || err.message || "Something went wrong";
  }
};

// get task by project id
export const getTaskByProjectId = async (projectId: string): Promise<ITask[]> => {
  try {
    const res = await axios.get(`${API_BASE_URL}/get-projects-task/${projectId}`);

    return res.data;
  } catch (err) {
    console.error("Error fetching projects:", err);
    throw err;
  }
};

// create Task
export const createTask = async (projectId: string, data: ITask) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/create-task/${projectId}`, data); 
    return res.data; 
  } catch (err: any) {
    throw err.response?.data || err.message || "Something went wrong";
  }
};

// Delete Task
export const deleteTask = async (TaskId: string) => {
  try {
    const res = await axios.delete(`${API_BASE_URL}/delete-task/${TaskId}`);
    return res.data; 
  } catch (err: any) {
    throw err.response?.data || err.message || "Something went wrong";
  }
};

// get task by id 
export const getTaskById = async (id: string): Promise<ITask> => {
  try {
    const res = await axios.get(`${API_BASE_URL}/get-taskbyid/${id}`);
    return res.data;
  } catch (err) {
    console.error("Error fetching projects:", err);
    throw err;
  }
};

// update task
export const updateTask = async (id: string, data: ITask) => {
  try {
    const res = await axios.put(`${API_BASE_URL}/update-task/${id}`, data); 
    return res.data; 
  } catch (err: any) {
    throw err.response?.data || err.message || "Something went wrong";
  }
};