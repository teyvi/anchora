import { Router } from "express";
 import { 
  createUser, 
  login, 
  setPassword,
  getUsers,
  deactivateUser 
} from "../controllers/users.controller";

 import { 
  createPost, 
  getMyPosts,
  getAllPosts, 
  approvePost, 
  rejectPost 
} from "../controllers/posts.controller";

 import authMiddleware from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/role.middleware";

const router = Router();

 // PUBLIC ROUTES (No authentication required)
router.post('/login', login);

// AUTHENTICATED USER ROUTES
 router.post('/set-password', setPassword);

// User Posts
router.post('/posts', authMiddleware, createPost);
router.get('/posts/my-posts', authMiddleware, getMyPosts);

 // ADMIN ROUTES (Authentication + Admin role)
// User Management
router.post('/admin/users', authMiddleware, requireAdmin, createUser);
router.get('/admin/users', authMiddleware, requireAdmin, getUsers);
router.patch('/admin/users/:id/deactivate', authMiddleware, requireAdmin, deactivateUser);

// Post Management
router.get('/admin/posts', authMiddleware, requireAdmin, getAllPosts);
router.patch('/admin/posts/:id/approve', authMiddleware, requireAdmin, approvePost);
router.patch('/admin/posts/:id/reject', authMiddleware, requireAdmin, rejectPost);

export default router;