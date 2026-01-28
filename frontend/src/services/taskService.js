import api from "./api";

export const taskService = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await api.get(`/tasks?${params}`);
    return response.data;
  },

  getOne: async (id) => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },

  getMyTasks: async () => {
    const response = await api.get("/tasks/my-tasks");
    return response.data;
  },

  create: async (data) => {
    const response = await api.post("/tasks", data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/tasks/${id}`, data);
    return response.data;
  },

  updateStatus: async (id, status) => {
    const response = await api.patch(`/tasks/${id}/status`, { status });
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },

  getStats: async () => {
    const response = await api.get("/tasks/stats");
    return response.data;
  },
};
