import { use, useEffect } from "react";
import {adminApi} from "@/lib/config";
import useAuthStore from "@/store/useAuthStore";

export const useAxiosPrivate = () => {
    const {logout} = useAuthStore();

    useEffect(() => {

        const responseIntercept = adminApi.interceptors.response.use(
            (response) => response,
            (error) => {
                if( error.response?.status === 401){
                    window.location.href = "/login";
                }
                return Promise.reject(error);
            }
        );
        return () => {
            adminApi.interceptors.response.eject(responseIntercept);
        };

    }, [logout]);

    return adminApi;
};

