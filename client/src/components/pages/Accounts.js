import React, {useEffect, useState} from "react";
import {Button} from "@material-ui/core";
import ErrorNotice from "../misc/ErrorNotice";
import Axios from "axios";
import CreatableSelect from 'react-select/creatable';

export default function Accounts() {
    let user = JSON.parse(sessionStorage.getItem("userData"))
    const [amount, setAmount] = useState();
    const [error, setError] = useState();
    const [showTransfer, setShowTransfer] = useState(false)
    const [balance, setBalance] = useState(user.accountBalance)
    const [recipient, setRecipient] = useState({label: '', value: ''})

    useEffect(() => {
        async function newBalance(){
            try{
                const newBalance = await Axios.post("http://localhost:5000/users/updateBalance", {PID: user.personalID})
                setBalance(newBalance.data.accountBalance)
                setShowTransfer(false)
                user.accountBalance = balance
                sessionStorage.setItem("userData", JSON.stringify(user))
            }
            catch(err){
                err.response.data.msg && setError(err.response.data.msg)
            }
        }
        newBalance();
    }, []);

    async function submit(e){
        e.preventDefault();
        try {
            const data ={payerID: user.personalID, payeeID: recipient, amount}
            const newBalance = await Axios.post("http://localhost:5000/users/transfer", data)
            setBalance(newBalance.data)
            setShowTransfer(false)
            user.accountBalance = newBalance.data
            sessionStorage.setItem("userData", JSON.stringify(user))
        } catch (err) {
            err.response.data.msg && setError(err.response.data.msg)
        }
    }

    const recipientChange = (input) => {
        setRecipient(input)
    };

    return (
        <div>
            <h2>Accounts</h2>
            <h3>Welcome, {user.firstName.data} {user.lastName.data}</h3>
            Your balance is {balance.toFixed(2)}
            <div>
                <Button variant={"contained"} disableElevation={true} onClick={() => {setShowTransfer(!showTransfer)}}>Transfer</Button>
            </div>
            {showTransfer && (
            <form className="Form1" onSubmit={submit}>
                {error && (<ErrorNotice message={error} clearError={() => setError(undefined)} />)}
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
    );
}