import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext"; // Note the path change

export const useAuth = () => {
    return useContext(AuthContext);
};