import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";



export const AppContext=createContext();

export const useAppContext = ()=>{
   return  useContext(AppContext)
}

export const AppContextProvider=(props)=>{

  const navigate = useNavigate();
  const [isUserLogin , setIsUserLogin] = useState(false);
  const [isExpertLogin , setIsExpertLogin]=useState(false);


  const [login , setLogin]=useState("");

  const value={login, setLogin , navigate , isUserLogin , setIsUserLogin , isExpertLogin , setIsExpertLogin}
    

   return(
  <AppContext.Provider value={value}>
    {props.children}
      
  </AppContext.Provider>
   )


}