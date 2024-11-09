    //css
    import './register.css';

    //function
    import {checkAccountExists, registerUser} from './register_service'
    import {arePasswordsMatching, isPasswordValid, isValidEmail, isValidIC} from './register_validation'

    import React, { useState, useEffect, useRef } from 'react';

    //react icon
    import { Link } from 'react-router-dom';
    import { FaUserShield } from "react-icons/fa";
    import { BsFillShieldLockFill } from "react-icons/bs";
    import { AiFillEyeInvisible } from "react-icons/ai";
    import { MdVisibility } from "react-icons/md";

    function Register() {

        const [username, setUsername] = useState('');
        const [ic, setUserIc ] = useState('');
        const [email, setEmail] = useState(''); // State for email
        const [password, setPassword] = useState('');
        const [passwordVisible, setPasswordVisible] = useState(false);
        const [confirmPassword, setConfirmPassword] = useState(''); // State for confirm password
        const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
        const [registerStatus, setRegisterStatus] = useState('');
        const [userType, setUserType ] = useState('');

        //password strength
        const passwordRef = useRef(null);
        const passwordMessageRef = useRef(null);
        const passwordStrengthRef = useRef(null);

        const confirmPasswordRef = useRef(null);
        const confirmPasswordMessageRef = useRef(null);
        const confirmPasswordStrengthRef = useRef(null);

        //password strength
        useEffect(() => {
            const handleInput = (event) => {
                const { target } = event;
                const value = target.value;
                const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(value);
                const isPasswordField = target === passwordRef.current;
                const messageRef = isPasswordField ? passwordMessageRef : confirmPasswordMessageRef;
                const strengthRef = isPasswordField ? passwordStrengthRef : confirmPasswordStrengthRef;

                // Show or hide the message
                messageRef.current.style.display = value.length > 0 ? "block" : "none";

                // Determine strength
                if (value.length <= 5 || !hasSymbol) {
                    strengthRef.current.innerHTML = "weak";
                    messageRef.current.style.color = "#ff5925";
                } else if (value.length >= 6 && value.length < 8 && hasSymbol) {
                    strengthRef.current.innerHTML = "medium";
                    messageRef.current.style.color = "#FFA500";
                } else if (value.length >= 8 && hasSymbol) {
                    strengthRef.current.innerHTML = "strong";
                    messageRef.current.style.color = "#26d730";
                }
            };

            const currentPasswordRef = passwordRef.current;
            const currentConfirmPasswordRef = confirmPasswordRef.current;

            if (currentPasswordRef) {
                currentPasswordRef.addEventListener('input', handleInput);
            }
            if (currentConfirmPasswordRef) {
                currentConfirmPasswordRef.addEventListener('input', handleInput);
            }

            return () => {
                if (currentPasswordRef) {
                    currentPasswordRef.removeEventListener('input', handleInput);
                }
                if (currentConfirmPasswordRef) {
                    currentConfirmPasswordRef.removeEventListener('input', handleInput);
                }
            };
        }, []);


        const handleSubmit = async (event) => {
            event.preventDefault();

            // Validate that passwords match
            if (!arePasswordsMatching(password, confirmPassword)) {
                setRegisterStatus('Passwords do not match.');
                return;
            }

            // Validate password length
            if (!isPasswordValid(password)) {
                setRegisterStatus('Password must be at least 6 characters.');
                return;
            }

            //Check if user type is Admin; ignore email validation for IC
            // Check user type and validate accordingly
            if (userType === "Users") {
                if (!isValidIC(ic)) {
                    setRegisterStatus('Invalid IC format. Please use YYMMDD-SSS3 format.');
                    return;
                }
            } else if (userType === "Admin") {
                // Validate email format for Admin
                if (!isValidEmail(email)) {
                    setRegisterStatus('Invalid email format.');
                    return;
                }
            }
                    
            //check if account exist    
            try{
                const response = await checkAccountExists(username, email, ic, userType)
                const existEmail = 'An account already exists with this email.'
                const existUsername = 'An account already exists with this username.'
                const existIC = 'An account already exists with this IC.    '

                if (response.message === existEmail || response.message === existUsername) {
                    setRegisterStatus('An account already exists!');
                    return;

                }else if(response.message === existIC){
                    setRegisterStatus('An account already exists with this IC.');
                    return;
                    
                } else {
                    window.confirm('Sign Up Successful')
                }

            }catch(error){
                setRegisterStatus('Error checking account existence: ',error);
                return;
            }

            //register successfully
            try{
                const response = await registerUser(username, ic, email, password, userType)
                if(response.message === 'Sign Up Successful'){
                    //redirect to login page
                    setTimeout(() => {
                        window.location.href='/login';
                    }, 2000);
                }   

            }catch(error){
                setRegisterStatus('Registration failed. Please try again.')
                return
            }         
        };

        return (
            <div className='loginPage'>
                <div className="container">
                    <div className="headerDiv">
                        <h2>Sign Up</h2>
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
                                    <label htmlFor="username">Username:</label>
                                    <div className="input flex">
                                        <FaUserShield className='icon' />
                                        <input
                                            type="text"
                                            id="username"
                                            placeholder="Username"
                                            value={username}
                                            required
                                            onChange={(e) => setUsername(e.target.value)}
                                        />
                                    </div>
                                </div>

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
                                    type={passwordVisible ? "text" : "password"}
                                    id="password"
                                    ref={passwordRef}
                                    placeholder="Password"
                                    value={password}
                                    required
                                    onChange={(e) => setPassword(e.target.value)}
                                />

                                <div onClick ={() => setPasswordVisible(!passwordVisible)}>
                                    {passwordVisible? <MdVisibility id="password-visible"/> : <AiFillEyeInvisible id="password-visible" />} 
                                </div>

                            <p id="message" ref={passwordMessageRef}>Password is <span id="strength" ref={passwordStrengthRef}></span></p>
                            </div>
                        </div>

                        <div className="inputDiv">
                            <label htmlFor="confirmPassword">Confirm Password:</label>
                            <div className="input flex">
                                <BsFillShieldLockFill className='icon' />
                                <input
                                    type={confirmPasswordVisible? "text" : "password"}
                                    id="confirmPassword"
                                    placeholder="Confirm password"
                                    ref={confirmPasswordRef}
                                    value={confirmPassword}
                                    required
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                                <div onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
                                    {confirmPasswordVisible?  <MdVisibility id="password-visible"/> : <AiFillEyeInvisible id="password-visible"/>}
                                </div>

                                <p id="message" ref={confirmPasswordMessageRef}>Password is <span id="strength" ref={confirmPasswordStrengthRef}></span></p>
                            </div>
                        </div>

                        {registerStatus && <span className="status">{registerStatus}</span>}

                        <button type="submit" className='btn'>
                            <span>Register</span>
                        </button>

                        <div className="footerDiv">
                            <span>Already have an account?</span>
                            <Link to='/login'> Login</Link>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    export default Register;
