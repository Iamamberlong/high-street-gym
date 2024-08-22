import { createContext, useContext, useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode"
import {
    login as apiLogin,
    logout as apiLogout,

} from "../api/users";

export const AuthenticationContext = createContext(null);

export function AuthenticationProvider({ router, children }) {
    const [authenticatedUser, setAuthenticatedUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("jwtToken");
            console.log("token in authentication is: ", token)
            if (token) {

                try {
                    const decodedUser = jwtDecode(result.token)
                    setAuthenticatedUser(decodedUser);

                } catch(error) {
                    console.error("Failed to fetch user")
                    localStorage.removeItem("jwtToken");
                    router.navigate("/");
                    };
            }
        }
        fetchUser() 
    }, [router]);

    return (
        <AuthenticationContext.Provider value={[authenticatedUser, setAuthenticatedUser]}>
            {children}
        </AuthenticationContext.Provider>
    );
}

export function useAuthentication() {
    const [authenticatedUser, setAuthenticatedUser] = useContext(AuthenticationContext);
 
    async function login(email, password) {
        setAuthenticatedUser(null);
        try {
            const result = await apiLogin(email, password);
            if (result.token) {
                localStorage.setItem('jwtToken', result.token);
                console.log("In the useAuthentication, token is: ", result.token)
                const decodedUser = jwtDecode(result.token)
                setAuthenticatedUser(decodedUser);
                console.log("The decodedUser is: ", decodedUser)
                return Promise.resolve(result.message);
            } else {
                return Promise.reject(result.message);
            }
        } catch (error) {
            return Promise.reject(error);
        }
    }

    async function logout() {
        const token = localStorage.getItem('jwtToken');
        localStorage.removeItem('jwtToken');
        if (authenticatedUser && token) {
            try {
                const result = await apiLogout(token);
                setAuthenticatedUser(null);
                return Promise.resolve(result.message);
            } catch (error) {
                return Promise.reject(error);
            }
        }
        setAuthenticatedUser(null)
    }

    async function refresh() {
        const token = localStorage.getItem('jwtToken');
        if (authenticatedUser && token) {
            try {
                const decodedUser = jwtDecode(result.token)
                setAuthenticatedUser(decodedUser);

                return Promise.resolve('User refreshed');
            } catch (error) {
                return Promise.reject('User must be authenticated');
            }
        } else {
            return Promise.reject('User must be authenticated');
        }
    }

    return [authenticatedUser, login, logout, refresh];
}
