import api from "./api";

export const dashboardApi = {
  getSummary: () => api.get('/dashboard/summary'),
  getChartsData: () => api.get('/dashboard/charts-data'),
};
