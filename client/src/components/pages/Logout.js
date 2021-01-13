import React, {useContext, useState} from 'react';
import UserContext from "../../context/UserContext";

export default function Logout() {
    const {userData, setUserData} = useContext(UserContext);
    // This removes the authentication token from the user data and also the local storage when the user logs out
    const logout = () => {
        setUserData({
            token: undefined,
            user: undefined
        })
        localStorage.setItem("auth-token", "")
        sessionStorage.clear()
    }

    return (
        <div><h2>Are you sure you wish to logout</h2>
            <button onClick={logout}>Please click this to confirm you would like to logout</button>
        </div>
    );
}