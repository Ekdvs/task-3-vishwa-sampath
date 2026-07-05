import api from "./api";

export const budgetsApi = {
  getAll: () => api.get("/budgets/getAll"),
  create: (data: any) => api.post("/budgets/create", data),
  update: (id: string, data: any) =>
    api.put(`/budgets/update/${id}`, data),
  delete: (id: string) => api.delete(`/budgets/delete/${id}`),
  getProgress: (id: string) =>
    api.get(`/budgets/progress/${id}`),
  getAllProgress: () => api.get("/budgets/all-progress"),
};