const baseURL =
  import.meta.env.MODE === "production"
    ? import.meta.env.VITE_PROD_BASE_URL
    : import.meta.env.VITE_BASE_URL;

export const API_BASE_URL = import.meta.env.MODE === "production" ? import.meta.env.VITE_PROD_API_URL : import.meta.env.VITE_BASE_API_URL;

export const SEARCH_URL = baseURL

export const inner_site_links = (user, profile) => {
  return [
    {
      link: `${baseURL}`,
      visible: true,
      name: "Home",
    },
    {
      link: `${baseURL}recents`,
      visible: false,
      name: "Recents",
    },
    {
      link:    `${baseURL}login`,
      visible: !user ? true : false,
      name: "Login",
    },
    {
      link: `${baseURL}user/signup`,
      visible: !user ? true : false,
      name: "Sign up",
    },
    {
      link: `${baseURL}user/profile`,
      visible: user ? true : false,
      name: "Profile",
    },
    {
      link: `${baseURL}add-book-form`,
      visible:
        user && profile?.permissions?.includes("book_reviews.can_add_book"),
      name: "Add Book",
    },
  ];
};

const API_ENDPOINTS = {
  GETADDBOOKS: `${API_BASE_URL}/api/books/`,
  LOGINTOKEN: `${API_BASE_URL}/api/token/`,
  SEARCHURL: `${API_BASE_URL}/api/books?`,
  VERIFYTOKEN: `${API_BASE_URL}/api/token/verify/`,
  GETSINGLEBOOK: `${API_BASE_URL}/books/`,
  GETPROFILE: `${API_BASE_URL}/user/profile/`,
  REGISTER: `${API_BASE_URL}/register/`,
  USERREVIEWS: `${API_BASE_URL}/profile/reviews`,
};

export default API_ENDPOINTS;
