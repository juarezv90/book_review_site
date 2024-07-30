export async function verifyToken(token){
    const url = "http://127.0.0.1:8000/api/token/verify/";

    try {
        if(!token) {
            throw new Error("no token stored")
        }
        const response = await fetch(url, {
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                "Authorization":`Bearer ${token}`
            },
            body:JSON.stringify({token:token})
        });

        if(!response.ok) {
            const err = await response.json();
            throw new Error(err.detail || "Token Verification failed")
        }

        const data = await response.json()
        console.log(data);
        return true
    } catch (err) {
        console.error("Token verification failed", err.message);
        return false
    }
}

export async function fetchProfile(token) {
    const url = "http://127.0.0.1:8000/user/profile"

    try {
        const response = await fetch(url, {
            method:"GET",
            headers:{
                "Content-Type":"applications/josn",
                "Authorization":`Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(err.detail || "Failed to find user");
        }

        const user = await response.json();
        return user;
    } catch (err) {
        console.log(error.message)
        return null
    }
}

export async function getUserReviews(token) {

}