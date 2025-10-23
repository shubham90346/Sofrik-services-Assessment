// import React, { useState } from "react";
// import styles from "./CreateProject.module.css";
// // import { createProject } from "../../api/axios";
// import { useNavigate } from "react-router-dom";
// import { createProject } from "../../api/axios";
// import { useAuth } from "../../context/AuthContext";

// interface CreateProjectProps {
//   onSuccess?: () => void; // optional callback after project creation
// }

// const CreateProjectComponent: React.FC<CreateProjectProps> = ({
//   onSuccess,
// }) => {
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [status, setStatus] = useState<"active" | "completed">("active");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const { user } = useAuth();
//   const owner = user?.user?.id || "";

//   const navigate = useNavigate();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");

//     if (!title.trim()) {
//       setError("Title is required");
//       return;
//     }

//     try {
//       setLoading(true);
//       await createProject({ title, description, status, owner });
//       // Reset form
//       setTitle("");
//       setDescription("");
//       setStatus("active");

//       if (onSuccess) {
//         onSuccess();
//       } else {
//         navigate("/");
//       }
//     } catch (err: any) {
//       setError(err.response?.data?.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className={styles.container}>
//       <h2 className={styles.title}>Add New Project</h2>

//       {error && <div className={styles.error}>{error}</div>}

//       <form onSubmit={handleSubmit} className={styles.form}>
//         <label className={styles.label}>Project Title</label>
//         <input
//           type="text"
//           placeholder="Enter project title"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           className={styles.input}
//           required
//         />

//         <label className={styles.label}>Project Description</label>
//         <textarea
//           placeholder="Enter project description"
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//           className={styles.textarea}
//         />

//         <label className={styles.label}>Project Status</label>
//         <select
//           value={status}
//           onChange={(e) => setStatus(e.target.value as "active" | "completed")}
//           className={styles.select}
//         >
//           <option value="active">Active</option>
//           <option value="completed">Completed</option>
//         </select>

//         <button type="submit" className={styles.submitBtn} disabled={loading}>
//           {loading ? "Creating..." : "Create Project"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default CreateProjectComponent;

import React from "react";
import styles from "./CreateProject.module.css";
import { useNavigate } from "react-router-dom";
import { createProject } from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// ✅ Validation Schema
const schema = yup.object({
  title: yup
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title cannot exceed 100 characters")
    .required("Title is required"),
  description: yup
    .string()
    .trim()
    .max(500, "Description cannot exceed 500 characters")
    .required("Description is required"),
  status: yup
    .string()
    .oneOf(["active", "completed"], "Invalid status")
    .required("Status is required"),
});

interface IFormInput {
  title: string;
  description: string;
  status: "active" | "completed";
}

interface CreateProjectProps {
  onSuccess?: () => void;
}

const CreateProjectComponent: React.FC<CreateProjectProps> = ({ onSuccess }) => {
  const { user } = useAuth();
  const owner = user?.user?.id || "";
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<IFormInput>({
    resolver: yupResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      status: "active",
    },
  });

  const onSubmit = async (data: IFormInput) => {
    try {
      await createProject({ ...data, owner });
      reset();
      if (onSuccess) onSuccess();
      else navigate("/");
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleBack = () => {
    navigate(-1); // ⬅️ Goes to previous page
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Add New Project</h2>
        <button type="button" onClick={handleBack} className={styles.backBtn}>
          ← Back
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <label className={styles.label}>Project Title</label>
        <input
          type="text"
          placeholder="Enter project title"
          {...register("title")}
          className={styles.input}
        />
        {errors.title && <p className={styles.error}>{errors.title.message}</p>}

        <label className={styles.label}>Project Description</label>
        <textarea
          placeholder="Enter project description"
          {...register("description")}
          className={styles.textarea}
        />
        {errors.description && (
          <p className={styles.error}>{errors.description.message}</p>
        )}

        <label className={styles.label}>Project Status</label>
        <select {...register("status")} className={styles.select}>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>
        {errors.status && <p className={styles.error}>{errors.status.message}</p>}

        <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Project"}
        </button>
      </form>
    </div>
  );
};

export default CreateProjectComponent;

