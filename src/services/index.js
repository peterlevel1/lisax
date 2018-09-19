import { getSimpleServices } from '../utils/common';

const services = getSimpleServices({
  getUser: '/res/u/info',
  login: 'POST /res/u/login',
  getProjects: '/api/project',
  getProjectById: '/api/project/:id',
  updateProject: 'PUT /api/project/:id',
  // 需要填写query: children=true
  getNodeChildren: '/api/docNode/:id/children',
});

export default services;
