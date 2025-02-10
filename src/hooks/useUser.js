export default function useUser() {
    const getUserId = () => {
        const USERID = localStorage.getItem("USERID");
        const TOKEN = sessionStorage.getItem("TOKEN");
        const USERNAME = localStorage.getItem("USERNAME");
        if (!USERID || !TOKEN) {
            clearUserData();
        }
        return USERID;
    };

    const clearUserData = () => {
        localStorage.removeItem("USERID");
        localStorage.removeItem("DB_CHOICE");
        sessionStorage.removeItem("TOKEN"); 
        const USERNAME = localStorage.getItem("USERNAME");
    };

    const setUserInfo = (response) => {
        localStorage.setItem("USERID", response.data.data.USERID);
        localStorage.setItem("DB_CHOICE", response.data.data.DB_CHOICE);
        sessionStorage.setItem("TOKEN", response.data.data.TOKEN);
        const USERNAME = localStorage.getItem("USERNAME");
    };

    const getUserData = () => {
        const USERID = localStorage.getItem("USERID");
        const DB_CHOICE = localStorage.getItem("DB_CHOICE");
        const TOKEN = sessionStorage.getItem("TOKEN");
        const USERNAME = localStorage.getItem("USERNAME");

        if (!USERID || !TOKEN) {
            return null;
        }

        return { USERID, DB_CHOICE, TOKEN };
    };

    const isAuthenticated = () => {
        const USERID = localStorage.getItem("USERID");
        const TOKEN = sessionStorage.getItem("TOKEN");
        return USERID !== null && TOKEN !== null;
    };

    return {
        getUserId,
        setUserInfo,
        isAuthenticated,
        clearUserData,
        getUserData,
    };
}
