import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  deleteTask,
  getProjectsById,
  getTaskByProjectId,
} from "../../api/axios";
import styles from "./ProjectDetail.module.css";
import {
  ArrowLeft,
  ClipboardList,
  Loader2,
  Edit3,
  Trash2,
  Plus,
} from "lucide-react";
import { ITask } from "../../types";

const ProjectDetailsComp: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<any[]>([]);
  const [taskLoading, setTaskLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showDeleteTaskModal, setShowDeleteTaskModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<ITask | null>(null);
  console.log(taskToDelete);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const data = await getProjectsById(id!);
        const projectData = Array.isArray(data) ? data[0] : data;
        setProject(projectData);
      } catch (err) {
        console.error("Error fetching project:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchTasks = async () => {
      try {
        const data = await getTaskByProjectId(id!);
        setTasks(data || []);
      } catch (err) {
        console.error("Error fetching tasks:", err);
      } finally {
        setTaskLoading(false);
      }
    };

    if (id) {
      fetchProject();
      fetchTasks();
    }
  }, [id]);

  const handleEdit = (taskId: string) => {
    navigate(`/edit-task/${taskId}`);
  };

  const handleCreateTask = () => {
    navigate(`/create-task/${id}`);
  };

 const filteredTasks = tasks.filter((task) => {
  const matchesSearch = task.title
    ?.toLowerCase()
    .includes(searchTerm.toLowerCase());
  
  const matchesStatus = statusFilter ? task.status === statusFilter : true;

  return matchesSearch && matchesStatus;
});

console.log("filter", filteredTasks)

  const handleDeleteTaskClick = (task: ITask) => {
    setTaskToDelete(task);
    setShowDeleteTaskModal(true);
  };

  const confirmDeleteTask = async () => {
    if (taskToDelete) {
      try {
        await deleteTask(taskToDelete._id); 
        setTasks(tasks.filter((t) => t._id !== taskToDelete._id));
        setShowDeleteTaskModal(false);
        setTaskToDelete(null);
      } catch (err: any) {
        console.error("Delete failed:", err);
        alert(err);
      }
    }
  };
  const cancelDeleteTask = () => {
    setShowDeleteTaskModal(false);
    setTaskToDelete(null);
  };

  
  const handleBack = () => navigate(-1);

  return (
    <div className={styles.container}>
  
    <div className={styles.header}>
        <h1 className={styles.title}>
          <ClipboardList size={22} className={styles.icon} /> {project?.title}
        </h1>
        <button className={styles.backBtn} onClick={handleBack}>
          <ArrowLeft size={16} style={{ marginRight: 4 }} /> Back
        </button>
      </div>

     
      <div className={styles.infoCard}>
        <p className={styles.description}>{project?.description}</p>
        <p className={styles.date}>
          Created on:{" "}
          <span>{new Date(project?.createdAt).toLocaleDateString()}</span>
        </p>
      </div>

      
      <div className={styles.tasksSection}>
        <div className={styles.tasksHeader}>
          <h2 className={styles.tasksTitle}>Project Tasks</h2>

       
     <div className="d-flex justify-between items-center mb-4">
  <input
    type="text"
    placeholder="Search by name..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="border px-3 py-2 rounded-lg w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
  />

  <select
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
    className="border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ml-2"
  >
    <option value="">All Status</option>
    <option value="todo">Todo</option>
    <option value="in-progress">In-Progress</option>
    <option value="done">Done</option>
  </select>

  <button className={styles.createBtn} onClick={handleCreateTask}>
    <Plus size={16} /> Create Task
  </button>
</div>


        </div>

        {taskLoading ? (
          <div className={styles.loaderWrap}>
            <Loader2 className={styles.loader} />
            <p>Loading tasks...</p>
          </div>
        ) : filteredTasks?.length ? (
          <table className={styles.taskTable}>
            <thead>
              <tr>
                <th>#</th>
                <th>Task Title</th>
                <th>Description</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task: any, index: number) => (
                <tr key={task._id}>
                  <td>{index + 1}</td>
                  <td>{task.title}</td>
                  <td>{task.description || "—"}</td>
                  <td>
                    <span
                      className={`${styles.statusBadge} ${
                        task.status === "Completed"
                          ? styles.completed
                          : task.status === "In Progress"
                          ? styles.inProgress
                          : styles.pending
                      }`}
                    >
                      {task.status}
                    </span>
                  </td>
                  <td>{new Date(task.createdAt).toLocaleDateString()}</td>
                  <td className={styles.actionCell}>
                    <button
                      className={styles.editBtn}
                      onClick={() => handleEdit(task._id)}
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => handleDeleteTaskClick(task)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className={styles.noTasks}>No tasks found for this project.</p>
        )}

        {/* Delete Task Modal */}
        {showDeleteTaskModal && taskToDelete && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <h3>Delete Task</h3>
              <p>Are you sure you want to delete "{taskToDelete.title}"?</p>
              <div className={styles.modalActions}>
                <button className={styles.cancelBtn} onClick={cancelDeleteTask}>
                  Cancel
                </button>
                <button
                  className={styles.confirmBtn}
                  onClick={confirmDeleteTask}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetailsComp;
