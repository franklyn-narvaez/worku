// app
export const REGISTER = "register";
export const CREATE = "create";
export const LOGIN = "login";
export const LOGOUT = "logout";

// Estos NO deben comenzar con "/"
const ADMIN = "/admin";
export const BASE_DEPENDENCE = "/dependence";
export const BASE_USER = "users";
export const BASE_STUDENT = "/student";
export const BASE_OFFER = "offers";
export const BASE_APPLICATION = "applications";
export const BASE_PROFILE = "profile";
export const ADMIN_USER = `${ADMIN}/${BASE_USER}`;
export const ADMIN_OFFER = `${ADMIN}/${BASE_OFFER}`;
export const STUDENT_OFFERS = `${BASE_STUDENT}/${BASE_OFFER}`;
export const STUDENT_APPLICATIONS = `${BASE_STUDENT}/${BASE_APPLICATION}`;
export const STUDENT_PROFILES = `${BASE_STUDENT}/${BASE_PROFILE}`;

// CRUD dinámico
export const USER_CREATE = `${ADMIN_USER}/${CREATE}`;
export const USER_REGISTER = `${ADMIN_USER}/${REGISTER}`;
export const USER_UPDATE = `${ADMIN_USER}/update/:id`;
export const OFFER_CREATE = `${ADMIN_OFFER}/${CREATE}`;
export const OFFER_UPDATE = `${ADMIN_OFFER}/update/:id`;

export const DEPENDENCE_OFFERS = `${BASE_DEPENDENCE}/${BASE_OFFER}`;
export const DEPENDENCE_OFFER_CREATE = `${DEPENDENCE_OFFERS}/${CREATE}`;
export const DEPENDENCE_OFFER_UPDATE = `${DEPENDENCE_OFFERS}/update/:id`;
export const DEPENDENCE_APPLICANTS = `${DEPENDENCE_OFFERS}/:id/applicants`;
export const DEPENDENCE_OFFER_DETAILS = `${DEPENDENCE_OFFERS}/:id/details`;
export const DEPENDENCE_APPLICANTS_DETAILS = `${DEPENDENCE_OFFERS}/applicants/:id/profile`;

//api
export const HOST_API = import.meta.env.VITE_API_URL || "http://localhost:3000";
export const API_BASE_URL = `${HOST_API}/api`;
export const BASE_COLLEGE = "/college";
export const BASE_ROLE = "/role";
export const BASE_OFFER_API = "/offer";
export const BASE_USER_API = "/user";
export const BASE_STUDENT_OFFER = "/student-offers";
export const BASE_OFFER_DEPENDENCE = "/offers-dependence";

export const GET_COLLEGE = API_BASE_URL + BASE_COLLEGE;
export const GET_FACULTY = `${API_BASE_URL + BASE_COLLEGE}/faculty`;
export const GET_ROLE = API_BASE_URL + BASE_ROLE;
export const CREATE_USER = `${API_BASE_URL}/user/create`;
export const UPDATE_USER = `${API_BASE_URL}/user/update`;
export const CREATE_OFFER = `${API_BASE_URL}/offer/create`;
export const UPDATE_OFFER = `${API_BASE_URL}/offer/update`;
export const CREATE_OFFER_DEPENDENCE = `${API_BASE_URL}/offers-dependence/create`;
export const UPDATE_OFFER_DEPENDENCE = `${API_BASE_URL}/offers-dependence/update`;

export const GET_ME = `${API_BASE_URL}/user/me`;

export const STUDENT_OFFER = `${API_BASE_URL}${BASE_STUDENT_OFFER}`;
export const APPLY_TO_OFFER = `${API_BASE_URL}/student-offer/:offerId/apply`;

export const STUDENT_PROFILE = `${STUDENT_OFFER}/profile`;
export const VIEW_PROFILE = `${STUDENT_OFFER}/view-profile`;
export const UPDATE_PROFILE = `${STUDENT_OFFER}/update-profile`;
