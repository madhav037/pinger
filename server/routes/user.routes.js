import { Router } from "express";
import {
  deleteUser,
  deleteUserProject,
  getUserById,
  getUserProjects,
  getUserProjectById,
  updateUser,
  updateUserProject,
  addUserProject,
} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = Router();

router.get("/:id", getUserById);
router.put("/:id", verifyToken, updateUser);
router.delete("/delete/:id", verifyToken, deleteUser);
router.get("/:id/projects", getUserProjects);
router.get("/:user_id/projects/:project_id", getUserProjectById);
router.post("/:id/projects", verifyToken, addUserProject);
router.put("/:user_id/projects/:project_id", verifyToken, updateUserProject);
router.delete("/:user_id/projects/:project_id", verifyToken, deleteUserProject);

export default router;