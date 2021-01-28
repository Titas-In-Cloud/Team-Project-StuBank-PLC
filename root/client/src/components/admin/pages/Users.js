import React, {useContext, useEffect, useState} from "react";
import { AdminNavigationBar } from "../../";
import Axios from "axios";
import UserContext from "../../../context/UserContext";
import {Button} from "@material-ui/core";
import ErrorNotice from "../../misc/ErrorNotice";
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@material-ui/core";

export default function Users () {
    let userDataToAmend = "";

    //Sets user data to the logged in admin user if it is null to prevent null pointer errors
    if (!userDataToAmend) {
        userDataToAmend = JSON.parse(sessionStorage.getItem("userData"));
    }

    const {userData, setUserData} = useContext(UserContext);
    const [personalID, setPersonalID] = useState(undefined);
    const [showAmend, setShowAmend] = useState(false);
    const [error, setError] = useState();
    const [email, setEmail] = useState(userDataToAmend.email.data);
    const [firstName, setFirstName] = useState(userDataToAmend.firstName.data);
    const [lastName, setLastName] = useState(userDataToAmend.lastName.data);
    const [phoneNum, setPhoneNum] = useState(userDataToAmend.phoneNum.data);
    const [accountBalanceGBP, setBalanceGBP] = useState(userDataToAmend.accountBalanceGBP.data);
    const [accountBalanceUSD, setBalanceUSD] = useState(userDataToAmend.accountBalanceUSD.data);
    const [accountBalanceEUR, setBalanceEUR] = useState(userDataToAmend.accountBalanceEUR.data);

    async function getAllData() {
        try{
            let allUsers = await Users.find({}).exec();
        } catch (err) {
            err.response.data.msg && setError(err.response.data.msg)
        }
    }

    async function updateData() {
        try {
            const newData = await Axios.post("http://localhost:5000/users/updateData", {PID: personalID})
            userDataToAmend = newData.data
            setShowAmend(false)
            setEmail(userDataToAmend.email.data)
            setFirstName(userDataToAmend.firstName.data)
            setLastName(userDataToAmend.lastName.data)
            setPhoneNum(userDataToAmend.phoneNum.data)
            setBalanceGBP(userDataToAmend.accountBalanceGBP.data)
            setBalanceUSD(userDataToAmend.accountBalanceUSD.data)
            setBalanceEUR(userDataToAmend.accountBalanceEUR.data)
            sessionStorage.setItem("userData", JSON.stringify(userDataToAmend))
        } catch (err) {
            err.response.data.msg && setError(err.response.data.msg)
        }
    }

    async function getUserData() {
        try {
            const userData = await Axios.post("http://localhost:5000/users/updateData", {PID: personalID})
            userDataToAmend = userData.data
            sessionStorage.setItem("userData", JSON.stringify(userDataToAmend))
            setShowAmend(!showAmend)
        } catch (err) {
            err.response.data.msg && setError(err.response.data.msg)
        }
    }

    useEffect(() => {
        updateData();
    }, []);

    async function submitAmend(e){
        e.preventDefault()
        try {
            const data = {email, phoneNum, firstName, lastName, personalID, accountBalanceGBP, accountBalanceUSD,
                accountBalanceEUR}
            await Axios.post("http://localhost:5000/users/amendDetails", data)
            await updateData()
        } catch (err) {
            err.response.data.msg && setError(err.response.data.msg)
        }
    }

    return (
        <div className="top-bar">
            <AdminNavigationBar />
            <div className="main-background">
                <div className="big-bank-box">
                    <div className="flex-container">
                        <div style={{paddingRight: 50}}>
                            <h1>Details of All Users</h1>
                            <div className="table">
                                <TableContainer component={Paper}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell style={{width: 150}} className="font-headings">Personal ID</TableCell>
                                                <TableCell style={{width: 150}} className="font-headings">First Name</TableCell>
                                                <TableCell style={{width: 150}} className="font-headings">Last Name</TableCell>
                                                <TableCell className="font-headings">Role</TableCell>
                                                <TableCell className="font-headings">GBP Balance</TableCell>
                                                <TableCell className="font-headings">USD Balance </TableCell>
                                                <TableCell className="font-headings">EUR Balance</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>

                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </div>
                        </div>
                        <div>
                            <h1>Amend User Details</h1>
                            <div className="form-account" style={{paddingTop: 15}}>
                                <label htmlFor="personal-id">Personal ID</label>
                                <div style={{paddingBottom: 10, paddingTop: 3}}>
                                    <input
                                        className="input-settings"
                                        id="personal-id"
                                        type="text"
                                        placeholder="e.g 12345678912"
                                        onChange={(e) => setPersonalID(e.target.value)}
                                    />
                                </div>
                                <div style={{paddingTop: 5, paddingLeft: 10}}>
                                    <btn className="button-account" style={{width: 110, fontSize: 12}}
                                         disableElevation={true} onClick={getUserData} >Amend Details</btn>
                                </div>
                            </div>
                            {showAmend &&
                            <form className="form-account" onSubmit={submitAmend}>
                                <div style={{fontSize: 14, color: "#FF5454", paddingLeft: 10, paddingBottom: 10, paddingTop: 10}}>
                                    {error && (
                                        <ErrorNotice message={error} clearError={() => setError(undefined)} />
                                    )}
                                </div>

                                <label htmlFor="register-first-name">First Name</label>
                                <div style={{paddingBottom: 10, paddingTop: 3}}>
                                    <input
                                        className="input-settings"
                                        id="register-first-name"
                                        type="text"
                                        defaultValue={userDataToAmend.firstName.data}
                                        onChange={(e) => setFirstName(e.target.value)}
                                    />
                                </div>

                                <label htmlFor="register-last-name">Last Name</label>
                                <div style={{paddingBottom: 10, paddingTop: 3}}>
                                    <input
                                        className="input-settings"
                                        id="register-last-name"
                                        type="text"
                                        defaultValue={userDataToAmend.lastName.data}
                                        onChange={(e) => setLastName(e.target.value)}
                                    />
                                </div>

                                <label htmlFor="register-phone-num">Telephone Number</label>
                                <div style={{paddingBottom: 10, paddingTop: 3}}>
                                    <input
                                        className="input-settings"
                                        id="register-phone-num"
                                        type="tel"
                                        defaultValue={userDataToAmend.phoneNum.data}
                                        onChange={(e) => setPhoneNum(e.target.value)}
                                    />
                                </div>

                                <label htmlFor="register-email">Email Address</label>
                                <div style={{paddingBottom: 10, paddingTop: 3}}>
                                    <input
                                        className="input-settings"
                                        id="register-email"
                                        type="email"
                                        defaultValue={userDataToAmend.email.data}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>

                                <label htmlFor="gbp-balance">GBP Balance</label>
                                <div style={{paddingBottom: 10, paddingTop: 3}}>
                                    <input
                                        className="input-settings"
                                        id="gbp-balance"
                                        type="text"
                                        defaultValue={userDataToAmend.accountBalanceGBP.data}
                                        onChange={(e) => setBalanceGBP(e.target.value)}
                                    />
                                </div>

                                <label htmlFor="usd-balance">USD Balance</label>
                                <div style={{paddingBottom: 10, paddingTop: 3}}>
                                    <input
                                        className="input-settings"
                                        id="usd-balance"
                                        type="text"
                                        defaultValue={userDataToAmend.accountBalanceUSD.data}
                                        onChange={(e) => setBalanceUSD(e.target.value)}
                                    />
                                </div>

                                <label htmlFor="eur-balance">EUR Balance</label>
                                <div style={{paddingBottom: 10, paddingTop: 3}}>
                                    <input
                                        className="input-settings"
                                        id="eur-balance"
                                        type="text"
                                        defaultValue={userDataToAmend.accountBalanceEUR.data}
                                        onChange={(e) => setBalanceEUR(e.target.value)}
                                    />
                                </div>

                                <div style={{paddingTop: 5, paddingLeft: 10}}>
                                    <input className="button-account" style={{width: 110, fontSize: 12}}
                                           type="submit" value="Amend"/>
                                </div>
                            </form>}
                        </div>
                    </div>
                </div>
                </div>
        </div>
    )
}