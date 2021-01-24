import React, {useContext, useEffect, useState} from "react";
import {Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@material-ui/core";
import ErrorNotice from "../misc/ErrorNotice";
import Axios from "axios";
import CreatableSelect from 'react-select/creatable';
import UserContext from "../../context/UserContext";
import {useHistory} from "react-router-dom";

export default function Accounts() {
    let user = JSON.parse(sessionStorage.getItem("userData"))
    const [amount, setAmount] = useState();
    const [errorTransfer, setErrorTransfer] = useState();
    const [errorAmend, setErrorAmend] = useState();
    const [showTransfer, setShowTransfer] = useState(false)
    const [showStatement, setShowStatement] = useState(false)
    const [showAmend, setShowAmend] = useState(false)
    const [balance, setBalance] = useState(user.accountBalance)
    const [recipient, setRecipient] = useState({label: '', value: ''})
    const [email, setEmail] = useState(user.email.data);
    const [firstName, setFirstName] = useState(user.firstName.data);
    const [lastName, setLastName] = useState(user.lastName.data);
    const [passwordOld, setPasswordOld] = useState(undefined);
    const [passwordNew, setPasswordNew] = useState(undefined);
    const [passwordCheck, setPasswordCheck] = useState(undefined);
    const [phoneNum, setPhoneNum] = useState(user.phoneNum.data);

    async function updateData() {
        try {
            const newData = await Axios.post("http://localhost:5000/users/updateData", {PID: user.personalID})
            user = newData.data
            setBalance(user.accountBalance.data)
            setShowTransfer(false)
            setShowStatement(false)
            setShowAmend(false)
            setRecipient({label: '', value: ''})
            setAmount('')
            setEmail(user.email.data)
            setFirstName(user.firstName.data)
            setLastName(user.lastName.data)
            setPasswordOld(undefined)
            setPasswordNew(undefined)
            setPasswordCheck(undefined)
            setPhoneNum(user.phoneNum.data)
            sessionStorage.setItem("userData", JSON.stringify(user))
        } catch (err) {
            err.response.data.msg && setErrorTransfer(err.response.data.msg)
        }
    }

    useEffect(() => {
        updateData();
    }, []);

    const recipientChange = (input) => {
        setRecipient(input)
    };

    const history = useHistory();
    const {userData, setUserData} = useContext(UserContext);
    // This removes the authentication token from the user data and also the local storage when the user logs out
    const logout = () => {
        setUserData({
            token: undefined,
            user: undefined
        })
        sessionStorage.setItem("auth-token", "")
    }

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
                history.push('/deletedAccountPage')
            )
        } catch (err) {
            err.response.data.msg && setErrorTransfer(err.response.data.msg)
        }
    }

    async function submitTransfer(e) {
        e.preventDefault();
        try {
            const data = {payerID: user.personalID, payeeID: recipient, amount}
            await Axios.post("http://localhost:5000/users/transfer", data)
            await updateData()
        } catch (err) {
            err.response.data.msg && setErrorTransfer(err.response.data.msg)
        }
    }

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
        <>
            <div>
                <h2>Accounts</h2>
                <h3>Welcome, {user.firstName.data} {user.lastName.data}</h3>
                Your balance is £{Number(balance).toFixed(2)}
                <div>
                    <Button variant={"contained"} disableElevation={true} onClick={() => {
                        setShowTransfer(!showTransfer)
                        setShowStatement(false)
                        setShowAmend(false)
                    }}>Transfer</Button>
                </div>
                {showTransfer && (
                    <form className="Form1" onSubmit={submitTransfer}>
                        {errorTransfer && (<ErrorNotice message={errorTransfer} clearError={() => setErrorTransfer(undefined)}/>)}
                        <label>Payee Personal ID: </label>
                        <CreatableSelect
                            options={user.recipients}
                            onChange={recipientChange}
                        />
                        <label>Amount: </label>
                        <input
                            type="text"
                            name="Amount"
                            onChange={(e) => setAmount(e.target.value)}
                        />
                        <input type="submit" value="Submit"/>
                    </form>)}
                <div>
                    <Button variant={"contained"} disableElevation={true} onClick={() => {
                        setShowTransfer(false)
                        setShowStatement(!showStatement)
                        setShowAmend(false)
                    }}>Show Statement</Button>
                </div>
                {showStatement &&
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Date</TableCell>
                                <TableCell>Amount In</TableCell>
                                <TableCell>Amount Out</TableCell>
                                <TableCell>Account</TableCell>
                                <TableCell>Balance</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {user.transactions.map((transaction) => (
                                <TableRow key={transaction.date}>
                                    <TableCell component="th" scope="row">
                                        {transaction.date}
                                    </TableCell>
                                    <TableCell>{transaction.amountIn}</TableCell>
                                    <TableCell>{transaction.amountOut}</TableCell>
                                    <TableCell>{transaction.account}</TableCell>
                                    <TableCell>{transaction.balance}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>}
                <div>
                    <Button variant={"contained"} disableElevation={true} onClick={() => {
                        setShowTransfer(false)
                        setShowStatement(false)
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
            </div>
            <div>
                <br/>
                <Button variant={"contained"} disableElevation={true} onClick={handleDeleteAccount}>
                    Click here to delete account</Button>
            </div>
        </>
    );
}