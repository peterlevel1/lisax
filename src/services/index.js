import { getSimpleServices, getRestRequestObj } from '../utils/common';

const services = getSimpleServices({
  getUser: 'GET /res/user/info',
  login: 'POST /res/user/login',
  logout: 'GET /res/user/logout',

  ab: 'GET /res/a/b/index',

  ...getRestRequestObj('project'),

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
