

import React from "react";
import { createContext, useState, useEffect } from "react";
import axios from "axios";


export const UserContext = createContext({});

export function UserContextProvider({ children }) {
    const [user, setUser] = useState(null);

    // useEffect(() => {
    //     const fetchUser = async () => {
    //         if (!user) {
    //             try {
    //                 const { data } = await axios.get('/profile');
    //                 setUser(data);
    //                 console.log('User context set:', data);
    //             } catch (err) {
    //                 console.error('Error fetching user profile:', err);
    //             }
    //         }
    //     };

    //     fetchUser();
    // }, [user]);

    useEffect(() => {
        if (!user) {
          axios.get('/profile').then(({data}) => {
            setUser(data);
            console.log('User context set:', data);
          });
        }
      }, []);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
}
