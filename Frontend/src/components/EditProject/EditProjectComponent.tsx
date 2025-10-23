import React, { useState, useEffect } from "react";
import styles from "./EditProject.module.css";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getProjectsById, updateProject } from "../../api/axios";

const EditProjectComponent: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // project id from route
  const { user } = useAuth();
  const owner = user?.user?.id || "";
  console.log(owner);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"active" | "completed">("active");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setFetching(true);
        const data = await getProjectsById(id!);
        console.log("data", data);
        const project = Array.isArray(data) ? data[0] : data;

        if (project) {
          setTitle(project.title);
          setDescription(project.description);
          setStatus(project.status);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch project");
      } finally {
        setFetching(false);
      }
    };

    if (id) fetchProject();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    try {
      setLoading(true);
      await updateProject(id!, {
        title,
        description,
        status,
        owner,
      });
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className={styles.loading}>Loading...</div>;
    const handleBack = () => {
    navigate(-1); // ⬅️ Goes to previous page
  };

  return (
    <div className={styles.container}>
   
             <div className={styles.header}>
        <h2 className={styles.title}>Edit Project</h2>
        <button type="button" onClick={handleBack} className={styles.backBtn}>
          ← Back
        </button>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <label className={styles.label}>Project Title</label>
        <input
          type="text"
          placeholder="Enter project title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={styles.input}
          required
        />

        <label className={styles.label}>Project Description</label>
        <textarea
          placeholder="Enter project description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={styles.textarea}
        />

        <label className={styles.label}>Project Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as "active" | "completed")}
          className={styles.select}
        >
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>

        <button type="submit" className={styles.submitBtn} disabled={loading}>
          {loading ? "Updating..." : "Update Project"}
        </button>
      </form>
    </div>
  );
};

export default EditProjectComponent;
