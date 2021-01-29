import React, {useEffect, useState} from "react";
import { MainNavigationBar } from "../../";
import qrcode from "qrcode";
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@material-ui/core";
import {useHistory} from "react-router-dom";
import Axios from "axios";

/**
 *
 * @returns {JSX.Element}
 * @constructor
 */
export default function Overview() {
    let user = JSON.parse(sessionStorage.getItem("userData"));
    const history = useHistory();
    if (user == null || user.role !== "user") {
        sessionStorage.clear()
        history.push('/home')
        history.go(0)
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

    //checks user is logged in when the page updates
    useEffect(() => {
        const logged = checkLoggedIn()
        if (logged === false){
            sessionStorage.clear()
            history.push('/home')
            history.go(0)
        }
    }, []);

    const [balanceGBP] = useState(user.accountBalanceGBP.data);
    const [balanceUSD] = useState(user.accountBalanceUSD.data);
    const [balanceEUR] = useState(user.accountBalanceEUR.data);
    const [qrCodeImg, setQrCodeImg] = useState();

        //Converts totpSecret into a string to display the qr code so it can be scanned with google auth (if user logged in)
        if(
    !qrCodeImg && user
)
    {
        let totpSecret = user.totpSecret;
        qrcode.toDataURL(totpSecret.otpauth_url, function (err, data) {
            setQrCodeImg(data);
        })
    }

    return (
        <div className="top-bar">
            <MainNavigationBar/>
            <div className="main-background">
                <div className="small-bank-box-left">
                    <h1>Information</h1>
                    <p style={{color: "black", fontSize: 18, paddingLeft: 20, paddingTop: 10, paddingBottom: 15}}>
                        Welcome, {user.firstName.data} {user.lastName.data}!</p>
                    <p style={{color: "black", fontSize: 16, paddingLeft: 25, paddingRight: 25, paddingBottom: 5}}>
                        Please, scan this QR code with Google Authenticator app on your smartphone to protect
                        your account with 2 Factor Authentication.</p>
                    <p style={{color: "#FF5454", fontSize: 14, paddingLeft: 30, paddingRight: 25}}>
                        You will not be able to login without it!
                    </p>
                    <div style={{paddingLeft: 120}}>
                        <img style={{height: 300}} src={qrCodeImg} alt=""/>
                    </div>
                </div>
                <div className="small-bank-box-right">
                    <h1>Account Balance</h1>
                    <p style={{color: "black", fontSize: 18, paddingLeft: 30, paddingTop: 15, paddingBottom: 10}}>
                        Your total GBP balance: £{Number(balanceGBP).toFixed(2)}</p>
                    <p style={{color: "black", fontSize: 18, paddingLeft: 30, paddingTop: 5, paddingBottom: 10}}>
                        Your total USD balance: ${Number(balanceUSD).toFixed(2)}</p>
                    <p style={{color: "black", fontSize: 18, paddingLeft: 30, paddingTop: 5, paddingBottom: 10}}>
                        Your total EUR balance: €{Number(balanceEUR).toFixed(2)}</p>
                    <h1 style={{paddingTop: 25}}>Your Most Recent Transactions</h1>
                    <div className="table">
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell className="font-headings">Date</TableCell>
                                        <TableCell className="font-headings">Amount In</TableCell>
                                        <TableCell className="font-headings">Amount Out</TableCell>
                                        <TableCell className="font-headings">Account</TableCell>
                                        <TableCell className="font-headings">Balance</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {user.transactions.reverse().slice(0, 6).map((transaction) => (
                                        <TableRow key={transaction.date}>
                                            <TableCell component="th" scope="row" className="font-information">
                                                {transaction.date}
                                            </TableCell>
                                            <TableCell className="font-information">{transaction.amountIn}</TableCell>
                                            <TableCell className="font-information">{transaction.amountOut}</TableCell>
                                            <TableCell className="font-information">{transaction.account}</TableCell>
                                            <TableCell className="font-information">{transaction.balance}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                </div>
            </div>
        </div>
    )
}