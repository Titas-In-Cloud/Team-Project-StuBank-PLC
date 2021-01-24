import React, {useContext} from "react";
import { MainNavigationBar } from "../../";
import {Button} from "@material-ui/core";
import Axios from "axios";
import {useHistory} from "react-router-dom";
import UserContext from "../../../context/UserContext";

export default function Settings () {
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
    //This deletes the user account
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
                history.push('/')
            )
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className="main-background">
            <MainNavigationBar />
            <section className="main-background">
                <div className="centered-text-default">
                    <h1>Settings</h1>
                    <Button variant={"contained"} disableElevation={true} onClick={handleDeleteAccount}>
                        Click here to delete account</Button>
                </div>
            </section>
        </div>
    )
}