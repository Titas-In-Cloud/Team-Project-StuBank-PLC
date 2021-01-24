import React, {useContext, useEffect, useState} from "react";
import {Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@material-ui/core";
import ErrorNotice from "../../misc/ErrorNotice"
import Axios from "axios";
import CreatableSelect from 'react-select/creatable';
import { MainNavigationBar } from "../../";

export default function Account () {
    let user = JSON.parse(sessionStorage.getItem("userData"))
    const [amount, setAmount] = useState();
    const [error, setError] = useState();
    const [showTransfer, setShowTransfer] = useState(false)
    const [showStatement, setShowStatement] = useState(false)
    const [balance, setBalance] = useState(user.accountBalance)
    const [recipient, setRecipient] = useState({label: '', value: ''})

    async function updateData() {
        try {
            const newData = await Axios.post("http://localhost:5000/users/updateData", {PID: user.personalID})
            user.accountBalance = newData.data.accountBalance
            user.recipients = newData.data.recipients
            user.transactions = newData.data.transactions
            setBalance(user.accountBalance)
            setShowTransfer(false)
            setShowStatement(false)
            setRecipient({label: '', value: ''})
            setAmount('')
            sessionStorage.setItem("userData", JSON.stringify(user))
        } catch (err) {
            console.log(err)
            err.response.data.msg && setError(err.response.data.msg)
        }
    }

    useEffect(() => {
        updateData();
    }, []);

    async function submit(e) {
        e.preventDefault();
        try {
            const data = {payerID: user.personalID, payeeID: recipient, amount}
            await Axios.post("http://localhost:5000/users/transfer", data)
            await updateData()
        } catch (err) {
            err.response.data.msg && setError(err.response.data.msg)
        }
    }

    const recipientChange = (input) => {
        setRecipient(input)
    }

    async function submit(e) {
        e.preventDefault();
        try {
            const data = {payerID: user.personalID, payeeID: recipient, amount}
            await Axios.post("http://localhost:5000/users/transfer", data)
            await updateData()
        } catch (err) {
            err.response.data.msg && setError(err.response.data.msg)
        }
    }


    return (
        <div className="main-background">
            <MainNavigationBar/>
            <section className="main-background">
                <div className="centered-text-default">
                    <h1>Account</h1>
                    <h3>Welcome, {user.firstName.data} {user.lastName.data}</h3>
                    Your balance is £{Number(balance).toFixed(2)}
                    <div>
                        <Button variant={"contained"} disableElevation={true} onClick={() => {
                            setShowTransfer(!showTransfer)
                        }}>Transfer</Button>
                    </div>
                    {showTransfer && (
                        <form className="Form1" onSubmit={submit}>
                            {error && (<ErrorNotice message={error} clearError={() => setError(undefined)}/>)}
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
                            setShowStatement(!showStatement)
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
                </div>
            </section>
        </div>
    )
}