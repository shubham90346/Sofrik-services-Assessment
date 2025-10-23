import React, { useState } from "react";
import styles from "./Login.module.css";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { loginUser, registerUser } from "../../api/axios";
import { useNavigate } from "react-router-dom";

interface FormData {
  name?: string;
  email: string;
  password: string;
}

const LoginComponent: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState<FormData>({ email: "", password: "" });
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setForm({ email: "", password: "", name: "" });
    setError("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    try {
      if (isLogin) {
        const userData = await loginUser(form.email, form.password);
        login(userData); // update context
        navigate("/"); // redirect to dashboard immediately
      } else {
        if (!form.name) {
          setError("Name is required");
          return;
        }

        await registerUser(form.name, form.email, form.password);

        // Show success message
        setSuccessMsg("Registration successful! Please login to continue.");

        // Reset form
        setForm({ name: "", email: "", password: "" });

        // Switch to login mode automatically after 2 sec and hide message
        setTimeout(() => {
          setIsLogin(true);
          setSuccessMsg("");
        }, 2000);
      }
    } catch (err: any) {
      setError(typeof err === "string" ? err : "Something went wrong");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {successMsg && <div className={styles.success}>{successMsg}</div>}
        <h2 className={styles.title}>{isLogin ? "Login" : "Register"}</h2>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          {!isLogin && (
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name || ""}
              onChange={handleChange}
              className={styles.input}
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className={styles.input}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className={styles.input}
            required
          />

          <button type="submit" className={styles.submitBtn}>
            {isLogin ? "Login" : "Register"}
          </button>
        </form>

        <div className={styles.toggle}>
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <span onClick={toggleMode}>{isLogin ? "Register" : "Login"}</span>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;
