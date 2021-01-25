import React, {useEffect, useState} from "react";
import { MainNavigationBar } from "../../";
import {Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@material-ui/core";
import Axios from "axios";

export default function Transactions () {
    const [showStatement, setShowStatement] = useState(false)
    let user = JSON.parse(sessionStorage.getItem("userData"))

    async function updateData() {
        try {
            const newData = await Axios.post("http://localhost:5000/users/updateData", {PID: user.personalID})
            user = newData.data
            setShowStatement(false)
            sessionStorage.setItem("userData", JSON.stringify(user))
        } catch (err) {

        }
    }
    useEffect(() => {
        updateData();
    }, []);

    return (
        <div className="main-background">
            <MainNavigationBar />
            <section className="main-background">
                <div className="centered-text-default">
                    <h1>Transactions</h1>
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