export interface IUser {
  id?: string;
  email: string;
  name: string;
  access_token?: string;
    user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface IProject {
  _id: string;
  title: string;
  description: string;
  status: "active" | "completed";
}

export interface ITask {
  _id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "done";
  dueDate: string;
  project: string;
}
