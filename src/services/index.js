import { getSimpleServices, getRestRequestObj } from '../utils/common';

const services = getSimpleServices({
  getUser: 'GET /res/user/info',
  login: 'POST /res/user/login',
  logout: 'GET /res/user/logout',

  ab: 'GET /res/a/b/index',

  ...getRestRequestObj('project'),
  ...getRestRequestObj('projectFolder', 'docFolder'),
  ...getRestRequestObj('projectNode', 'docNode'),
});

export default services;
