import React, { useState, useEffect } from "react";
import styles from "./EditTask.module.css"; // same CSS
import { ITask } from "../../types/index";
import { useNavigate, useParams } from "react-router-dom";
import { getTaskById, updateTask } from "../../api/axios";
// import { getTaskById, updateTask } from "../../api/axios";

const EditTaskComp: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // task id
  const navigate = useNavigate();
  const [form, setForm] = useState<Partial<ITask>>({
    title: "",
    description: "",
    status: "todo",
    dueDate: "",
    project: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const data = await getTaskById(id!);
        setForm(data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch task:", err);
        setLoading(false);
      }
    };
    fetchTask();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateTask(id!, form as ITask);
      alert("Task Updated Successfully!");
      navigate(-1);
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  if (loading) return <p>Loading...</p>;

    const handleBack = () => {
    navigate(-1); // ⬅️ Goes to previous page
  };

  return (
    <div className={styles.container}>
   
     <div className={styles.header}>
        <h2 className={styles.title}>Edit Task</h2>
        <button type="button" onClick={handleBack} className={styles.backBtn}>
          ← Back
        </button>
      </div>


      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.label}>
          Title:
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </label>

        <label className={styles.label}>
          Description:
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className={styles.textarea}
          />
        </label>

        <label className={styles.label}>
          Status:
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className={styles.select}
          >
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </label>

        <label className={styles.label}>
          Due Date:
          <input
            type="date"
            name="dueDate"
            value={form.dueDate?.slice(0, 10)} // date input me string format required
            onChange={handleChange}
            className={styles.input}
          />
        </label>

        <button type="submit" className={styles.button}>
          Update Task
        </button>
      </form>
    </div>
  );
};

export default EditTaskComp;
