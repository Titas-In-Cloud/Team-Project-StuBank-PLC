import React, {useEffect, useState} from "react";
import {MenuItem, Select} from "@material-ui/core";
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
    const [currency, setCurrency] = useState('£');
    const [currencyTo, setCurrencyTo] = useState('£');
    const [currencyFrom, setCurrencyFrom] = useState('£');

    async function updateData() {
        try {
            const newData = await Axios.post("http://localhost:5000/users/updateData", {PID: user.personalID})
            user = newData.data
            setBalanceGBP(user.accountBalanceGBP.data)
            setBalanceUSD(user.accountBalanceUSD.data)
            setBalanceEUR(user.accountBalanceEUR.data)
            setShowTransfer(false)
            setShowConvert(false)
            setErrorTransfer(undefined)
            setErrorConvert(undefined)
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
            const data = {payerID: user.personalID, payeeID: recipient, amount: amountTransfer, currency}
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
            await Axios.post("http://localhost:5000/users/convert", data)
            await updateData()
        } catch (err) {
            console.log(err)
            err.response.data.msg && setErrorConvert(err.response.data.msg)
        }
    }

    return (
        <div className="top-bar">
            <MainNavigationBar/>
            <div className="main-background">
                <div className="small-bank-box">
                    <h1>Account Balance</h1>
                    <p style={{color: "black", fontSize: 18, paddingLeft: 30, paddingTop: 15, paddingBottom: 10}}>
                        Your total GBP balance: £{Number(balanceGBP).toFixed(2)}</p>
                    <p style={{color: "black", fontSize: 18, paddingLeft: 30, paddingTop: 5, paddingBottom: 10}}>
                        Your total USD balance: ${Number(balanceUSD).toFixed(2)}</p>
                    <p style={{color: "black", fontSize: 18, paddingLeft: 30, paddingTop: 5, paddingBottom: 10}}>
                        Your total EUR balance: €{Number(balanceEUR).toFixed(2)}</p>
                    <div className="inputBox" style={{paddingLeft: 20, paddingTop: 40, paddingBottom: 20}}>
                        <btn className="button-account" disableElevation={true} onClick={() => {
                            setShowTransfer(!showTransfer)
                        }}>New Transfer</btn>
                    </div>
                    {showTransfer && (
                        <form className="form-account" onSubmit={submitTransfer}>
                            <div style={{fontSize: 14, color: "#FF5454", paddingLeft: 10, paddingBottom: 5}}>
                                {errorTransfer && (<ErrorNotice message={errorTransfer}
                                                                clearError={() => setErrorTransfer(undefined)}/>)}
                            </div>
                            <label>Payee Personal ID: </label>
                            <div style={{paddingTop: 10}}>
                                <div style={{fontSize: 16, paddingBottom: 10}}>
                                    <CreatableSelect
                                        options={user.recipients}
                                        onChange={recipientChange}
                                    />
                                </div>
                                <label>Amount and Currency:</label>
                                <div style={{paddingTop: 5}}>
                                    <input
                                        type="text"
                                        name="Amount"
                                        style={{width: 200, height: 25, fontSize: 16}}
                                        onChange={(e) => setAmountTransfer(e.target.value)}
                                    />
                                    <Select
                                        defaultValue={'£'}
                                        onChange={currencyChange}
                                        style={{fontSize: 14}}
                                    >
                                        <MenuItem style={{fontSize: 14}} value={'£'}>GBP</MenuItem>
                                        <MenuItem style={{fontSize: 14}} value={'$'}>USD</MenuItem>
                                        <MenuItem style={{fontSize: 14}} value={'€'}>EUR</MenuItem>
                                    </Select>
                                    <div style={{paddingTop: 10}}>
                                        <input className="button-account" style={{width: 110, fontSize: 12}} type="submit" value="Submit"/>
                                    </div>
                                </div>
                            </div>

                        </form>)}
                    <div className="inputBox" style={{paddingLeft: 20, paddingTop: 30, paddingBottom: 20}}>
                        <btn className="button-account" disableElevation={true} onClick={() => {
                            setShowConvert(!showConvert)
                        }}>Convert Currencies</btn>
                    </div>
                    {showConvert && (
                        <form className="form-account" onSubmit={submitConvert}>
                            <div style={{fontSize: 14, color: "#FF5454", paddingLeft: 10, paddingBottom: 5}}>
                                {errorConvert && (<ErrorNotice message={errorConvert}
                                                               clearError={() => setErrorConvert(undefined)}/>)}
                            </div>
                            <div>
                                <label>Currency From: </label>
                                <Select
                                    defaultValue={'£'}
                                    onChange={currencyFromChange}
                                    style={{fontSize: 14}}
                                >
                                    <MenuItem style={{fontSize: 14}} value={'£'}>GBP</MenuItem>
                                    <MenuItem style={{fontSize: 14}} value={'$'}>USD</MenuItem>
                                    <MenuItem style={{fontSize: 14}} value={'€'}>EUR</MenuItem>
                                </Select>
                            </div>
                            <div style={{paddingTop: 10}}>
                                <label>Currency To: </label>
                                <Select
                                    defaultValue={'£'}
                                    onChange={currencyToChange}
                                    style={{fontSize: 14}}
                                >
                                    <MenuItem style={{fontSize: 14}} value={'£'}>GBP</MenuItem>
                                    <MenuItem style={{fontSize: 14}} value={'$'}>USD</MenuItem>
                                    <MenuItem style={{fontSize: 14}} value={'€'}>EUR</MenuItem>
                                </Select>
                            </div>
                            <div style={{paddingTop: 10}}>
                                <label>Amount:  </label>
                                <input
                                    type="text"
                                    name="Amount"
                                    style={{width: 200, height: 25, fontSize: 16}}
                                    onChange={(e) => setAmountConvert(e.target.value)}
                                />
                                <div style={{paddingTop: 10}}>
                                    <input className="button-account" style={{width: 110, fontSize: 12}}
                                           type="submit" value="Submit"/>
                                </div>
                            </div>
                        </form>
                    )

                    }
                </div>
            </div>
        </div>
    )
}