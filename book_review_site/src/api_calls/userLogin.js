import API_ENDPOINTS from "../apiConfig";

export async function userLogin(userData) {
  

  try {
    const response = await fetch(API_ENDPOINTS.LOGINTOKEN, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.detail || "Login failed");
    }

    const data = await response.json();
    return [true, data];
  } catch (error) {
    return [false, error.message];
  }
}

export async function verifyToken(token) {

  try {
    if (!token) {
      throw new Error("no token stored");
    }
    const response = await fetch(API_ENDPOINTS.VERIFYTOKEN, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ token: token }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.detail || "Token Verification failed");
    }

    const data = await response.json();
    return true;
  } catch (err) {
    return false;
  }
}

export async function fetchProfile(token) {

  try {
    const response = await fetch(API_ENDPOINTS.GETPROFILE, {
      method: "GET",
      headers: {
        "Content-Type": "applications/josn",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const err = await response.json();
      console.log(err);
      
      throw new Error(err.detail || "Failed to find user");
    }

    const user = await response.json();
    return user;
  } catch (err) {
    return null;
  }
}

export async function getUserReviews(token) {}

export async function createNewUser(formdata) {

  try {
    const response = await fetch(API_ENDPOINTS.REGISTER, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formdata),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.detail || "Error processing form");
    }

    const data = await response.json();
    return [true, data];
  } catch (err) {
    return [false, err.message];
  }
}
