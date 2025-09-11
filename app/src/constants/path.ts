// app
export const REGISTER  = 'register';
export const CREATE = 'create';
export const LOGIN = 'login';
export const LOGOUT = 'logout';

// Estos NO deben comenzar con "/"
const ADMIN = 'admin';
export const BASE_USER = 'users';
export const ADMIN_USER = `${ADMIN}/${BASE_USER}`;
export const BASE_STUDENT = 'students';
export const BASE_OFFER = 'offers';
export const ADMIN_OFFER = `${ADMIN}/${BASE_OFFER}`;

// CRUD dinámico
export const USER_CREATE = `${ADMIN_USER}/${CREATE}`;
export const USER_REGISTER = `${ADMIN_USER}/${REGISTER}`;
export const USER_UPDATE = `${ADMIN_USER}/update/:id`;
export const OFFER_CREATE = `${ADMIN_OFFER}/${CREATE}`;
export const OFFER_UPDATE = `${ADMIN_OFFER}/update/:id`;

//api
export const API_BASE_URL = 'http://localhost:3000/api';
export const BASE_COLLEGE = '/college';
export const BASE_ROLE = '/role';
export const GET_COLLEGE = API_BASE_URL + BASE_COLLEGE;
export const GET_FACULTY = `${API_BASE_URL + BASE_COLLEGE}/faculty`;
export const GET_ROLE = API_BASE_URL + BASE_ROLE;
export const CREATE_USER = `${API_BASE_URL}/user/create`;
export const UPDATE_USER = `${API_BASE_URL}/user/update`;
export const CREATE_OFFER = `${API_BASE_URL}/offer/create`;
export const UPDATE_OFFER = `${API_BASE_URL}/offer/update`;
export const GET_ME = `${API_BASE_URL}/user/me`;
