import { useState } from "react";
import AuthContext from "./AuthContext";

export const AuthProvider = ({ children }) => {

  const [user,setUser] = useState(()=>{

    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;

  });

  const login = (data)=>{

    localStorage.setItem("token",data.token);
    localStorage.setItem("user",JSON.stringify(data.user));

    setUser(data.user);

  };

  const logout = ()=>{

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);

  };

  const isAuthenticated = !!user;

  return(

    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAuthenticated
    }}>

      {children}

    </AuthContext.Provider>

  );

};