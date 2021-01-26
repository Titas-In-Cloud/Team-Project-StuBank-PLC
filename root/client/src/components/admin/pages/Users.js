import React, {useContext, useEffect, useState} from "react";
import { AdminNavigationBar } from "../../";
import Axios from "axios";
import UserContext from "../../../context/UserContext";
import {Button} from "@material-ui/core";
import ErrorNotice from "../../misc/ErrorNotice";

export default function Users () {
    const {userData, setUserData} = useContext(UserContext);
    let userDataToAmend = "";
    //Sets user data to the logged in admin user if it is null to null pointer errors
    if (!userDataToAmend) {
        userDataToAmend = JSON.parse(sessionStorage.getItem("userData"));
    }
    const [personalID, setPersonalID] = useState(undefined);
    const [showAmend, setShowAmend] = useState(false);
    const [errorAmend, setErrorAmend] = useState();
        const [email, setEmail] = useState(userDataToAmend.email.data);
        const [firstName, setFirstName] = useState(userDataToAmend.firstName.data);
        const [lastName, setLastName] = useState(userDataToAmend.lastName.data);
        const [passwordOld, setPasswordOld] = useState(undefined);
        const [passwordNew, setPasswordNew] = useState(undefined);
        const [passwordCheck, setPasswordCheck] = useState(undefined);
        const [phoneNum, setPhoneNum] = useState(userDataToAmend.phoneNum.data);
    async function updateData() {
        try {
            const newData = await Axios.post("http://localhost:5000/users/updateData", {PID: personalID})
            userDataToAmend = newData.data
            setShowAmend(false)
            setEmail(userDataToAmend.email.data)
            setFirstName(userDataToAmend.firstName.data)
            setLastName(userDataToAmend.lastName.data)
            setPasswordOld(undefined)
            setPasswordNew(undefined)
            setPasswordCheck(undefined)
            setPhoneNum(userDataToAmend.phoneNum.data)
            sessionStorage.setItem("userData", JSON.stringify(userDataToAmend))
        } catch (err) {
            err.response.data.msg && setErrorAmend(err.response.data.msg)
        }
    }

    async function getUserData() {
        try {
            const userData = await Axios.post("http://localhost:5000/users/updateData", {PID: personalID})
            userDataToAmend = userData.data
            sessionStorage.setItem("userData", JSON.stringify(userDataToAmend))
            setShowAmend(!showAmend)
        } catch (err) {
            err.response.data.msg && setErrorAmend(err.response.data.msg)
        }
    }

    useEffect(() => {
        updateData();
    }, []);

    function assignUser(){
    }

    async function submitAmend(e){
        e.preventDefault()
        try {
            const data = {email, passwordOld, passwordNew, passwordCheck, phoneNum, firstName, lastName, personalID}
            await Axios.post("http://localhost:5000/users/amendDetails", data)
            await updateData()
        } catch (err) {
            err.response.data.msg && setErrorAmend(err.response.data.msg)
        }
    }



    return (
        <div className="top-bar">
            <AdminNavigationBar />
            <div className="main-background">
                <div className="big-bank-box">
                    <h1>Users</h1>
                    <label htmlFor="personal-id">Personal ID</label>
                    <input
                        id="personal-id"
                        type="text"
                        placeholder="e.g 12345678912"
                        onChange={(e) => setPersonalID(e.target.value)}
                    />
                    <Button variant={"contained"} disableElevation={true} onClick={getUserData} >Amend Details</Button>
                {showAmend &&
                <form className="form" onSubmit={submitAmend}>
                    {errorAmend && (<ErrorNotice message={errorAmend} clearError={() => setErrorAmend(undefined)}/>)}
                    <label htmlFor="register-email">Email</label>
                    <input
                        id="register-email"
                        type="email"
                        defaultValue={userDataToAmend.email.data}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <label htmlFor="register-first-na   me">First name</label>
                    <input
                        id="register-first-name"
                        type="text"
                        defaultValue={userDataToAmend.firstName.data}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                    <label htmlFor="register-last-name">Last name</label>
                    <input
                        id="register-last-name"
                        type="text"
                        defaultValue={userDataToAmend.lastName.data}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                    <label htmlFor="register-phone-num">Phone Num</label>
                    <input
                        id="register-phone-num"
                        type="text"
                        defaultValue={userDataToAmend.phoneNum.data}
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
                </div>
                </div>
        </div>
    )
}