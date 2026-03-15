import { useNavigate } from "react-router-dom";

const useAuth = () => {

  const navigate = useNavigate();

  const logout = () => {

    localStorage.removeItem("token");

    navigate("/login");

  };

  return { logout };

};

export default useAuth;