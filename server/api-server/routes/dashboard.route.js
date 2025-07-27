import { Router } from "express";
import { authorizeRoles, verifyJWT } from "../middlewares/authorize.middleware.js";

import {
  getDashboardOrderedProducts 
  
} from "../controllers/dashboard.controller.js";


const router = Router()

router.route('/get-dashboard-ordered-products').get(verifyJWT, getDashboardOrderedProducts)

export default router