import React, {useState, useContext} from "react";
import {Button} from "@material-ui/core";
import ErrorNotice from "../misc/ErrorNotice";
import Axios from "axios";
import UserContext from "../../context/UserContext";
import {useHistory} from "react-router-dom"


export default function Accounts() {
    let user = JSON.parse(sessionStorage.getItem("userData"))
    const [payeeID, setPayeeID] = useState();
    const [amount, setAmount] = useState();
    const [error, setError] = useState();
    const [showTransfer, setShowTransfer] = useState(false)

    async function submit(e){
        e.preventDefault();
        try {
            const data ={payerID: user.personalID, payeeID, amount}
            let newBalance = await Axios.post("http://localhost:5000/users/transfer", data);
            user.accountBalance = newBalance.data
            sessionStorage.setItem("userData", JSON.stringify(user));
            user = JSON.parse(sessionStorage.getItem("userData"))
            window.location.reload(true);
        } catch (err) {
            err.response.data.msg && setError(err.response.data.msg);
        }
    }

    const history = useHistory();
    const {userData, setUserData} = useContext(UserContext);
    // This removes the authentication token from the user data and also the local storage when the user logs out
    const logout = () => {
        setUserData({
            token: undefined,
            user: undefined
        })
        localStorage.setItem("auth-token", "")
    }

    async function handleDeleteAccount() {
        try {
            //Gets auth token from local storage and saves to a variable
            const token = localStorage.getItem('auth-token');
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
        }
        catch(err){
            console.log(err);
        }

    }

    return (
        <>
        <div>
            <h2>Accounts</h2>
            <h3>Welcome, {user.firstName.data} {user.lastName.data}</h3>
            Your balance is {user.accountBalance.toFixed(2)}
            <Button variant={"contained"} disableElevation={true} onClick={() => {setShowTransfer(!showTransfer)}}>Transfer</Button>
            {showTransfer && (
                <form className="Form1" onSubmit={submit}>
                    {error && (
                        <ErrorNotice message={error} clearError={() => setError(undefined)} />
                    )}
                    <label>Payee Personal ID: </label>
                    <input
                        type="text"
                        name="name"
                        onChange={(e) => setPayeeID(e.target.value)}
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
        <div>
            <br/>
            <Button variant={"contained"} disableElevation={true} onClick={handleDeleteAccount}>
                Click here to delete account</Button>
        </div>
    </>
    );
}
