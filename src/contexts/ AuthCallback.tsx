import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import {UserContext} from "./UserContext";

const AuthCallback = () => {
    const navigate = useNavigate();
    const userContext = useContext(UserContext);

    useEffect(() => {
        if (userContext) {
            userContext.handleGoogleCallback();
            navigate("/");
        }
    }, [userContext, navigate]);

    return <p>Đang xử lý đăng nhập...</p>;
};

export default AuthCallback;
