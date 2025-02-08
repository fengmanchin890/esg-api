export default function useUser() {
    const getUserId = () => {
        const USERID = localStorage.getItem("USERID");
        if (!USERID) {
            clearUserData();
        }
        return USERID;
    };

    const clearUserData = () => {
        localStorage.removeItem("USERID");
        localStorage.removeItem("USERNAME");
        localStorage.removeItem("token");
        localStorage.removeItem("role");
    };

    const setUserInfo = (response) => {
        localStorage.setItem("USERID", response.data.data.UserId);
        localStorage.setItem("USERNAME", response.data.data.UserName);
        localStorage.setItem("token", response.data.data.Token);
        localStorage.setItem("role", response.data.data.Role);
    };

    const getUserData = () => {
        const USERID = localStorage.getItem("USERID");
        const USERNAME = localStorage.getItem("USERNAME");
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");

        if (!token) {
            return null;
        }

        return { USERID, USERNAME, token, role };
    };

    const isAuthenticated = () => {
        const hasToken = localStorage.getItem("token");
        return hasToken !== null;
    };

    return {
        getUserId,
        setUserInfo,
        isAuthenticated,
        clearUserData,
        getUserData,
    };
}