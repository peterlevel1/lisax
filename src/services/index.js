import { getSimpleServices } from '../utils/common';

const services = getSimpleServices({
  getUser: '/res/u/info',
  login: 'POST /res/u/login',

  getProjects: '/api/project',

  addProject: 'POST /api/project',
  getProject: 'GET /api/project/:id',
  updateProject: 'PUT /api/project/:id',
  delProject: 'DELETE /api/project/:id',

  getProjectFolders: '/api/project/:id/folders',
  getProjectFolderChildren: '/api/docFolder/:id/children',

  addProjectFolder: 'POST /api/docFolder',
  getProjectFolder: 'GET /api/docFolder/:id',
  updateProjectFolder: 'PUT /api/docFolder/:id',
  delProjectFolder: 'DELETE /api/docFolder/:id',

  addProjectNode: 'POST /api/docNode',
  getProjectNode: 'GET /api/docNode/:id',
  updateProjectNode: 'PUT /api/docNode/:id',
  delProjectNode: 'DELETE /api/docNode/:id',
});

export default services;
