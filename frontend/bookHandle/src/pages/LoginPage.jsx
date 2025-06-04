import { Link, Navigate } from "react-router-dom";
import { useContext, useState } from "react";
import axios from"axios";
import { UserContext } from "../UserContext";

export default function LoginPage(){
    const [email,setemail]= useState('');
    const [pwd,setpwd]= useState('');
    const [redirect,setRedirect] = useState(false);
    const {setUser} = useContext(UserContext);

    async function handleLogin(ev){
        ev.preventDefault();
        try{
            const {data} = await axios.post('/login', { email, pwd });
            setUser(data);
            console.log(data);
            
            
            
        if (data.email ===email ) {
            alert("login successful");
            setRedirect(true);
            // Token is stored in a cookie, no need to store it in localStorage
        }
        else{
            alert(data)
        }  
                
        }catch(er){
            console.log(er);
            alert("login Unsuccessful")
        }
        
    }

    if(redirect){
        return <Navigate to={'/'}/>;
    }

    return(
        
        <div className="mt-40 grow flex items-center justify-around ">
            <div  className="">
                <h1 className="text-4xl text-center mb-4 ">LOGIN </h1>
                <form className="m-7" onSubmit={handleLogin}> 
                    <input type="email" placeholder="email" value={email} 
                    onChange={ev =>{setemail(ev.target.value)}} ></input>

                    <input type="password" placeholder="pwd" value={pwd} 
                    onChange={ev =>{setpwd(ev.target.value)}}></input>
                    <button className="primary">Login</button>
                    <div className="text-center py-2">
                        Dont have  aaccount yet? <Link to={'/register'} className="underline text-center">
                        Register Here</Link>
                    </div>

                </form>

            </div>
        </div>
    )
}