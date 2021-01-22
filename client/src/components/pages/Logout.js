import React, {useContext, useState} from 'react';
import UserContext from "../../context/UserContext";
import {Button} from "@material-ui/core";

export default function Logout() {
    const {userData, setUserData} = useContext(UserContext);
    // This removes the authentication token from the user data and also the local storage when the user logs out
    const logout = () => {
        setUserData({
            token: undefined,
            user: undefined
        })
        sessionStorage.clear()
    }

    return (
        <div><h2>Are you sure you wish to logout</h2>
            <Button variant={"contained"} disableElevation={true} onClick={logout}>Please click this to confirm you would like to logout</Button>
        </div>
    );
}