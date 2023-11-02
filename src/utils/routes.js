const apiURL = process.env.REACT_APP_API;
const api = apiURL + '/api';
export const API_URL = api;

export const LOGIN_ROUTE = `${API_URL}/user/login`;
export const REGISTER_ROUTE = `${API_URL}/user/register`;
export const ALL_USERS = `${API_URL}/user/users`;
export const CONVERSATIONS_ROUTE = `${API_URL}/conversation/conversations`;
export const MESSAGES_ROUTE = (conversationId) => `${API_URL}/conversation/conversations/${conversationId}/messages`;