const API_BASE_URL = 'http://127.0.0.1:8000';

export const inner_site_links = (user,profile) => {
    return [
        {
            link: "/",
            visible: true,
            name: "Home",
        },
        {
            link: "/recents",
            visible: false,
            name: "Recents",
        },
        {
            link: "/login",
            visible: !user ? true : false,
            name: "Login",
        },
        {
            link: "/user/signup",
            visible: !user ? true : false,
            name: "Sign up",
        },
        {
            link: "/user/profile",
            visible: user ? true : false,
            name: "Profile",
        },
        {
            link: "/add-book-form",
            visible:
                user && profile?.permissions?.includes("book_reviews.can_add_book"),
            name: "Add Book",
        },
    ];
}

const API_ENDPOINTS = {
    GETADDBOOKS: `${API_BASE_URL}/api/books/`,
    LOGINTOKEN: `${API_BASE_URL}/api/token/`,
    SEARCHURL: `${API_BASE_URL}/api/books?`,
    VERIFYTOKEN: `${API_BASE_URL}/api/token/verify/`,
    GETSINGLEBOOK: `${API_BASE_URL}/books/`,
    GETPROFILE: `${API_BASE_URL}/user/profile/`,
    REGISTER: `${API_BASE_URL}/register/`,
    USERREVIEWS: `${API_BASE_URL}/profile/reviews`
}

export default API_ENDPOINTS
