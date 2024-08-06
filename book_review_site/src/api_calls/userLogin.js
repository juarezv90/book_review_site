export async function userLogin(userData) {
  const url = "http://127.0.0.1:8000/api/token/";

  try {
    const response = await fetch(url, {
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
  const url = "http://127.0.0.1:8000/api/token/verify/";

  try {
    if (!token) {
      throw new Error("no token stored");
    }
    const response = await fetch(url, {
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
  const url = "http://127.0.0.1:8000/user/profile";

  try {
    const response = await fetch(url, {
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
  const url = "http://127.0.0.1:8000/register/";

  try {
    const response = await fetch(url, {
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
