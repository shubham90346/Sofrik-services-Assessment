import React, { useState, useEffect } from "react";
import styles from "./Dashboard.module.css";
import {
  Plus,
  Search,
  Folder,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { deleteProject, getProjectsByUser } from "../../api/axios";
import { useNavigate } from "react-router-dom";

interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

const DashboardComponent: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const projectsPerPage = 6;
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const id = user?.user?.id || "";
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const data = await getProjectsByUser(id);

        // Map API response to frontend-friendly fields
        const mapped = data.map((p: any) => ({
          id: p._id,
          name: p.title,
          description: p.description,
          createdAt: new Date(p.createdAt).toLocaleDateString(),
        }));

        setProjects(mapped);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [user]);

  // Filter + pagination logic
  const filtered = projects.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / projectsPerPage);
  const startIndex = (currentPage - 1) * projectsPerPage;
  const displayed = filtered.slice(startIndex, startIndex + projectsPerPage);

  console.log("displayed", filtered);

  const handleAddbtn = () => {
    navigate("/create-project");
  };

  const handleEdit = (projectId: string) => {
    navigate(`/edit-project/${projectId}`);
  };

  const handleDeleteClick = (project: Project) => {
    setProjectToDelete(project);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (projectToDelete) {
      try {
        // API call
        await deleteProject(projectToDelete.id);
        setProjects(projects.filter((p) => p.id !== projectToDelete.id));
        setShowDeleteModal(false);
        setProjectToDelete(null);
      } catch (err: any) {
        console.error("Delete failed:", err);
        alert(err);
      }
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setProjectToDelete(null);
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Project Management Tool</h1>
        <button className={styles.addBtn} onClick={handleAddbtn}>
          <Plus size={18} /> Add Project
        </button>
      </div>

      {/* Search */}
      <div className={styles.searchWrapper}>
        <Search className={styles.searchIcon} size={18} />
        <input
          type="text"
          placeholder="Search projects..."
          className={styles.searchInput}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Project Grid */}
      {displayed.length > 0 ? (
        <div className={styles.grid}>
          {displayed.map((project) => (
            <div key={project.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <Folder className={styles.folderIcon} size={22} />
                <h2 className={styles.cardTitle}>{project.name}</h2>
                <button
                  className={styles.detailsBtn}
                  onClick={() => navigate(`/project-details/${project.id}`)}
                >
                  View Details →
                </button>
              </div>
              <p className={styles.description}>{project.description}</p>
              <div className={styles.date}>Created: {project.createdAt}</div>

              {/* Action buttons */}
              <div className={styles.actionBtns}>
                <button
                  className={styles.editBtn}
                  onClick={() => handleEdit(project.id)}
                >
                  <Edit size={16} /> Edit
                </button>
                <button
                  className={styles.deleteBtn}
                  onClick={() => handleDeleteClick(project)}
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.empty}>No projects found.</div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className={`${styles.pageBtn} ${
              currentPage === 1 ? styles.disabled : ""
            }`}
          >
            <ChevronLeft size={18} />
          </button>

          <span className={styles.pageInfo}>
            Page {currentPage} of {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className={`${styles.pageBtn} ${
              currentPage === totalPages ? styles.disabled : ""
            }`}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && projectToDelete && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Delete Project</h3>
            <p>Are you sure you want to delete "{projectToDelete.name}"?</p>
            <div className={styles.modalActions}>
              <button className={styles.cancelBtn} onClick={cancelDelete}>
                Cancel
              </button>
              <button className={styles.confirmBtn} onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardComponent;
