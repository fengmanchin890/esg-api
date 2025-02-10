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
        localStorage.removeItem("DB_CHOICE");

    };

    const setUserInfo = (response) => {
        localStorage.setItem("USERID", response.data.data.UserId);
        localStorage.setItem("DB_CHOICE", response.data.data.DB_CHOICE);
    };
    

    const getUserData = () => {
        const USERID = localStorage.getItem("USERID");
        const DB_CHOICE = localStorage.getItem("DB_CHOICE");

        if (!USERID) {
            return null;
        }

        return { USERID, DB_CHOICE };
    };

    const isAuthenticated = () => {
        const hasUser = localStorage.getItem("USERID");
        return hasUser !== null;
    };
    

    return {
        getUserId,
        setUserInfo,
        isAuthenticated,
        clearUserData,
        getUserData,
    };
}