//app
export const REGISTER  = '/register'
export const CREATE = '/create';
export const LOGIN = '/login';
export const LOGOUT = '/logout';
export const BASE_USER = `/admin/users`;
export const BASE_OFFER = `/admin/offers`;
export const USER_CREATE = BASE_USER+CREATE;
export const USER_REGISTER = BASE_USER+REGISTER;
export const USER_UPDATE = BASE_USER+'/update/:id';
export const OFFER_CREATE = BASE_OFFER+CREATE;
export const OFFER_UPDATE = BASE_OFFER+'/update/:id';

//api
export const API_BASE_URL = 'http://localhost:3000/api';
export const BASE_COLLEGE = '/college';
export const BASE_ROLE = '/role';
export const GET_COLLEGE = API_BASE_URL + BASE_COLLEGE;
export const GET_FACULTY = API_BASE_URL + BASE_COLLEGE + '/faculty';
export const GET_ROLE = API_BASE_URL + BASE_ROLE;
export const CREATE_USER = API_BASE_URL + '/user/create';
export const UPDATE_USER = API_BASE_URL + '/user/update';
export const CREATE_OFFER = API_BASE_URL + '/offer/create';
export const UPDATE_OFFER = API_BASE_URL + '/offer/update';
