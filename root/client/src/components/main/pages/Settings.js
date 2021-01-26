import React, {useContext, useEffect, useState} from "react";
import { MainNavigationBar } from "../../";
import {Button} from "@material-ui/core";
import Axios from "axios";
import {useHistory} from "react-router-dom";
import UserContext from "../../../context/UserContext";
import ErrorNotice from "../../misc/ErrorNotice";

export default function Settings () {
    const history = useHistory();
    const {userData, setUserData} = useContext(UserContext);
    let user = JSON.parse(sessionStorage.getItem("userData"))
    const [showAmend, setShowAmend] = useState(false)
    const [errorAmend, setErrorAmend] = useState();
    const [email, setEmail] = useState(user.email.data);
    const [firstName, setFirstName] = useState(user.firstName.data);
    const [lastName, setLastName] = useState(user.lastName.data);
    const [passwordOld, setPasswordOld] = useState(undefined);
    const [passwordNew, setPasswordNew] = useState(undefined);
    const [passwordCheck, setPasswordCheck] = useState(undefined);
    const [phoneNum, setPhoneNum] = useState(user.phoneNum.data);
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

    async function updateData() {
        try {
            const newData = await Axios.post("http://localhost:5000/users/updateData", {PID: user.personalID})
            user = newData.data
            setShowAmend(false)
            setEmail(user.email.data)
            setFirstName(user.firstName.data)
            setLastName(user.lastName.data)
            setPasswordOld(undefined)
            setPasswordNew(undefined)
            setPasswordCheck(undefined)
            setPhoneNum(user.phoneNum.data)
            sessionStorage.setItem("userData", JSON.stringify(user))
        } catch (err) {
            err.response.data.msg && setErrorAmend(err.response.data.msg)
        }
    }

    useEffect(() => {
        updateData();
    }, []);

    async function submitAmend(e){
        e.preventDefault()
        try {
            const data = {email, passwordOld, passwordNew, passwordCheck, phoneNum, firstName, lastName, personalID: user.personalID}
            await Axios.post("http://localhost:5000/users/amendDetails", data)
            await updateData()
        } catch (err) {
            err.response.data.msg && setErrorAmend(err.response.data.msg)
        }
    }

    return (
        <div className="main-background">
            <MainNavigationBar />
            <section className="main-background">
                <div className="centered-text-default">
                    <h1>Settings</h1>
                    <div>
                        <Button variant={"contained"} disableElevation={true} onClick={() => {
                            setShowAmend(!showAmend)
                        }}>Amend Details</Button>
                    </div>
                    {showAmend &&
                    <form className="form" onSubmit={submitAmend}>
                        {errorAmend && (<ErrorNotice message={errorAmend} clearError={() => setErrorAmend(undefined)}/>)}
                        <label htmlFor="register-email">Email</label>
                        <input
                            id="register-email"
                            type="email"
                            defaultValue={user.email.data}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <label htmlFor="register-first-name">First name</label>
                        <input
                            id="register-first-name"
                            type="text"
                            defaultValue={user.firstName.data}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                        <label htmlFor="register-last-name">Last name</label>
                        <input
                            id="register-last-name"
                            type="text"
                            defaultValue={user.lastName.data}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                        <label htmlFor="register-phone-num">Phone Num</label>
                        <input
                            id="register-phone-num"
                            type="text"
                            defaultValue={user.phoneNum.data}
                            onChange={(e) => setPhoneNum(e.target.value)}
                        />
                        <label htmlFor="passwordOld">Current Password</label>
                        <input
                            id="passwordOld"
                            type="password"
                            onChange={(e) => setPasswordOld(e.target.value)}
                        />
                        <label htmlFor="passwordNew">New Password</label>
                        <input
                            id="passwordNew"
                            type="password"
                            onChange={(e) => setPasswordNew(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Verify password"
                            onChange={(e) => setPasswordCheck(e.target.value)}
                        />
                        <input type="submit" value="Amend"/>
                    </form>}
                    <Button variant={"contained"} disableElevation={true} onClick={handleDeleteAccount}>
                        Click here to delete account</Button>
                </div>
            </section>
        </div>
    )
}