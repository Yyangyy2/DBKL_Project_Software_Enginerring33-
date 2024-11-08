import axios from 'axios';

// Base URL for the API
const BASE_URL = 'http://localhost:8081';  

export const checkAccountExists = async (username, email, ic, userType) =>{
    try{
        if(userType === "Admin"){
            const response = await axios.post(`${BASE_URL}/check-account-exist`, {username, email, ic, userType});
            return response.data
        }else if(userType === "users"){
            const response = await axios.post(`${BASE_URL}/check-account-exist`, {ic, userType})
            return response.data
        }

    }catch(error){
        throw new Error('Error checking account existence');
    }       
}

export const registerUser = async (username, ic, email, password, userType) =>{
    try{

        if(userType === "Admin"){
            const response = await axios.post(`${BASE_URL}/register`, {username, email, password, userType})
            return response.data

        }else if(userType === "users"){
            const response = await axios.post(`${BASE_URL}/register`, {ic, password, userType});
            return response.data
        }else{
            return false
        }

    }catch(error){  
        throw new Error('Registration Failed')
    }
}
    