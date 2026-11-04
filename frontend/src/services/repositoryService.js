import api from './api';

const repositoryService = {
  getAll: () => api.get('/repositories'),
  create: (data) => api.post('/repositories', data),
  update: (id, data) => api.put(`/repositories/${id}`, data),
  remove: (id) => api.delete(`/repositories/${id}`)
};

export default repositoryService;