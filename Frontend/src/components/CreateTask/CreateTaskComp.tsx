// import React, { useState } from "react";
// import styles from "./CreateTask.module.css";
// import { ITask } from "../../types/index"; // <-- yaha aapka path adjust kare
// import { useNavigate, useParams } from "react-router-dom";
// import { createTask } from "../../api/axios";

// const CreateTaskComp: React.FC = () => {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();
//   const [form, setForm] = useState({
//     title: "",
//     description: "",
//     status: "todo",
//     dueDate: "",
//   });

//   const handleChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
//     >
//   ) => {
//     const { name, value } = e.target;
//     setForm({ ...form, [name]: value });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     try {
//       // API call
//       const createdTask = await createTask(id!, form as ITask);
//       console.log("Task Created:", createdTask);
//       alert("Task Created Successfully!");

//       // Reset form
//       setForm({
//         title: "",
//         description: "",
//         status: "todo",
//         dueDate: "",
//       });
//       navigate(-1);
//     } catch (err) {
//       console.error("Error creating task:", err);
//       alert("Error creating task: " + (err as string));
//     }
//   };

//   return (
//     <div className={styles.container}>
//       <h2 className={styles.heading}>Create Task</h2>
//       <form className={styles.form} onSubmit={handleSubmit}>
//         <label className={styles.label}>
//           Title:
//           <input
//             type="text"
//             name="title"
//             value={form.title}
//             onChange={handleChange}
//             className={styles.input}
//             required
//           />
//         </label>

//         <label className={styles.label}>
//           Description:
//           <textarea
//             name="description"
//             value={form.description}
//             onChange={handleChange}
//             className={styles.textarea}
//           />
//         </label>

//         <label className={styles.label}>
//           Status:
//           <select
//             name="status"
//             value={form.status}
//             onChange={handleChange}
//             className={styles.select}
//           >
//             <option value="todo">To Do</option>
//             <option value="in-progress">In Progress</option>
//             <option value="done">Done</option>
//           </select>
//         </label>

//         <label className={styles.label}>
//           Due Date:
//           <input
//             type="date"
//             name="dueDate"
//             value={form.dueDate}
//             onChange={handleChange}
//             className={styles.input}
//           />
//         </label>

//         <button type="submit" className={styles.button}>
//           Create Task
//         </button>
//       </form>
//     </div>
//   );
// };

// export default CreateTaskComp;

import React from "react";
import styles from "./CreateTask.module.css";
import { ITask } from "../../types";
import { useNavigate, useParams } from "react-router-dom";
import { createTask } from "../../api/axios";
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
    .oneOf(["todo", "in-progress", "done"], "Invalid status")
    .required("Status is required"),
  dueDate: yup
    .string()
    .required("Due date is required")
    .test("is-future-date", "Due date must be in the future", (value) => {
      if (!value) return false;
      const today = new Date();
      const selectedDate = new Date(value);
      return selectedDate >= today;
    }),
});

interface IFormInput {
  title: string;
  description: string;
  status: "todo" | "in-progress" | "done";
  dueDate: string;
}

const CreateTaskComp: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<IFormInput>({
    resolver: yupResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      status: "todo",
      dueDate: "",
    },
  });

  const onSubmit = async (data: IFormInput) => {
    try {
      await createTask(id!, data as ITask);
      alert("Task Created Successfully!");
      reset();
      navigate(-1); // go back to previous page
    } catch (err: any) {
      console.error("Error creating task:", err);
      alert("Error creating task: " + (err.response?.data?.message || "Unknown error"));
    }
  };

  const handleBack = () => navigate(-1);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.heading}>Create Task</h2>
        <button type="button" onClick={handleBack} className={styles.backBtn}>
          ← Back
        </button>
      </div>

      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <label className={styles.label}>Title:</label>
        <input
          type="text"
          {...register("title")}
          className={styles.input}
          placeholder="Enter task title"
        />
        {errors.title && <p className={styles.error}>{errors.title.message}</p>}

        <label className={styles.label}>Description:</label>
        <textarea
          {...register("description")}
          className={styles.textarea}
          placeholder="Enter task description"
        />
        {errors.description && <p className={styles.error}>{errors.description.message}</p>}

        <label className={styles.label}>Status:</label>
        <select {...register("status")} className={styles.select}>
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
        {errors.status && <p className={styles.error}>{errors.status.message}</p>}

        <label className={styles.label}>Due Date:</label>
        <input type="date" {...register("dueDate")} className={styles.input} />
        {errors.dueDate && <p className={styles.error}>{errors.dueDate.message}</p>}

        <button type="submit" className={styles.button} disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Task"}
        </button>
      </form>
    </div>
  );
};

export default CreateTaskComp;

