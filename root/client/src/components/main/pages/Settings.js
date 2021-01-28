import React, {useContext, useEffect, useState} from "react";
import { MainNavigationBar } from "../../";
import Axios from "axios";
import {useHistory} from "react-router-dom";
import UserContext from "../../../context/UserContext";
import ErrorNotice from "../../misc/ErrorNotice";

export default function Settings () {
    const history = useHistory();
    const {setUserData} = useContext(UserContext);
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
        sessionStorage.clear()
    }
    //This deletes the user account
    async function handleDeleteAccount() {
        try {
                //Gets auth token from local storage and saves to a variable
                const token = sessionStorage.getItem('auth-token');
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
            err.response.data.msg && setErrorAmend(err.response.data.msg)
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
        <div className="top-bar">
            <MainNavigationBar />
            <div className="main-background">
                <div className="small-bank-box">
                    <h1>Settings</h1>
                    <div>
                        <p style={{fontSize: 18, color: "black", paddingLeft: 20, paddingTop: 25, paddingBottom: 15}}>
                            Your Account Details:</p>
                        <div className="form-account" onSubmit={submitAmend}>
                            <label>User ID: {user.personalID}</label>
                        </div>
                        <div className="form-account" onSubmit={submitAmend}>
                            <label>First Name: {user.firstName.data}</label>
                        </div>
                        <div className="form-account" onSubmit={submitAmend}>
                            <label>Last Name: {user.lastName.data}</label>
                        </div>
                        <div className="form-account" onSubmit={submitAmend}>
                            <label>Telephone Number: {user.phoneNum.data}</label>
                        </div>
                        <div className="form-account" onSubmit={submitAmend}>
                            <label>Email: {user.email.data}</label>
                        </div>
                    </div>
                    <div className="inputBox" style={{paddingLeft: 20, paddingTop: 30, paddingBottom: 20}}>
                        <button className="button-account" style={{width: 180, fontSize: 16}} onClick={() => {
                            setShowAmend(!showAmend)
                        }}>Amend Details</button>
                    </div>
                    {showAmend &&
                    <form className="form-account" onSubmit={submitAmend}>
                        <div style={{fontSize: 14, color: "#FF5454", paddingLeft: 10, paddingBottom: 5}}>
                            {errorAmend && (<ErrorNotice message={errorAmend}
                                                            clearError={() => setErrorAmend(undefined)}/>)}
                        </div>
                        <div style={{paddingTop: 10}}>
                            <input
                                className="input-settings"
                                id="register-first-name"
                                type="text"
                                placeholder="First Name"
                                defaultValue={user.firstName.data}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </div>
                        <div style={{paddingTop: 10}}>
                            <input
                                className="input-settings"
                                id="register-last-name"
                                type="text"
                                placeholder="Last Name"
                                defaultValue={user.lastName.data}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </div>
                        <div style={{paddingTop: 10}}>
                            <input
                                className="input-settings"
                                id="register-phone-num"
                                type="tel"
                                placeholder="Telephone Number"
                                defaultValue={user.phoneNum.data}
                                onChange={(e) => setPhoneNum(e.target.value)}
                            />
                        </div>
                        <div style={{paddingTop: 10}}>
                            <input
                                className="input-settings"
                                id="register-email"
                                type="email"
                                placeholder="Email Address"
                                defaultValue={user.email.data}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div style={{paddingTop: 10}}>
                            <input
                                className="input-settings"
                                id="passwordNew"
                                type="password"
                                placeholder="New Password"
                                onChange={(e) => setPasswordNew(e.target.value)}
                            />
                        </div>
                        <div style={{paddingTop: 10}}>
                            <input
                                className="input-settings"
                                type="password"
                                placeholder="Verify Your New Password"
                                onChange={(e) => setPasswordCheck(e.target.value)}
                            />
                        </div>
                        <div style={{paddingTop: 10}}>
                            <input
                                className="input-settings"
                                id="passwordOld"
                                type="password"
                                placeholder="Current Password"
                                onChange={(e) => setPasswordOld(e.target.value)}
                            />
                        </div>
                        <div style={{paddingTop: 10}}>
                            <input className="button-account" style={{width: 110, fontSize: 12}}
                                   type="submit" value="Amend"/>
                        </div>
                    </form>}
                    <div className="inputBox" style={{paddingLeft: 20, paddingTop: 20, paddingBottom: 20}}>
                        <button className="button-account" style={{width: 180, fontSize: 16}} onClick={() =>
                        { if (window.confirm('Are you sure you wish to delete the account?')) handleDeleteAccount() } }>
                            Delete Account</button>
                    </div>
                </div>
            </div>
        </div>
    )
}