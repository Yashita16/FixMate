import { createContext, useContext, useState } from "react";



export const AppContext=createContext();

export const useAppContext = ()=>{
   return  useContext(AppContext)
}

export const AppContextProvider=(props)=>{


  const [login , setLogin]=useState("");

  const value={login, setLogin}
    

   return(
  <AppContext.Provider value={value}>
    {props.children}
      
  </AppContext.Provider>
   )


}