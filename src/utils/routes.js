const apiURL = process.env.REACT_APP_API;
export const API_URL = apiURL;

export const LOGIN_ROUTE = `${apiURL}/api/user/login`;
export const REGISTER_ROUTE = `${apiURL}/api/user/register`;
export const ALL_USERS = `${apiURL}/api/user/users`;
export const CONVERSATIONS_ROUTE = `${apiURL}/api/conversation/conversations`;
export const MESSAGES_ROUTE = (conversationId) => `${apiURL}/api/conversation/conversations/${conversationId}/messages`;
