import React, {useEffect, useState} from "react";
import { AdminNavigationBar } from "../../";
import Axios from "axios";
import ErrorNotice from "../../misc/ErrorNotice";
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@material-ui/core";
import {useHistory} from "react-router-dom";

/**
 *
 * @returns {JSX.Element}
 * @constructor
 */
export default function Users () {
    const userData = JSON.parse(sessionStorage.getItem("userData"))
    const history = useHistory();
    if (userData == null || userData.role !== "admin") {
        sessionStorage.clear()
        history.push('/home')
        history.go(0)
    }
    const [userDataToAmend, setUserDataToAmend] = useState(userData)
    const [allUsers, setAllUsers] = useState([])
    const [personalID, setPersonalID] = useState(userDataToAmend.personalID);
    const [showAmend, setShowAmend] = useState(false);
    const [error, setError] = useState();
    const [email, setEmail] = useState(userDataToAmend.email.data);
    const [firstName, setFirstName] = useState(userDataToAmend.firstName.data);
    const [lastName, setLastName] = useState(userDataToAmend.lastName.data);
    const [phoneNum, setPhoneNum] = useState(userDataToAmend.phoneNum.data);
    const [accountBalanceGBP, setBalanceGBP] = useState(userDataToAmend.accountBalanceGBP.data);
    const [accountBalanceUSD, setBalanceUSD] = useState(userDataToAmend.accountBalanceUSD.data);
    const [accountBalanceEUR, setBalanceEUR] = useState(userDataToAmend.accountBalanceEUR.data);

    /**
     *
     * @returns {Promise<void>}
     */
    async function updateData() {
        try {
            const newUsers = await Axios.post("http://localhost:5000/users/getAll")
            setAllUsers(newUsers.data)
            const newData = await Axios.post("http://localhost:5000/users/updateData", {PID: personalID})
            await setUserDataToAmend(newData.data)
            setEmail(userDataToAmend.email.data)
            setFirstName(userDataToAmend.firstName.data)
            setLastName(userDataToAmend.lastName.data)
            setPhoneNum(userDataToAmend.phoneNum.data)
            setBalanceGBP(userDataToAmend.accountBalanceGBP.data)
            setBalanceUSD(userDataToAmend.accountBalanceUSD.data)
            setBalanceEUR(userDataToAmend.accountBalanceEUR.data)
        } catch (err) {
            err.response.data.msg && setError(err.response.data.msg)
        }
    }

    /**
     *
     * @returns {Promise<void>}
     */
    async function getUserData() {
        try {
            const newData = await Axios.post("http://localhost:5000/users/updateData", {PID: personalID})
            await setEmail(newData.data.email.data)
            await setFirstName(newData.data.firstName.data)
            await setLastName(newData.data.lastName.data)
            await setPhoneNum(newData.data.phoneNum.data)
            await setBalanceGBP(newData.data.accountBalanceGBP.data)
            await setBalanceUSD(newData.data.accountBalanceUSD.data)
            await setBalanceEUR(newData.data.accountBalanceEUR.data)
            setShowAmend(false)
            setShowAmend(true)
        } catch (err) {
            err.response.data.msg && setError(err.response.data.msg)
        }
    }

    /**
     *
     * @returns {Promise<boolean>}
     */
    async function checkLoggedIn() {
        try {
            const token = JSON.parse(sessionStorage.getItem("auth-token"))
            if (token == null){
                return false
            }
            const request = Axios.create({
                headers: {
                    "x-auth-token": token
                }
            });
            const logged = await request.post("http://localhost:5000/users/tokenIsValid")
            if (logged.data === false){
                return false
            }
            return true
        } catch (err) {
        }
    }

    const logged = checkLoggedIn()
    if (logged === false){
        sessionStorage.clear()
        history.push('/home')
        history.go(0)
    }

    //checks user is logged in and updates data when the page updates
    useEffect(() => {
        const logged = checkLoggedIn()
        if (logged === false){
            sessionStorage.clear()
            history.push('/home')
            history.go(0)
        }
        updateData();
    }, []);

    /**
     *
     * @param e
     * @returns {Promise<void>}
     */
    async function submitAmend(e){
        e.preventDefault()
        try {
            console.log(email)
            const data = {email, phoneNum, firstName, lastName, personalID, accountBalanceGBP, accountBalanceUSD,
                accountBalanceEUR}
            console.log(data)
            await Axios.post("http://localhost:5000/users/amendDetails", data)
            await updateData()
            setShowAmend(false)
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
                                                <TableCell style={{width: 200}} className="font-headings">First Name</TableCell>
                                                <TableCell style={{width: 200}} className="font-headings">Last Name</TableCell>
                                                <TableCell className="font-headings">GBP (£)</TableCell>
                                                <TableCell className="font-headings">USD ($)</TableCell>
                                                <TableCell className="font-headings">EUR (€)</TableCell>
                                                <TableCell style={{width: 80}} className="font-headings">Role</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {allUsers.map((user) => (
                                                <TableRow key={user.personalID}>
                                                    <TableCell component="th" scope="row" className="font-information">
                                                        {user.personalID}
                                                    </TableCell>
                                                    <TableCell className="font-information">{user.firstName.data}</TableCell>
                                                    <TableCell className="font-information">{user.lastName.data}</TableCell>
                                                    <TableCell className="font-information" style={{textAlign: "center"}}>
                                                        {user.accountBalanceGBP.data}</TableCell>
                                                    <TableCell className="font-information" style={{textAlign: "center"}}>
                                                        {user.accountBalanceUSD.data}</TableCell>
                                                    <TableCell className="font-information" style={{textAlign: "center"}}>
                                                        {user.accountBalanceEUR.data}</TableCell>
                                                    <TableCell className="font-information">{user.role}</TableCell>
                                                </TableRow>
                                            ))}
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
                                        defaultValue={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                    />
                                </div>

                                <label htmlFor="register-last-name">Last Name</label>
                                <div style={{paddingBottom: 10, paddingTop: 3}}>
                                    <input
                                        className="input-settings"
                                        id="register-last-name"
                                        type="text"
                                        defaultValue={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                    />
                                </div>

                                <label htmlFor="register-phone-num">Telephone Number</label>
                                <div style={{paddingBottom: 10, paddingTop: 3}}>
                                    <input
                                        className="input-settings"
                                        id="register-phone-num"
                                        type="text"
                                        defaultValue={phoneNum}
                                        onChange={(e) => setPhoneNum(e.target.value)}
                                    />
                                </div>

                                <label htmlFor="register-email">Email Address</label>
                                <div style={{paddingBottom: 10, paddingTop: 3}}>
                                    <input
                                        className="input-settings"
                                        id="register-email"
                                        type="text"
                                        defaultValue={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>

                                <label htmlFor="gbp-balance">GBP Balance</label>
                                <div style={{paddingBottom: 10, paddingTop: 3}}>
                                    <input
                                        className="input-settings"
                                        id="gbp-balance"
                                        type="text"
                                        defaultValue={accountBalanceGBP}
                                        onChange={(e) => setBalanceGBP(e.target.value)}
                                    />
                                </div>

                                <label htmlFor="usd-balance">USD Balance</label>
                                <div style={{paddingBottom: 10, paddingTop: 3}}>
                                    <input
                                        className="input-settings"
                                        id="usd-balance"
                                        type="text"
                                        defaultValue={accountBalanceUSD}
                                        onChange={(e) => setBalanceUSD(e.target.value)}
                                    />
                                </div>

                                <label htmlFor="eur-balance">EUR Balance</label>
                                <div style={{paddingBottom: 10, paddingTop: 3}}>
                                    <input
                                        className="input-settings"
                                        id="eur-balance"
                                        type="text"
                                        defaultValue={accountBalanceEUR}
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