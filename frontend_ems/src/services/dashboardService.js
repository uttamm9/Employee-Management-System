import api from './api';

const dashboardService = {
  // Fetch dashboard statistics (admin only)
  getStats: async () => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },
};

export default dashboardService;
