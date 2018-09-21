import { getSimpleServices } from '../utils/common';

const services = getSimpleServices({
  getUser: 'GET /res/u/info',
  login: 'POST /res/u/login',

  getProjects: 'GET /api/project',
  addProject: 'POST /api/project',
  getProject: 'GET /api/project/:id',
  updateProject: 'PUT /api/project/:id',
  delProject: 'DELETE /api/project/:id',

  addProjectFolder: 'POST /api/docFolder',
  getProjectFolders: 'GET /api/docFolder',
  getProjectFolder: 'GET /api/docFolder/:id',
  updateProjectFolder: 'PUT /api/docFolder/:id',
  delProjectFolder: 'DELETE /api/docFolder/:id',

  addProjectNode: 'POST /api/docNode',
  getProjectNodes: 'GET /api/docNode',
  getProjectNode: 'GET /api/docNode/:id',
  updateProjectNode: 'PUT /api/docNode/:id',
  delProjectNode: 'DELETE /api/docNode/:id',
});

export default services;
