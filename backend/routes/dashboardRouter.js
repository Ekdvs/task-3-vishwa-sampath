import express from 'express';
import auth from '../middleware/auth.js';
import { getDashboardChartsData, getDashboardSummary } from '../controllers/dashboardController.js';

const dashboardRouter = express.Router();

dashboardRouter.get('/summary', auth, getDashboardSummary);
dashboardRouter.get('/charts-data', auth, getDashboardChartsData);

export default dashboardRouter;