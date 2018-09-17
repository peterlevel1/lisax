import { getSimpleServices } from '../utils/common';

const services = getSimpleServices({
  getUser: '/res/u/info',
  getProjects: '/api/project',
  getProjectById: '/api/project/:id',
  updateProject: 'PUT /api/project/:id',
  getNodeChildren: '/api/docNodeChildren/:id',
});

export default services;
