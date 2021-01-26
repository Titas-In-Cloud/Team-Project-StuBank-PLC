import React, {useEffect, useState} from "react";
import {MainNavigationBar} from "../../";
import {Button} from "@material-ui/core";
import ErrorNotice from "../../misc/ErrorNotice";
import Axios from "axios";

export default function Cards () {
    let user = JSON.parse(sessionStorage.getItem("userData"))
    const [cardNumber, setCardNumber] = useState(user.cardNumber.data)
    const [CVV, setCVV] = useState(user.CVV.data)
    const [frozen, setFrozen] = useState(user.frozenCard)
    const [errorCards, setErrorCards] = useState();

    async function updateData() {
        try {
            const newData = await Axios.post("http://localhost:5000/users/updateData", {PID: user.personalID})
            user = newData.data
            setCardNumber(user.cardNumber.data)
            setCVV(user.CVV.data)
            setFrozen(user.frozenCard)
            sessionStorage.setItem("userData", JSON.stringify(user))
        } catch (err) {
            err.response.data.msg && setErrorCards(err.response.data.msg)
        }
    }

    useEffect(() => {
        updateData();
    }, []);

    async function submitCards(e) {
        e.preventDefault();
        try {
            const data = {cardNumber, CVV, frozen, PID: user.personalID}
            await Axios.post("http://localhost:5000/users/newVirtualCard", data)
            await updateData()
        } catch (err) {
            err.response.data.msg && setErrorCards(err.response.data.msg)
        }
    }

    function randomNum(){
        return String(Math.floor(Math.random() * 10))
    }

    function generateNumbers(){
        setCardNumber(randomNum() + randomNum() + randomNum() + randomNum() + ' ' + randomNum() + randomNum() +
            randomNum() + randomNum() + ' ' + randomNum() + randomNum() + randomNum() + randomNum() + ' ' + randomNum()
            + randomNum() + randomNum() + randomNum())
        setCVV(randomNum() + randomNum() + randomNum())
    }

    return (
        <div className="main-background">
            <MainNavigationBar />
            <section className="main-background">
                <div className="centered-text-default">
                    <h1>Cards</h1>
                    <div>
                        <Button variant={"contained"} disableElevation={true} onClick={() => {
                            generateNumbers()
                        }}>Generate Card</Button>
                    </div>
                    <form className="Form1" onSubmit = {submitCards}>
                        {errorCards && (<ErrorNotice message={errorCards} clearError={() => setErrorCards(undefined)}/>)}
                        <label>Card Number: </label>
                        <input
                            type="text"
                            name="Card Number"
                            readOnly={true}
                            value ={cardNumber}
                        />
                        <label>CVV: </label>
                        <input
                            type="text"
                            name="CVV"
                            value = {CVV}
                            readOnly={true}
                        />
                        <label>Freeze Card: </label>
                        <input
                            type="checkbox"
                            name="Freeze"
                            defaultChecked = {frozen}
                            onChange = {(e) => setFrozen(!frozen)}
                        />
                        <input type="submit" value="Submit"/>
                    </form>
                </div>
            </section>
        </div>
    )
}