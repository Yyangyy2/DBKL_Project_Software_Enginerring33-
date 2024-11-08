import './login.css';
import React, { useState } from 'react';
import axios from 'axios';

//route
import { Link } from 'react-router-dom';

//icon
import { FaUserShield } from "react-icons/fa";
import { BsFillShieldLockFill } from "react-icons/bs";
import { AiFillEyeInvisible } from "react-icons/ai";
import { MdVisibility } from "react-icons/md";

function LoginPage() {
    const [email, setEmail] = useState('');
    const [ic, setUserIc ] = useState('');
    const [password, setPassword] = useState('');
    const [visible, setVisible] = useState('');
    const [loginStatus, setLoginStatus] = useState('');
    const [userType, setUserType ] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoginStatus(''); // Clear previous login status
        try {
            const response = await axios.post('http://localhost:8081/Login', {
                password,
                userType,
                ...(userType === "users" ? { ic } : { email })
            },{
                withCredentials: true  // Enable credentials for cookies
            });

            if(response.status === 200){
                window.confirm('login successful')
                setTimeout (()=>{
                    if(userType === 'users'){
                        window.location.href='/homepage';
                    }else{
                        window.location.href='/adminhomepage';
                    }
                    
                }, 2000);
            }
            
        } catch (error) {
            setLoginStatus('Login failed. Please try again.');
        }
    };

    return (
        <div className='loginPage'>
            <div className="container">
                <div className="headerDiv">
                    <h1>Login</h1>
                    <h2>Welcome Back!</h2>
                </div>

                <form onSubmit={handleSubmit} className='form'>
                <div className='radio-group'>
                        <label className='radio'>
                                <input
                                    type="radio"
                                    name="userType"
                                    id="user"
                                    value = "users"
                                    onChange={(e) => setUserType(e.target.value)}
                                    /> Users
                                <span></span>
                        </label>
                            <label className='radio'>
                                <input
                                    type="radio"
                                    name="userType"
                                    id="user"
                                    value= "Admin"
                                    onChange={(e) => setUserType(e.target.value)}
                                    /> Admin
                                <span></span>
                            </label>
                        </div>  
                        <>

                        {userType === "Admin"? (
                            <div>
                                <div className="inputDiv">
                                    <label htmlFor="email">Email:</label>
                                    <div className="input flex">
                                        <FaUserShield className='icon' />
                                        <input
                                            type="email"
                                            id="email"
                                            placeholder="Email"
                                            value={email}
                                            required
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                            ) : (<div>
                                <div className="inputDiv">
                                    <label htmlFor="IC">IC:</label>
                                    <div className="input flex">
                                        <FaUserShield className='icon' />
                                        <input
                                            type="text"
                                            id="ic"
                                            placeholder="IC"
                                            value={ic}
                                            required
                                            onChange={(e) => setUserIc(e.target.value)}
                                        />
                                    </div>
                                </div>
                                </div>
                                )
                            }
                        </>

                    <div className="inputDiv">
                        <label htmlFor="password">Password:</label>
                        <div className="input flex">
                            <BsFillShieldLockFill className='icon' />
                            <input
                                type={visible ? "text" : "password"}
                                id="password"
                                placeholder="Password"
                                value={password}
                                required
                                onChange={(e) => setPassword(e.target.value)}
                            />

                            <div onClick={() => setVisible(!visible)}>
                                {visible? <MdVisibility id="password-visible"/> :<AiFillEyeInvisible id="password-visible" />}
                            </div> 

                        </div>
                        

                        {loginStatus && <span className="status">{loginStatus}</span>}
                    </div>
                   
                    <button type="submit" className='btn'>
                        <span>Login</span>
                    </button>

                    <div className="footerDiv">
                        <span>Don't have an account?</span>
                        <Link to='/register'> Sign Up</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;
