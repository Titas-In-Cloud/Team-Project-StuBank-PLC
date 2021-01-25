import React, {useContext, useEffect, useState} from "react";
import {Button} from "@material-ui/core";
import ErrorNotice from "../../misc/ErrorNotice"
import Axios from "axios";
import CreatableSelect from 'react-select/creatable';
import { MainNavigationBar } from "../../";

export default function Account () {
    let user = JSON.parse(sessionStorage.getItem("userData"))
    const [amount, setAmount] = useState();
    const [errorTransfer, setErrorTransfer] = useState();
    const [showTransfer, setShowTransfer] = useState(false)
    const [balance, setBalance] = useState(user.accountBalance)
    const [recipient, setRecipient] = useState({label: '', value: ''})

    async function updateData() {
        try {
            const newData = await Axios.post("http://localhost:5000/users/updateData", {PID: user.personalID})
            user = newData.data
            setBalance(user.accountBalance.data)
            setShowTransfer(false)
            setRecipient({label: '', value: ''})
            setAmount('')
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

                </div>
            </section>
        </div>
    )
}