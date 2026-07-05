import api from "./api";

export const transactionsApi = {
  getAll: (filters?: any) =>
    api.get("/transactions/my", { params: filters }),

  getById: (id: string) =>
    api.get(`/transactions/my/${id}`),

  create: (data: any) =>
    api.post("/transactions/create", data),

  update: (id: string, data: any) =>
    api.put(`/transactions/update/${id}`, data),

  delete: (id: string) =>
    api.delete(`/transactions/delete/${id}`),
};