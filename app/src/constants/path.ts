//app
export const REGISTER  = '/register'
export const CREATE = '/create';
export const LOGIN = '/login';
export const LOGOUT = '/logout';
export const BASE_USER = `/admin/users`;
export const USER_CREATE = BASE_USER+CREATE;
export const USER_REGISTER = BASE_USER+REGISTER;
export const USER_UPDATE = BASE_USER+'/update/:id';

//api
export const API_BASE_URL = 'http://localhost:3000/api';
export const BASE_COLLEGE = '/college';
export const BASE_ROLE = '/role';
export const GET_COLLEGE = API_BASE_URL + BASE_COLLEGE;
export const GET_ROLE = API_BASE_URL + BASE_ROLE;
export const CREATE_USER = API_BASE_URL + '/user/create';
export const UPDATE_USER = API_BASE_URL + '/user/update';
