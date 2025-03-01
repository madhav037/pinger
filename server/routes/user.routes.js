import { Router } from "express";
import {
  deleteUser,
  deleteUserProject,
  getUserById,
  getUserProjects,
  getUserProjectsById,
  updateUser,
  updateUserProject,
} from "../controllers/user.controller.js";

const router = Router();

router.get("/users/:id", getUserById);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);
router.get("/users/:id/projects", getUserProjects);
router.get("/users/:id/projects/:id", getUserProjectsById);
router.post("/users/:id/projects", updateUserProject);
router.put("/users/:id/projects/:id", updateUserProject);
router.delete("/users/:id/projects/:id", deleteUserProject);

export default router;