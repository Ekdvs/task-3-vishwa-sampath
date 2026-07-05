import api from "./api";

export const categoriesApi = {
  getAll: () => api.get('/categories/my'),

  create: (data: { name: string; type: 'income' | 'expense' }) =>
    api.post('/categories/create', data),

  update: (id: string, data: { name: string; type: 'income' | 'expense' }) =>
    api.put(`/categories/update/${id}`, data),

  delete: (id: string) => api.delete(`/categories/delete/${id}`),
};