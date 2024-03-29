const apiURL = process.env.REACT_APP_API;
export const API_URL = apiURL;

export const LOGIN_ROUTE = `${API_URL}/api/user/login`;
export const VALIDATE_TOKEN = `${API_URL}/api/user/validate-token`;
export const REGISTER_ROUTE = `${API_URL}/api/user/register`;
export const ALL_USERS = `${API_URL}/api/user/users`;
export const CONVERSATIONS_ROUTE = `${API_URL}/api/conversation/conversations`;
export const UPLOAD_PICTURE = `${API_URL}/api/user/profilePicture`;
export const SINGLE_USER = (userId) => `${API_URL}/api/user/profile/${userId}`;
export const MESSAGES_ROUTE = (conversationId) => `${API_URL}/api/conversation/conversations/${conversationId}/messages`;
export const LIKE_MESSAGE = (messageId, conversationId) => `${API_URL}/api/conversation/conversations/${conversationId}/messages/${messageId}/like`;