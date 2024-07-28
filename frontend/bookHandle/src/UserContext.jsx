import {createContext, useState} from "react";
import { useEffect } from "react";
import axios from "axios";
import {data} from "autoprefixer";

export const UserContext = createContext({});

export function UserContextProvider({children}) {
    const [user, setUser] = useState(null);

    useEffect (() => {
        if (!user) {
            try{
                axios.get('/profile').then(({data})=>{
                    setUser(data);
                });
            }
            catch(er){
                console.log(er);
            }
        
        }
    }, []);

    return (
        <UserContext.Provider value={{user, setUser}}>
        {children}
        </UserContext.Provider>
    );
}