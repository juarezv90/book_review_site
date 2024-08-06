const API_BASE_URL = 'http://127.0.0.1:8000';

//TODO: Need to move all links from projects to this location

const API_ENDPOINTS = {
    GETADDBOOKS: `${API_BASE_URL}/api/books/`,
    LOGINTOKEN:`${API_BASE_URL}/api/token/`,
    REFRESHTOKEN:"",
    VERIFYTOKEN:`${API_BASE_URL}/api/token/verify/`,
    GETSINGLEBOOK:`${API_BASE_URL}/books/`,
    GETPROFILE:`${API_BASE_URL}/user/profile/`,
    REGISTER:`${API_BASE_URL}/register/`,
    USERREVIEWS:`${API_BASE_URL}/profile/reviews`
}

export default API_ENDPOINTS
