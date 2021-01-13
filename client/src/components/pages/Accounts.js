import React, {useContext} from "react";
import Axios from 'axios';
import UserContext from "../../context/UserContext";
import {useHistory} from "react-router-dom";


export default function Accounts() {
    const history = useHistory();
    const {userData, setUserData} = useContext(UserContext);
    // This removes the authentication token from the user data and also the local storage when the user logs out
    const logout = () => {
        setUserData({
            token: undefined,
            user: undefined
        })
        localStorage.setItem("auth-token", "")
    }

    async function handleDeleteAccount() {
        try {
            //Gets auth token from local storage and saves to a variable
            const token = localStorage.getItem('auth-token');
            const request = Axios.create({
                headers: {
                    "x-auth-token": token
                }
            });
            //Logs user out before account is deleted
            logout();
            //Sends request to delete account to server-side using axios
            await request.delete('http://localhost:5000/users/delete').then(r =>
                history.push('/deletedAccountPage')
            )
        }
        catch(err){
            console.log(err);
        }

    }
    return (
        <div><h2>Accounts</h2>
        <button onClick={handleDeleteAccount}>Click here to delete account</button>
        </div>
    );
}