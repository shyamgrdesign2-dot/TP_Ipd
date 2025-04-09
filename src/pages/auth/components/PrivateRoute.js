import { Navigate, useNavigate } from "react-router-dom";
import { PERSISTANT_STORAGE_KEY_AUTH_TOKEN } from "../../../utils/constants";
import { useEffect } from "react";
import { useLocalStorage } from "../../../utils/localStorage";

const PrivateRoute = ({ children }) => {
  const navigate = useNavigate();
  const [getToken] = useLocalStorage(PERSISTANT_STORAGE_KEY_AUTH_TOKEN);
  const token = getToken();

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  return getToken ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
