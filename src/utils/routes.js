const apiURL = process.env.REACT_APP_API;
export const API_URL = apiURL;

export const LOGIN_ROUTE = `${API_URL}/api/user/login`;
export const REGISTER_ROUTE = `${API_URL}/api/user/register`;
export const ALL_USERS = `${API_URL}/api/user/users`;
export const CONVERSATIONS_ROUTE = `${API_URL}/api/conversation/conversations`;
export const MESSAGES_ROUTE = (conversationId) => `${API_URL}/api/conversation/conversations/${conversationId}/messages`;
export const LIKE_MESSAGE = (messageId, conversationId) => `${API_URL}/api/conversation/conversations/${conversationId}/messages/${messageId}/like`;