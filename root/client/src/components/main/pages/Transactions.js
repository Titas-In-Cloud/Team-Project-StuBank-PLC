import React, {useEffect, useState} from "react";
import { MainNavigationBar } from "../../";
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@material-ui/core";
import Axios from "axios";
import {useHistory} from "react-router-dom";

export default function Transactions () {
    const [setShowStatement] = useState(false)
    let user = JSON.parse(sessionStorage.getItem("userData"))
    const history = useHistory();
    if (user == null || user.role !== "user") {
        sessionStorage.clear()
        history.push('/home')
        history.go(0)
    }

    async function updateData() {
        try {
            const newData = await Axios.post("http://localhost:5000/users/updateData", {PID: user.personalID})
            user = newData.data
            setShowStatement(false)
            sessionStorage.setItem("userData", JSON.stringify(user))
        } catch (err) {

        }
    }

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

    useEffect(() => {
        const logged = checkLoggedIn()
        if (logged === false){
            sessionStorage.clear()
            history.push('/home')
            history.go(0)
        }
        updateData();
    }, []);

    return (
        <div className="top-bar">
            <MainNavigationBar />
            <div className="main-background">
                <div className="big-bank-box">
                    <h1>Transaction History</h1>
                    <div className="table" style={{paddingBottom: 30}}>
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
                                    {user.transactions.reverse().map((transaction) => (
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