import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import { AuthProvider } from "./context/AuthContext";
import Dashboard from "./pages/Dashboard";
import LoginComponent from "./components/LoginComponent/LoginComponent";
import ProtectedRoute from "./utils/ProtectedRoute";
import CreateProjectComponent from "./components/CreateProject/CreateProjectComp";
import EditProjectComponent from "./components/EditProject/EditProjectComponent";
import ProjectDetailsComp from "./components/ProjectDetails/ProjectDetailComp";
import CreateTaskComp from "./components/CreateTask/CreateTaskComp";
import EditTaskComp from "./components/EditTask/EditTaskComp";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginComponent />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-project"
            element={
              <ProtectedRoute>
                <CreateProjectComponent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-project/:id"
            element={
              <ProtectedRoute>
                <EditProjectComponent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/project-details/:id"
            element={
              <ProtectedRoute>
                <ProjectDetailsComp />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-task/:id"
            element={
              <ProtectedRoute>
                <CreateTaskComp />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-task/:id"
            element={
              <ProtectedRoute>
                <EditTaskComp />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
