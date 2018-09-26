export const ENV = process.env.NODE_ENV;

export const API_PREFIX = 'api';
export const ACTION_PREFIX = 'res';

export const REQUEST_METHODS = ['GET', 'POST', 'PUT', 'DELETE'];

export const REQUEST_CONTENT_TYPES = [
  'X-WWW-FORM-URLENCODED',
  'JSON',
  'RAW',
  'XML'
];

export const REQUEST_PARAM_TYPES = [
  'string',
  'number',
  'boolean',
  'object',
  'array',
  'array[string]',
  'array[number]',
  'array[boolean]',
  'array[object]',
  'array[array]',
];

export const RESPONSE_CONTENT_TYPES = [
  'JSON',
  'JSONP',
  'TEXT',
  'XML',
  'HTML',
  'IMAGE'
];

export const NODE_TYPE_ROOT = '0';
export const NODE_TYPE_FOLDER = '1';
export const NODE_TYPE_HTTPDOC = '2';

