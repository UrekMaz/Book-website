import { useState } from "react";
import { Link } from "react-router-dom";
import axios from"axios";

export default function Register(){

    const [name,setname]= useState('');
    const [email,setemail]= useState('');
    const [pwd,setpwd]= useState('');
    async function resgisterFunc(ev){
        ev.preventDefault();
        try{
            await axios.post('/register',{name,email,pwd},{withCredentials: true});
            alert("Registeration successful");
        }catch(er){
            alert("Registeration Unsuccessful")
        }
        
    }
    return(
        
        <div className="mt-4 grow flex items-center justify-around">
            <div  className="mb-64">
                <h1 className="text-4xl text-center mb-4">REGISTER </h1>
                <form className="max-w-md mx-auto" onSubmit={resgisterFunc}> 
                    <input type="text" placeholder="name" value={name} onChange={ev=>
                        setname(ev.target.value)}>
                    </input>
                    <input type="email" placeholder="email"value={email} onChange={ev=>
                        setemail(ev.target.value)}></input>
                    <input type="password" placeholder="pwd"value={pwd} onChange={ev=>
                        setpwd(ev.target.value)}></input>
                    <button className="primary">Register</button>
                    <div className="text-center py-2">
                        Already have a account? <Link to={'/login'} className="underline text-center">
                        Login Here</Link>
                    </div>

                </form>

            </div>
        </div>
    )
}