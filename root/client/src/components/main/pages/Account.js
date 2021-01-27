import React, {useEffect, useState} from "react";
import {Button, MenuItem, Select} from "@material-ui/core";
import ErrorNotice from "../../misc/ErrorNotice"
import Axios from "axios";
import CreatableSelect from 'react-select/creatable';
import { MainNavigationBar } from "../../";

export default function Account () {
    let user = JSON.parse(sessionStorage.getItem("userData"))
    const [amountTransfer, setAmountTransfer] = useState();
    const [amountConvert, setAmountConvert] = useState();
    const [errorTransfer, setErrorTransfer] = useState();
    const [showTransfer, setShowTransfer] = useState(false);
    const [errorConvert, setErrorConvert] = useState();
    const [showConvert, setShowConvert] = useState(false);
    const [balanceGBP, setBalanceGBP] = useState(user.accountBalanceGBP.data);
    const [balanceUSD, setBalanceUSD] = useState(user.accountBalanceUSD.data);
    const [balanceEUR, setBalanceEUR] = useState(user.accountBalanceEUR.data);
    const [recipient, setRecipient] = useState({label: '', value: ''});
    const [currency, setCurrency] = useState('£')
    const [currencyTo, setCurrencyTo] = useState('£')
    const [currencyFrom, setCurrencyFrom] = useState('£')

    async function updateData() {
        try {
            const newData = await Axios.post("http://localhost:5000/users/updateData", {PID: user.personalID})
            user = newData.data
            setBalanceGBP(user.accountBalanceGBP.data)
            setBalanceUSD(user.accountBalanceUSD.data)
            setBalanceEUR(user.accountBalanceEUR.data)
            setShowTransfer(false)
            setRecipient({label: '', value: ''})
            setAmountTransfer('')
            setAmountConvert('')
            setCurrency('£')
            setCurrencyTo('£')
            setCurrencyFrom('£')
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
    const currencyChange = (input) => {
        setCurrency(input.target.value)
    }
    const currencyFromChange = (input) => {
        setCurrencyFrom(input.target.value)
    }
    const currencyToChange = (input) => {
        setCurrencyTo(input.target.value)
    }

    async function submitTransfer(e) {
        e.preventDefault();
        try {
            const data = {payerID: user.personalID, payeeID: recipient, amountTransfer, currency}
            await Axios.post("http://localhost:5000/users/transfer", data)
            await updateData()
        } catch (err) {
            console.log(err)
            err.response.data.msg && setErrorTransfer(err.response.data.msg)
        }
    }

    async function submitConvert(e) {
        e.preventDefault();
        try {
            const data = {personalID: user.personalID, amount: amountConvert, to: currencyTo, from: currencyFrom}
            console.log(data)
            await Axios.post("http://localhost:5000/users/convert", data)
            await updateData()
        } catch (err) {
            console.log(err)
            err.response.data.msg && setErrorConvert(err.response.data.msg)
        }
    }
    return (
        <div className="main-background">
            <MainNavigationBar/>
            <section className="main-background">
                <div className="centered-text-default">
                    <h1>Account</h1>
                    <h3>Welcome, {user.firstName.data} {user.lastName.data}</h3>
                    <div>Your GBP balance is £{Number(balanceGBP).toFixed(2)}</div>
                    <div>Your USD balance is ${Number(balanceUSD).toFixed(2)}</div>
                    <div>Your EUR balance is €{Number(balanceEUR).toFixed(2)}</div>
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
                            <Select
                                defaultValue={'£'}
                                onChange={currencyChange}
                            >
                                <MenuItem value={'£'}>GBP</MenuItem>
                                <MenuItem value={'$'}>USD</MenuItem>
                                <MenuItem value={'€'}>EUR</MenuItem>
                            </Select>
                            <input
                                type="text"
                                name="Amount"
                                onChange={(e) => setAmountTransfer(e.target.value)}
                            />
                            <input type="submit" value="Submit"/>
                        </form>)}
                    <div>
                        <Button variant={"contained"} disableElevation={true} onClick={() => {
                            setShowConvert(!showConvert)
                        }}>Convert</Button>
                    </div>
                    {showConvert && (
                        <form className="Form2" onSubmit={submitConvert}>
                            {errorConvert && (<ErrorNotice message={errorConvert} clearError={() => setErrorConvert(undefined)}/>)}
                            <label>Currency From: </label>
                            <Select
                                defaultValue={'£'}
                                onChange={currencyFromChange}
                            >
                                <MenuItem value={'£'}>GBP</MenuItem>
                                <MenuItem value={'$'}>USD</MenuItem>
                                <MenuItem value={'€'}>EUR</MenuItem>
                            </Select>
                            <label>Currency To: </label>
                            <Select
                                defaultValue={'£'}
                                onChange={currencyToChange}
                            >
                                <MenuItem value={'£'}>GBP</MenuItem>
                                <MenuItem value={'$'}>USD</MenuItem>
                                <MenuItem value={'€'}>EUR</MenuItem>
                            </Select>
                            <label>Amount: </label>
                            <input
                                type="text"
                                name="Amount"
                                onChange={(e) => setAmountConvert(e.target.value)}
                            />
                            <input type="submit" value="Submit"/>
                        </form>
                    )

                    }
                </div>
            </section>
        </div>
    )
}