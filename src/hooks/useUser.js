export default function useUser() {
    const getUserId = () => {
        const USERID = localStorage.getItem("USERID");
        const TOKEN = sessionStorage.getItem("TOKEN");
        // const USERNAME = localStorage.getItem("USERNAME");
        if (!USERID || !TOKEN) {
            clearUserData();
        }
        return USERID;
    };

    const clearUserData = () => {
        localStorage.removeItem("USERID");
        localStorage.removeItem("DB_CHOICE");
        localStorage.removeItem("DB_CHOICE2");
        sessionStorage.removeItem("TOKEN"); 
        // const USERNAME = localStorage.getItem("USERNAME");
        localStorage.clear();
    };

    const setUserInfo = (response) => {
        localStorage.setItem("USERID", response.data.data.USERID);
        localStorage.setItem("DB_CHOICE", response.data.data.DB_CHOICE);
        localStorage.setItem("DB_CHOICE2", response.data.data.DB_CHOICE2);
        sessionStorage.setItem("TOKEN", response.data.data.TOKEN);
        // const USERNAME = localStorage.getItem("USERNAME");
    };

    const getUserData = () => {
        const USERID = localStorage.getItem("USERID");
        const DB_CHOICE = localStorage.getItem("DB_CHOICE");
        const DB_CHOICE2 = localStorage.getItem("DB_CHOICE2");
        const TOKEN = sessionStorage.getItem("TOKEN");
        // const USERNAME = localStorage.getItem("USERNAME");

        if (!USERID || !TOKEN) {
            return null;
        }

        return { USERID, DB_CHOICE, DB_CHOICE2,TOKEN };
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
